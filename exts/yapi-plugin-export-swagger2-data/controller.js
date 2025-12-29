const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const projectModel = require('models/project.js');
const interfaceCatModel = require('models/interfaceCat.js');
const yapi = require('yapi.js');


class exportSwaggerController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.catModel = yapi.getInst(interfaceCatModel);
        this.interModel = yapi.getInst(interfaceModel);
        this.projectModel = yapi.getInst(projectModel);
    }

    /*
       handleListClass,handleExistId is same as the exportController(yapi-plugin-export-data).
       No DRY,but i have no idea to optimize it.
    */

    async handleListClass(pid, status) {
        let result = await this.catModel.list(pid),
            newResult = [];
        for (let i = 0, item, list; i < result.length; i++) {
            item = result[i].toObject();
            list = await this.interModel.listByInterStatus(item._id, status);
            list = list.sort((a, b) => {
                return a.index - b.index;
            });
            if (list.length > 0) {
                item.list = list;
                newResult.push(item);
            }
        }

        return newResult;
    }

    handleExistId(data) {
        function delArrId(arr, fn) {
            if (!Array.isArray(arr)) return;
            arr.forEach(item => {
                delete item._id;
                delete item.__v;
                delete item.uid;
                delete item.edit_uid;
                delete item.catid;
                delete item.project_id;

                if (typeof fn === 'function') fn(item);
            });
        }

        delArrId(data, function (item) {
            delArrId(item.list, function (api) {
                delArrId(api.req_body_form);
                delArrId(api.req_params);
                delArrId(api.req_query);
                delArrId(api.req_headers);
                if (api.query_path && typeof api.query_path === 'object') {
                    delArrId(api.query_path.params);
                }
            });
        });

        return data;
    }

    async exportData(ctx) {
        let pid = ctx.request.query.pid;
        let type = ctx.request.query.type;
        let status = ctx.request.query.status;

        if (!pid) {
            ctx.body = yapi.commons.resReturn(null, 200, 'pid 不为空');
        }
        let curProject;
        let tp = '';
        try {
            curProject = await this.projectModel.get(pid);
            ctx.set('Content-Type', 'application/octet-stream');
            const list = await this.handleListClass(pid, status);

            switch (type) {
                case 'OpenAPIV2':
                    { //in this time, only implemented OpenAPI V2.0
                        let data = this.handleExistId(list);
                        let model = await convertToSwaggerV2Model(data);
                        tp = JSON.stringify(model, null, 2);
                        ctx.set('Content-Disposition', `attachment; filename=swaggerApi.json`);
                        return (ctx.body = tp);
                    }
                case 'OpenAPIV31':
                    {
                        let data = this.handleExistId(list);
                        let model = await convertToOpenApiV31Model(data);
                        tp = JSON.stringify(model, null, 2);
                        ctx.set('Content-Disposition', `attachment; filename=openapi31.json`);
                        return (ctx.body = tp);
                    }
                default:
                    {
                        ctx.body = yapi.commons.resReturn(null, 400, 'type 无效参数')
                    }
            }
        } catch (error) {
            yapi.commons.log(error, 'error');
            ctx.body = yapi.commons.resReturn(null, 502, '下载出错');
        }

        //Convert to SwaggerV2.0 (OpenAPI 2.0)
        async function convertToSwaggerV2Model(list) {
            const swaggerObj = {
                swagger: '2.0',
                info: {
                    title: curProject.name,
                    version: 'last', // last version
                    description: curProject.desc
                },
                //host: "",             // No find any info of host in this point :-)
                basePath: curProject.basepath ? curProject.basepath : '/', //default base path is '/'(root)
                tags: (() => {
                    let tagArray = [];
                    list.forEach(t => {
                        tagArray.push({
                            name: t.name,
                            description: t.desc
                            /*externalDocs:{
                                descroption:"",
                                url:""
                            } */
                        });
                    });
                    return tagArray;
                })(),
                schemes: [
                    "http" //Only http
                ],
                paths: (() => {
                    let apisObj = {};
                    for (let aptTag of list) { //list of category
                        for (let api of aptTag.list) //list of api
                        {
                            if (apisObj[api.path] == null) {
                                apisObj[api.path] = {};
                            }
                            apisObj[api.path][api.method.toLowerCase()] = (() => {
                                let apiItem = {};
                                apiItem['tags'] = [aptTag.name];
                                apiItem['summary'] = api.title;
                                apiItem['description'] = api.markdown;
                                switch (api.req_body_type) {
                                    case 'form':
                                    case 'file':
                                        apiItem['consumes'] = ['multipart/form-data']; //form data required
                                        break;
                                    case 'json':
                                        apiItem['consumes'] = ['application/json'];
                                        break;
                                    case 'raw':
                                        apiItem['consumes'] = ['text/plain'];
                                        break;
                                    default:
                                        break;
                                }
                                apiItem['parameters'] = (() => {
                                    let paramArray = [];
                                    for (let p of api.req_headers) //Headers parameters
                                    {
                                        //swagger has consumes proprety, so skip proprety "Content-Type"
                                        if (p.name === 'Content-Type') {
                                            continue;
                                        }
                                        paramArray.push({
                                            name: p.name,
                                            in: 'header',
                                            description: `${p.name} (Only:${p.value})`,
                                            required: Number(p.required) === 1,
                                            type: 'string', //always be type string
                                            default: p.value
                                        });
                                    }
                                    for (let p of api.req_params) //Path parameters
                                    {
                                        paramArray.push({
                                            name: p.name,
                                            in: 'path',
                                            description: p.desc,
                                            required: true, //swagger path parameters required proprety must be always true,
                                            type: 'string' //always be type string
                                        });
                                    }
                                    for (let p of api.req_query) //Query parameters
                                    {
                                        paramArray.push({
                                            name: p.name,
                                            in: 'query',
                                            required: Number(p.required) === 1,
                                            description: p.desc,
                                            type: 'string' //always be type string
                                        });
                                    }
                                    switch (api.req_body_type) //Body parameters
                                    {
                                        case 'form':
                                            {
                                                for (let p of api.req_body_form) {
                                                    paramArray.push({
                                                        name: p.name,
                                                        in: 'formData',
                                                        required: Number(p.required) === 1,
                                                        description: p.desc,
                                                        type: p.type === 'text' ? 'string' : 'file' //in this time .formData type have only text or file
                                                    });
                                                }
                                                break;
                                            }
                                        case 'json':
                                            {
                                                if (api.req_body_other) {
                                                    let jsonParam = JSON.parse(api.req_body_other);
                                                    if (jsonParam) {
                                                        paramArray.push({
                                                            name: 'root',
                                                            in: 'body',
                                                            description: jsonParam.description,
                                                            schema: jsonParam //as same as swagger's format
                                                        });
                                                    }
                                                }
                                                break;
                                            }
                                        case 'file':
                                            {
                                                paramArray.push({
                                                    name: 'upfile',
                                                    in: 'formData', //use formData
                                                    description: api.req_body_other,
                                                    type: 'file'
                                                });
                                                break;
                                            }
                                        case 'raw':
                                            {
                                                paramArray.push({
                                                    name: 'raw',
                                                    in: 'body',
                                                    description: 'raw paramter',
                                                    schema: {
                                                        type: 'string',
                                                        format: 'binary',
                                                        default: api.req_body_other
                                                    }
                                                });
                                                break;
                                            }
                                        default:
                                            break;
                                    }
                                    return paramArray;
                                })();
                                apiItem['responses'] = {
                                    '200': {
                                        description: 'successful operation',
                                        schema: (() => {
                                            let schemaObj = {};
                                            if (api.res_body_type === 'raw') {
                                                schemaObj['type'] = 'string';
                                                schemaObj['format'] = 'binary';
                                                schemaObj['default'] = api.res_body;
                                            } else if (api.res_body_type === 'json') {
                                                if (api.res_body) {
                                                    let resBody = JSON.parse(api.res_body);
                                                    if (resBody !== null) {
                                                        //schemaObj['type']=resBody.type;
                                                        schemaObj = resBody; //as the parameters, 
                                                    }
                                                }
                                            }
                                            return schemaObj;
                                        })()
                                    }
                                };
                                return apiItem;
                            })();
                        }
                    }
                    return apisObj;
                })()
            };
            return swaggerObj;
        }

        async function convertToOpenApiV31Model(list) {
            const openapiObj = {
                openapi: '3.1.1',
                info: {
                    title: curProject.name,
                    version: 'last',
                    description: curProject.desc
                },
                servers: [{
                    url: curProject.basepath ? curProject.basepath : '/'
                }],
                tags: (() => {
                    let tagArray = [];
                    list.forEach(t => {
                        tagArray.push({
                            name: t.name,
                            description: t.desc
                        });
                    });
                    return tagArray;
                })(),
                paths: (() => {
                    let apisObj = {};
                    for (let aptTag of list) {
                        for (let api of aptTag.list) {
                            if (apisObj[api.path] == null) {
                                apisObj[api.path] = {};
                            }
                            apisObj[api.path][api.method.toLowerCase()] = (() => {
                                let apiItem = {};
                                let parameters = [];
                                apiItem['tags'] = [aptTag.name];
                                apiItem['summary'] = api.title;
                                apiItem['description'] = api.markdown;

                                api.req_headers.forEach(p => {
                                    if (p.name === 'Content-Type') {
                                        return;
                                    }
                                    let headerParam = {
                                        name: p.name,
                                        in: 'header',
                                        description: p.desc,
                                        required: Number(p.required) === 1,
                                        schema: {
                                            type: 'string'
                                        }
                                    };
                                    if (p.value !== undefined && p.value !== '') {
                                        headerParam.schema.default = p.value;
                                    }
                                    parameters.push(headerParam);
                                });
                                api.req_params.forEach(p => {
                                    parameters.push({
                                        name: p.name,
                                        in: 'path',
                                        description: p.desc,
                                        required: true,
                                        schema: {
                                            type: 'string'
                                        }
                                    });
                                });
                                api.req_query.forEach(p => {
                                    parameters.push({
                                        name: p.name,
                                        in: 'query',
                                        description: p.desc,
                                        required: Number(p.required) === 1,
                                        schema: {
                                            type: 'string'
                                        }
                                    });
                                });
                                if (parameters.length > 0) {
                                    apiItem['parameters'] = parameters;
                                }

                                let requestBody = buildOpenApiRequestBody(api);
                                if (requestBody) {
                                    apiItem['requestBody'] = requestBody;
                                }
                                apiItem['responses'] = buildOpenApiResponses(api);

                                return apiItem;
                            })();
                        }
                    }
                    return apisObj;
                })()
            };
            return openapiObj;
        }

        function buildOpenApiRequestBody(api) {
            switch (api.req_body_type) {
                case 'form':
                    return buildOpenApiFormRequestBody(api);
                case 'file':
                    return buildOpenApiFileRequestBody(api);
                case 'json':
                    return buildOpenApiJsonRequestBody(api);
                case 'raw':
                default:
                    return buildOpenApiRawRequestBody(api);
            }
        }

        function buildOpenApiFormRequestBody(api) {
            let schema = buildFormSchema(api.req_body_form);
            if (!schema) return null;
            let hasFile = api.req_body_form.some(item => item.type === 'file');
            let contentType = hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded';
            return {
                content: {
                    [contentType]: {
                        schema
                    }
                }
            };
        }

        function buildOpenApiFileRequestBody(api) {
            return {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                upfile: {
                                    type: 'string',
                                    format: 'binary',
                                    description: api.req_body_other || 'file'
                                }
                            },
                            required: ['upfile']
                        }
                    }
                }
            };
        }

        function buildOpenApiJsonRequestBody(api) {
            let schema = parseJsonSchema(api.req_body_other) || {};
            return {
                content: {
                    'application/json': {
                        schema
                    }
                }
            };
        }

        function buildOpenApiRawRequestBody(api) {
            if (!api.req_body_other) return null;
            return {
                content: {
                    'text/plain': {
                        schema: {
                            type: 'string'
                        },
                        example: api.req_body_other
                    }
                }
            };
        }

        function buildOpenApiResponses(api) {
            let response = {
                description: 'successful operation'
            };
            if (api.res_body_type === 'json') {
                let schema = parseJsonSchema(api.res_body) || {};
                response.content = {
                    'application/json': {
                        schema
                    }
                };
            } else if (api.res_body_type === 'raw') {
                response.content = {
                    'text/plain': {
                        schema: {
                            type: 'string'
                        },
                        example: api.res_body || ''
                    }
                };
            }
            return {
                '200': response
            };
        }

        function buildFormSchema(formParams) {
            if (!Array.isArray(formParams) || formParams.length === 0) return null;
            let properties = {};
            let required = [];
            formParams.forEach(item => {
                if (!item || !item.name) return;
                let propSchema = {
                    type: 'string'
                };
                if (item.type === 'file') {
                    propSchema.format = 'binary';
                }
                if (item.desc) {
                    propSchema.description = item.desc;
                }
                if (item.example !== undefined) {
                    propSchema.example = item.example;
                }
                properties[item.name] = propSchema;
                if (Number(item.required) === 1) {
                    required.push(item.name);
                }
            });
            let schema = {
                type: 'object',
                properties
            };
            if (required.length > 0) {
                schema.required = required;
            }
            return schema;
        }

        function parseJsonSchema(value) {
            if (!value) return null;
            try {
                return JSON.parse(value);
            } catch (e) {
                return null;
            }
        }
    }
}

module.exports = exportSwaggerController;
