const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceModel = require('../models/interface.js');
const projectModel = require('../models/project.js');
const baseController = require('./base.js');
const yapi = require('../yapi.js');

class interfaceColController extends baseController{
    constructor(ctx) {
        super(ctx);
        this.colModel = yapi.getInst(interfaceColModel);
        this.caseModel = yapi.getInst(interfaceCaseModel);
        this.interfaceModel = yapi.getInst(interfaceModel);
        this.projectModel = yapi.getInst(projectModel);
    }

    /**
     * 获取所有接口集
     * @interface /col/list
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String} project_id email名称，不能为空
     * @returns {Object}
     * @example
     */
    async list(ctx){
        try {
            let id = ctx.query.project_id;
            let result = await this.colModel.list(id);

            for(let i=0; i< result.length;i++){
                result[i] = result[i].toObject();
                result[i].caseList = await this.caseModel.list(result[i]._id)
            }
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 增加接口集
     * @interface /col/add_col
     * @method POST
     * @category col
     * @foldnumber 10
     * @param {Number} project_id
     * @param {String} name
     * @param {String} desc
     * @returns {Object}
     * @example
     */

    async addCol(ctx){
        try{
            let params = ctx.request.body;
            params = yapi.commons.handleParams(params, {
                name: 'string',
                project_id: 'number',
                desc: 'string'
            });

            if (!params.project_id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
            }
            if(!params.name){
                return ctx.body = yapi.commons.resReturn(null, 400, '名称不能为空');
            }

            let auth = await this.checkAuth(params.project_id, 'project', 'edit')
            if (!auth) {
                return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
            }

            let result = await this.colModel.save({
                name: params.name,
                project_id: params.project_id,
                desc: params.desc,
                uid: this.getUid(),
                add_time: yapi.commons.time(),
                up_time: yapi.commons.time()
            });
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `用户 "${username}" 添加了接口集 "${params.name}"`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: params.project_id
            });
            ctx.body = yapi.commons.resReturn(result);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 获取一个接口集下的所有的接口用例
     * @interface /col/case_list
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String} col_id 接口集id
     * @returns {Object}
     * @example
     */

    async getCaseList(ctx){
        try {
            let id = ctx.query.col_id;
            let inst = yapi.getInst(interfaceCaseModel);
            let result = await inst.list(id, 'all');
            for(let index=0; index< result.length; index++){

                result[index] = result[index].toObject();
                let interfaceData = await this.interfaceModel.getBaseinfo(result[index].interface_id);
                if(!interfaceData){
                    await this.caseModel.del(result[index]._id);
                    result[index] = undefined;
                    continue;
                }
                let projectData = await this.projectModel.getBaseInfo(interfaceData.project_id);
                result[index].path = projectData.basepath +  interfaceData.path;
                result[index].method = interfaceData.method;
            }
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 增加一个接口用例
     * @interface /col/add_case
     * @method POST
     * @category col
     * @foldnumber 10
     * @param {String} casename
     * @param {Number} col_id
     * @param {Number} project_id
     * @param {String} domain
     * @param {String} path
     * @param {String} method
     * @param {Object} req_query
     * @param {Object} req_headers
     * @param {String} req_body_type
     * @param {Array} req_body_form
     * @param {String} req_body_other
     * @returns {Object}
     * @example
     */

    async addCase(ctx){
        try{
            let params = ctx.request.body;
            params = yapi.commons.handleParams(params, {
                casename: 'string',
                project_id: 'number',
                col_id: 'number',
                interface_id: 'number',
                case_env: 'string'
            });


            if (!params.project_id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
            }

            if(!params.interface_id){
                return ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空');
            }

            let auth = await this.checkAuth(params.project_id, 'project', 'edit');
            if (!auth) {
                return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
            }

            if (!params.col_id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '接口集id不能为空');
            }


            if(!params.casename){
                return ctx.body = yapi.commons.resReturn(null, 400, '用例名称不能为空');
            }

            params.uid = this.getUid();
            params.index = 0;
            params.add_time = yapi.commons.time();
            params.up_time = yapi.commons.time();
            let result = await this.caseModel.save(params);
            let username = this.getUsername();

            this.colModel.get(params.col_id).then((col)=>{
                yapi.commons.saveLog({
                    content: `用户 "${username}" 在接口集 "${col.name}" 下添加了接口用例 "${params.casename}"`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: params.project_id
                });
            });


            ctx.body = yapi.commons.resReturn(result);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 更新一个接口用例
     * @interface /col/up_case
     * @method POST
     * @category col
     * @foldnumber 10
     * @param {number} id
     * @param {String} casename
     * @param {String} domain
     * @param {String} path
     * @param {String} method
     * @param {Object} req_query
     * @param {Object} req_headers
     * @param {String} req_body_type
     * @param {Array} req_body_form
     * @param {String} req_body_other
     * @returns {Object}
     * @example
     */

    async upCase(ctx){
        try{
            let params = ctx.request.body;
            params = yapi.commons.handleParams(params, {
                id: 'number',
                casename: 'string'
            });

            if (!params.id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '用例id不能为空');
            }

            if(!params.casename){
                return ctx.body = yapi.commons.resReturn(null, 400, '用例名称不能为空');
            }

            let caseData = await this.caseModel.get(params.id);
            let auth = await this.checkAuth(caseData.project_id, 'project', 'edit');
            if (!auth) {
                return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
            }

            params.uid = this.getUid();

            delete params.interface_id;
            delete params.project_id;
            delete params.col_id;

            let result = await this.caseModel.up(params.id, params);
            let username = this.getUsername();
            this.colModel.get(caseData.col_id).then((col)=>{
                yapi.commons.saveLog({
                    content: `用户 "${username}" 在接口集 "${col.name}" 更新了接口用例 "${params.casename}"`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: caseData.project_id
                });
            });



            ctx.body = yapi.commons.resReturn(result);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 获取一个接口用例详情
     * @interface /col/case
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String} caseid
     * @returns {Object}
     * @example
     */

    async getCase(ctx){
        try{
            let id = ctx.query.caseid;
            let result = await this.caseModel.get(id);
            if(!result){
                return ctx.body = yapi.commons.resReturn(null, 400, '不存在的case');
            }
            result = result.toObject();
            let data = await this.interfaceModel.get(result.interface_id);
            if(!data){
                return ctx.body = yapi.commons.resReturn(null, 400, '找不到对应的接口，请联系管理员')
            }
            data = data.toObject();
            let projectData = await this.projectModel.getBaseInfo(data.project_id);            
            result.path = projectData.basepath + data.path;
            result.method = data.method;
            result.req_body_type = data.req_body_type;
            result.req_headers = data.req_headers;
            result.res_body = data.res_body;
            result.res_body_type = data.res_body_type;
            
            result.req_body_form = this.handleParamsValue(data.req_body_form, result.req_body_form)
            result.req_query = this.handleParamsValue(data.req_query, result.req_query)
            result.req_params = this.handleParamsValue(data.req_params, result.req_params)

            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 400, e.message)
        }
    }

    handleParamsValue(params, val){
        let value = {};
        if(params.length === 0 || val.length === 0){
            return params;
        }
        val.forEach((item, index)=>{
            value[item.name] = item;
        })
        params.forEach((item, index)=>{
            if(!value[item.name] || typeof value[item.name] !== 'object') return null;
            params[index].value = value[item.name].value;
        })
        return params;
    }

    /**
     * 更新一个接口集name或描述
     * @interface /col/up_col
     * @method POST
     * @category col
     * @foldnumber 10
     * @param {String} name
     * @param {String} desc
     * @returns {Object}
     * @example
     */

    async upCol(ctx){
        try{
            let params = ctx.request.body;
            let id = params.col_id;
            let colData = await this.colModel.get(id);
            let auth = await this.checkAuth(colData.project_id, 'project', 'edit')
            if (!auth) {
                return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
            }

            let result = await this.colModel.up(params.col_id, {
                name: params.name,
                desc: params.desc,
                up_time: yapi.commons.time()
            });
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `用户 "${username}" 更新了接口集 "${params.name}" 的信息`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: colData.project_id
            });
            ctx.body = yapi.commons.resReturn(result)
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 400, e.message)
        }
    }

    /**
     * 更新多个接口case index
     * @interface /col/up_col_index
     * @method POST
     * @category col
     * @foldnumber 10
     * @param {Array}  [id, index]
     * @returns {Object}
     * @example
     */

    async upCaseIndex(ctx){
        try{
            let params = ctx.request.body;
            if(!params || !Array.isArray(params)){
                ctx.body =  yapi.commons.resReturn(null, 400, "请求参数必须是数组")
            }
            // let caseName = "";
            params.forEach((item) => {
                if(item.id && item.index){
                    this.caseModel.upCaseIndex(item.id, item.index).then((res) => {}, (err) => {
                        yapi.commons.log(err.message, 'error')
                    })
                }

            });

            // let username = this.getUsername();
            // yapi.commons.saveLog({
            //     content: `用户 "${username}" 更新了接口集 "${params.col_name}"`,
            //     type: 'project',
            //     uid: this.getUid(),
            //     username: username,
            //     typeid: params.project_id
            // });

            return ctx.body = yapi.commons.resReturn('成功！')
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 400, e.message)
        }
    }

    /**
     * 删除一个接口集
     * @interface /col/del_col
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String}
     * @returns {Object}
     * @example
     */

    async delCol(ctx){
        try{
            let id = ctx.query.col_id;
            let colData = await this.colModel.get(id);
            if(!colData){
                ctx.body =  yapi.commons.resReturn(null, 400, "不存在的id")
            }

            if(colData.uid !== this.getUid()){
                let auth = await this.checkAuth(colData.project_id, 'project', 'danger')
                if(!auth){
                    return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
                }
            }
            let result = await this.colModel.del(id);
            await this.caseModel.delByCol(id);
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `用户 "${username}" 删除了接口集 "${colData.name}" 及其下面的接口`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: colData.project_id
            });
            return ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            yapi.commons.resReturn(null, 400, e.message)
        }
    }

    /**
     *
     * @param {*} ctx
     */

    async delCase(ctx){
        try{
            let caseid = ctx.query.caseid;
            let caseData = await this.caseModel.get(caseid);
            if(!caseData){
                ctx.body =  yapi.commons.resReturn(null, 400, "不存在的caseid")
            }

            if(caseData.uid !== this.getUid()){
                let auth = await this.checkAuth(caseData.project_id, 'project', 'danger')
                if(!auth){
                    return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
                }
            }

            let result = await this.caseModel.del(caseid);

            let username = this.getUsername();
            this.colModel.get(caseData.col_id).then((col)=>{
                yapi.commons.saveLog({
                    content: `用户 "${username}" 删除了接口集 "${col.name}" 下的接口 "${caseData.casename}"`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: caseData.project_id
                });
            });


            return ctx.body = yapi.commons.resReturn(result);


        }catch(e){
            yapi.commons.resReturn(null, 400, e.message)
        }
    }


}

module.exports = interfaceColController
