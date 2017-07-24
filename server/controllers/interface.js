import interfaceModel from '../models/interface.js'
import baseController from './base.js'
import yapi from '../yapi.js'

class interfaceController extends baseController{
    constructor(ctx){
        super(ctx)
        this.Model = yapi.getInst(interfaceModel);
    }

    /**
     * 添加项目分组
     * @interface /interface/add
     * @method POST
     * @category interface
     * @foldnumber 10
     * @param {Number}   project_id 项目id，不能为空
     * @param {String}   title 接口标题，不能为空
     * @param {String}   path 接口请求路径，不能为空
     * @param {String}   method 请求方式
     * @param {Array}  [req_headers] 请求的header信息
     * @param {String}  [req_headers[].name] 请求的header信息名
     * @param {String}  [req_headers[].value] 请求的header信息值
     * @param {Boolean}  [req_headers[].required] 是否是必须，默认为否
     * @param {String}  [req_headers[].desc] header描述
     * @param {String}  [req_params_type] 请求参数方式，有["form", "json", "text", "xml"]四种
     * @param {Mixed}  [req_params_form] 请求参数,如果请求方式是form，参数是Array数组，其他格式请求参数是字符串
     * @param {String} [req_params_form[].name] 请求参数名
     * @param {String} [req_params_form[].value] 请求参数值，可填写生成规则（mock）。如@email，随机生成一条email
     * @param {String} [req_params_form[].type] 请求参数类型，有["text", "file"]两种
     * @param {String} [req_params_other]  非form类型的请求参数可保存到此字段
     * @param {String}  [res_body_type] 相应信息的数据格式，有["json", "text", "xml"]三种
     * @param {String} [res_body] 响应信息，可填写任意字符串，如果res_body_type是json,则会调用mock功能
     * @param  {String} [desc] 接口描述 
     * @returns {Object} 
     * @example ./api/interface/add.json
     */
    async add(ctx){
        let params = ctx.request.body;
        params.method = params.method || 'GET';
        params.method = params.method.toUpperCase()
        params.res_body_type = params.res_body_type ? params.res_body_type.toLowerCase() : 'json';
        if(!params.project_id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        if(!params.path){
            return ctx.body = yapi.commons.resReturn(null, 400, '接口请求路径不能为空');
        }

        let checkRepeat = await this.Model.checkRepeat(params.path, params.method);
        if(checkRepeat > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']');
        }       

        try{
            let data = {
                project_id: params.project_id,
                title: params.title,
                path: params.path,
                desc: params.desc,
                method: params.method,
                req_headers: params.req_headers,
                req_params_type: params.req_params_type,
                res_body:  params.res_body,
                res_body_type: params.res_body_type,
                uid: this.getUid(),
                add_time: yapi.commons.time(),
                up_time: yapi.commons.time()
            }

            if(params.req_params_form) data.req_params_form = params.req_params_form;
            if(params.req_params_other) data.req_params_other = params.req_params_other;
            
            let result = await this.Model.save(data);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 添加项目分组
     * @interface /interface/get
     * @method GET
     * @category interface
     * @foldnumber 10
     * @param {Number}   id 接口id，不能为空
     * @returns {Object} 
     * @example ./api/interface/get.json
     */
    async get(ctx){
        let params = ctx.request.query;
        if(!params.id){
            return ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空');
        }
        try{
            let result = await this.Model.get(params.id);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 接口列表
     * @interface /interface/list
     * @method GET
     * @category interface
     * @foldnumber 10
     * @param {Number}   project_id 项目id，不能为空
     * @returns {Object} 
     * @example ./api/interface/list.json
     */

    async list(ctx){
        let project_id = ctx.request.query.project_id;
        if(!project_id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        try{
            let result = await this.Model.list(project_id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 编辑接口
     * @interface /interface/up
     * @method POST
     * @category interface
     * @foldnumber 10
     * @param {Number}   id 接口id，不能为空
     * @param {String}   [path] 接口请求路径
     * @param {String}   [method] 请求方式
     * @param {Array}  [req_headers] 请求的header信息
     * @param {String}  [req_headers[].name] 请求的header信息名
     * @param {String}  [req_headers[].value] 请求的header信息值
     * @param {Boolean}  [req_headers[].required] 是否是必须，默认为否
     * @param {String}  [req_headers[].desc] header描述
     * @param {String}  [req_params_type] 请求参数方式，有["form", "json", "text", "xml"]四种
     * @param {Mixed}  [req_params_form] 请求参数,如果请求方式是form，参数是Array数组，其他格式请求参数是字符串
     * @param {String} [req_params_form[].name] 请求参数名
     * @param {String} [req_params_form[].value] 请求参数值，可填写生成规则（mock）。如@email，随机生成一条email
     * @param {String} [req_params_form[].type] 请求参数类型，有["text", "file"]两种
     * @param {String} [req_params_other]  非form类型的请求参数可保存到此字段
     * @param {String}  [res_body_type] 相应信息的数据格式，有["json", "text", "xml"]三种
     * @param {String} [res_body] 响应信息，可填写任意字符串，如果res_body_type是json,则会调用mock功能
     * @param  {String} [desc] 接口描述 
     * @returns {Object} 
     * @example ./api/interface/up.json
     */

    async up(ctx){
        let params = ctx.request.body;
        params.method = params.method || 'GET';
        params.method = params.method.toUpperCase()
        let id = ctx.request.body.id;
        if(!id){
            return ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空');
        }
        let interfaceData = await this.Model.get(id);
        if(params.path && params.path !== interfaceData.path  && params.method !== interfaceData.method){
            let checkRepeat = await this.Model.checkRepeat(params.path, params.method);
            if(checkRepeat > 0){
                return ctx.body =  yapi.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']');
            }
        }       

        let data = {
            up_time: yapi.commons.time()
        }

        if(params.path) data.path = params.path;
        if(params.title) data.title = params.title;
        if(params.desc) data.desc = params.desc;
        if(params.method) data.method = params.method;

        if(params.req_headers) data.req_headers = params.req_headers;

        if(params.req_params_form) data.req_params_form = params.req_params_form;
        if(params.req_params_other) data.req_params_other = params.req_params_other;
        
        if(params.res_body_type) data.res_body_type = params.res_body_type;
        if(params.res_body) data.res_body = params.res_body;

        try{
            let result = await this.Model.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }

    }

    /**
     * 删除接口
     * @interface /interface/del
     * @method GET
     * @category interface
     * @foldnumber 10
     * @param {Number}   id 接口id，不能为空
     * @returns {Object} 
     * @example ./api/interface/del.json
     */

    async del(ctx){
        try{
            let id = ctx.request.body.id;            
            
            if(!id){
                return ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空');
            }

            let data = await this.Model.get(ctx.request.body.id);

            if(data.uid != this.getUid()){
                if(await this.jungeProjectAuth(data.project_id) !== true){
                    return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
                }
            }

            
            let result = await this.Model.del(id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, err.message)
        }
    }
}

module.exports = interfaceController;