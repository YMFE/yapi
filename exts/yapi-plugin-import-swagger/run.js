const _ = require('underscore')
const swagger = require('swagger-client');
const compareVersions = require('compare-versions');
const refParser = require('json-schema-ref-parser');

  const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
  var SwaggerData, isOAS3;
  function handlePath(path) {
    if (path === '/') return path;
    if (path.charAt(0) != '/') {
      path = '/' + path;
    }
    if (path.charAt(path.length - 1) === '/') {
      path = path.substr(0, path.length - 1);
    }
    return path;
  }

  function normalizeVersion(version) {
    return String(version || '').trim().split('-')[0];
  }

  function isOpenApi3Version(version) {
    let cleanVersion = normalizeVersion(version);
    if (!cleanVersion) return false;
    try {
      return compareVersions(cleanVersion, '3.0.0') >= 0;
    } catch (e) {
      return false;
    }
  }

  function normalizeMimeType(type) {
    return String(type || '')
      .split(';')[0]
      .trim()
      .toLowerCase();
  }

  function collectContentEntries(content) {
    if (!content || typeof content !== 'object') return [];
    return Object.keys(content).map(key => {
      return {
        key,
        mime: normalizeMimeType(key),
        value: content[key]
      };
    });
  }

  function isJsonLikeMime(mime) {
    return mime === 'application/json' || mime.endsWith('+json');
  }

  function pickContentEntry(content) {
    const entries = collectContentEntries(content);
    if (entries.length === 0) return null;
    const priorities = [
      entry => entry.mime === 'application/json',
      entry => entry.mime.endsWith('+json'),
      entry => entry.mime === 'application/hal+json',
      entry => entry.mime === 'application/xml',
      entry => entry.mime === 'text/plain',
      entry => entry.mime === '*/*'
    ];
    for (let i = 0; i < priorities.length; i++) {
      const entry = entries.find(priorities[i]);
      if (entry) return entry;
    }
    return entries[0];
  }

  function mergeMediaTypes(target, next) {
    let current = Array.isArray(target) ? target.slice() : [];
    let additions = Array.isArray(next) ? next : [];
    additions.forEach(item => {
      if (current.indexOf(item) === -1) current.push(item);
    });
    return current;
  }

  function inferConsumes(content) {
    const entries = collectContentEntries(content);
    let consumes = entries.map(entry => entry.mime);
    if (entries.some(entry => isJsonLikeMime(entry.mime))) {
      consumes = mergeMediaTypes(consumes, ['application/json']);
    }
    return consumes;
  }

  function inferProduces(responses) {
    let produces = [];
    if (!responses || typeof responses !== 'object') return produces;
    Object.keys(responses).forEach(code => {
      let res = responses[code];
      if (!res || typeof res !== 'object') return;
      if (!res.content) return;
      const entries = collectContentEntries(res.content);
      entries.forEach(entry => {
        if (isJsonLikeMime(entry.mime)) {
          produces = mergeMediaTypes(produces, ['application/json']);
        }
      });
    });
    return produces;
  }

  function isFileSchema(schema) {
    if (!schema || typeof schema !== 'object') return false;
    let type = Array.isArray(schema.type) ? schema.type.filter(t => t !== 'null')[0] : schema.type;
    return type === 'string' && schema.format === 'binary';
  }

  function buildFormDataParameters(schema) {
    if (!schema || typeof schema !== 'object') return [];
    if (schema.type !== 'object' || !schema.properties) return [];
    const required = Array.isArray(schema.required) ? schema.required : [];
    return Object.keys(schema.properties).map(name => {
      let prop = schema.properties[name] || {};
      let param = {
        name,
        in: 'formData',
        description: prop.description,
        required: required.indexOf(name) > -1
      };
      param.type = isFileSchema(prop) ? 'file' : 'text';
      if (prop.example !== undefined) {
        param.example = prop.example;
      }
      return param;
    });
  }

  function openapi2swagger(data) {
    data.swagger = '2.0';
    _.each(data.paths, apis => {
      _.each(apis, api => {
        if (!api || typeof api !== 'object') return;
        const produces = inferProduces(api.responses);
        _.each(api.responses, res => {
          if (!res || typeof res !== 'object') return;
          if (res.content && typeof res.content === 'object') {
            const entry = pickContentEntry(res.content);
            if (entry && entry.value && typeof entry.value === 'object') {
              if (entry.value.schema) {
                res.schema = entry.value.schema;
              }
              delete res.content;
            }
          }
        });
        api.produces = mergeMediaTypes(api.produces, produces);
        if (api.requestBody && api.requestBody.content) {
          if (!api.parameters) api.parameters = [];
          const consumes = inferConsumes(api.requestBody.content);
          api.consumes = mergeMediaTypes(api.consumes, consumes);
          const formEntry = collectContentEntries(api.requestBody.content).find(entry => {
            return entry.mime === 'application/x-www-form-urlencoded' || entry.mime === 'multipart/form-data';
          });
          if (formEntry && formEntry.value && formEntry.value.schema) {
            const formParams = buildFormDataParameters(formEntry.value.schema);
            if (formParams.length > 0) {
              formParams.forEach(param => api.parameters.push(param));
              return;
            }
          }
          let body = {
            type: 'object',
            name: 'body',
            in: 'body'
          };
          const entry = pickContentEntry(api.requestBody.content);
          if (entry && entry.value && typeof entry.value === 'object') {
            body.schema = entry.value.schema || {};
          } else {
            body.schema = {};
          }
          api.parameters.push(body);
        }
      });
    });

    return data;
  }

  async function handleSwaggerData(res) {
    try {
      if (res && res.openapi && isOpenApi3Version(res.openapi)) {
        return await refParser.dereference(res, { dereference: { circular: 'ignore' } });
      }
      let data = swagger({
        spec: res
      });
      let result = await data;
      return result.spec;
    } catch (err) {
      try {
        return await refParser.dereference(res, { dereference: { circular: 'ignore' } });
      } catch (e) {
        return res;
      }
    }
  }

  async function run(res) {
      let interfaceData = { apis: [], cats: [] };
      if(typeof res === 'string' && res){
        try{
          res = JSON.parse(res);
        } catch (e) {
          console.error('json 解析出错',e.message)
        }
      }

      isOAS3 = res.openapi && isOpenApi3Version(res.openapi);
      if (isOAS3) {
        res = openapi2swagger(res);
      }
      res = await handleSwaggerData(res);
      SwaggerData = res;

      interfaceData.basePath = res.basePath || '';
      if (!interfaceData.basePath && res.servers && Array.isArray(res.servers)) {
        interfaceData.basePath = getBasePathFromServers(res.servers);
      }

      if (res.tags && Array.isArray(res.tags)) {
        res.tags.forEach(tag => {
          interfaceData.cats.push({
            name: tag.name,
            desc: tag.description
          });
        });
      }else{
        res.tags = []
      }

      _.each(res.paths, (apis, path) => {
        if (!apis || typeof apis !== 'object') return;
        let commonParams = Array.isArray(apis.parameters) ? apis.parameters : [];
        _.each(apis, (api, method) => {
          if (HTTP_METHODS.indexOf(method) === -1) return;
          api.path = path;
          api.method = method;
          if (commonParams.length > 0) {
            api.parameters = mergeParameters(api.parameters, commonParams);
          }
          let data = null;
          try {
            data = handleSwagger(api, res.tags);
            if (data.catname) {
              if (!_.find(interfaceData.cats, item => item.name === data.catname)) {
                if(res.tags.length === 0){
                  interfaceData.cats.push({
                    name: data.catname,
                    desc: data.catname
                  });
                }
              }
            }
          } catch (err) {
            data = null;
          }
          if (data) {
            interfaceData.apis.push(data);
          }
        });
      });

      interfaceData.cats = interfaceData.cats.filter(catData=>{
        let catName = catData.name;
        return _.find(interfaceData.apis, apiData=>{
          return apiData.catname === catName
        })
      })

      return interfaceData;
  }

  function handleSwagger(data, originTags= []) {

    let api = {};
    //处理基本信息
    api.method = data.method.toUpperCase();
    api.title = data.summary || data.path;
    api.desc = data.description;
    api.catname = null;
    if(data.tags && Array.isArray(data.tags)){
      api.tag = data.tags;
      for(let i=0; i< data.tags.length; i++){
        if(/v[0-9\.]+/.test(data.tags[i])){
          continue;
        }

        // 如果根路径有 tags，使用根路径 tags,不使用每个接口定义的 tag 做完分类
        if(originTags.length > 0 && _.find(originTags, item=>{
          return item.name === data.tags[i]
        })){
          api.catname = data.tags[i];
          break;
        }

        if(originTags.length === 0){
          api.catname = data.tags[i];
          break;
        }
        
      }

    }

    api.path = handlePath(data.path);
    api.req_params = [];
    api.req_body_form = [];
    api.req_headers = [];
    api.req_query = [];
    api.req_body_type = 'raw';
    api.res_body_type = 'raw';

    if (data.produces && data.produces.indexOf('application/json') > -1) {
      api.res_body_type = 'json';
      api.res_body_is_json_schema = true;
    }

    if (data.consumes && Array.isArray(data.consumes)) {
      if (
        data.consumes.indexOf('application/x-www-form-urlencoded') > -1 ||
        data.consumes.indexOf('multipart/form-data') > -1
      ) {
        api.req_body_type = 'form';
      } else if (data.consumes.indexOf('application/json') > -1) {
        api.req_body_type = 'json';
        api.req_body_is_json_schema = true;
      }
    }

    //处理response
    api.res_body = handleResponse(data.responses);
    try {
      JSON.parse(api.res_body);
      api.res_body_type = 'json';
      api.res_body_is_json_schema = true;
    } catch (e) {
      api.res_body_type = 'raw';
    }
    //处理参数
    function simpleJsonPathParse(key, json) {
      if (!key || typeof key !== 'string' || key.indexOf('#/') !== 0 || key.length <= 2) {
        return null;
      }
      let keys = key.substr(2).split('/');
      keys = keys.filter(item => {
        return item;
      });
      for (let i = 0, l = keys.length; i < l; i++) {
        try {
          json = json[keys[i]];
        } catch (e) {
          json = '';
          break;
        }
      }
      return json;
    }

    if (data.parameters && Array.isArray(data.parameters)) {
      data.parameters.forEach(param => {
        if (param && typeof param === 'object' && param.$ref) {
          param = simpleJsonPathParse(param.$ref, SwaggerData);
        }
        if (!param || typeof param !== 'object') return;
        let defaultParam = {
          name: param.name,
          desc: param.description,
          required: param.required ? '1' : '0'
        };

        if (param.in) {
        switch (param.in) {
          case 'path':
            api.req_params.push(defaultParam);
            break;
          case 'query':
            api.req_query.push(defaultParam);
            break;
          case 'body':
            handleBodyPamras(param.schema, api);
            break;
          case 'formData':
            defaultParam.type = param.type === 'file' ? 'file' : 'text';
			if (param.example) {
              defaultParam.example = param.example;
            }
            api.req_body_form.push(defaultParam);
            break;
          case 'header':
            api.req_headers.push(defaultParam);
            break;
        }
      } else {
        api.req_query.push(defaultParam);
      }
      });
    }

    return api;
  }

  function isJson(json) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  function handleBodyPamras(data, api) {
    api.req_body_other = JSON.stringify(data, null, 2);
    if (isJson(api.req_body_other)) {
      api.req_body_type = 'json';
      api.req_body_is_json_schema = true;
    }
  }

  function handleResponse(api) {
    let res_body = '';
    if (!api || typeof api !== 'object') {
      return res_body;
    }
    let codes = Object.keys(api);
    let curCode;
    if (codes.length > 0) {
      if (codes.indexOf('200') > -1) {
        curCode = '200';
      } else {
        curCode = codes.find(code => /^[2][0-9][0-9]$/.test(code)) || codes.find(code => /^2xx$/i.test(code));
        if (!curCode && codes.indexOf('default') > -1) {
          curCode = 'default';
        }
        if (!curCode) {
          curCode = codes[0];
        }
      }

      let res = api[curCode];
      if (res && typeof res === 'object') {
        if (res.schema) {
          res_body = JSON.stringify(res.schema, null, 2);
        } else if (res.description) {
          res_body = res.description;
        }
      } else if (typeof res === 'string') {
        res_body = res;
      } else {
        res_body = '';
      }
    } else {
      res_body = '';
    }
    return res_body;
  }

  function mergeParameters(target, source) {
    let current = Array.isArray(target) ? target.slice() : [];
    let additions = Array.isArray(source) ? source : [];
    return current.concat(additions);
  }

  function getBasePathFromServers(servers) {
    if (!Array.isArray(servers) || servers.length === 0) return '';
    const serverUrl = servers[0] && servers[0].url ? servers[0].url : '';
    if (!serverUrl) return '';
    if (serverUrl.indexOf('/') === 0) return serverUrl;
    try {
      const url = require('url');
      const parsed = url.parse(serverUrl);
      return parsed.pathname || '';
    } catch (e) {
      return '';
    }
  }




module.exports = run;
