import interfaceColModel from '../models/interfaceCol.js';
import interfaceCaseModel from '../models/interfaceCase.js';
import baseController from './base.js';
import yapi from '../yapi.js';

class interfaceColController extends baseController{
    constructor(ctx) {
        super(ctx);
        this.colModel = yapi.getInst(interfaceColModel);
        this.caseModel = yapi.getInst(interfaceCaseModel);
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
            let inst = yapi.getInst(interfaceColModel);
            let result = await inst.list(id);
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
            let result = await this.colModel.save({
                name: params.name,
                project_id: params.project_id,
                desc: params.desc,
                uid: this.getUid(),
                add_time: yapi.commons.time(),
                up_time: yapi.commons.time()
            })
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
            let result = await inst.list(id);
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
     * @param {String} env  
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
                env: 'string',
                domain: 'string',
                method: 'string'
            });
            
            if (!params.project_id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');                
            }
            if (!params.col_id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');                
            }
            if (!params.env) {
                return ctx.body = yapi.commons.resReturn(null, 400, '缺少环境配置');                
            }
   
            if(!params.casename){
                return ctx.body = yapi.commons.resReturn(null, 400, '用例名称不能为空');            
            }

            params.uid = this.getUid();
            params.index = 0;
            params.add_time = yapi.commons.time();
            params.up_time = yapi.commons.time();
            let result = await this.caseModel.save(params);
            
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
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 400, e.message)
        }
    }

    /**
     * 更新一个接口集name或描述
     * @interface /col/up_col
     * @method GET
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
            let result = await this.caseModel.up(params.col_id, {
                name: params.col_name,
                desc: params.col_desc,
                up_time: yapi.commons.time()
            })
            ctx.body = yapi.commons.resReturn(result)
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 400, e.message)
        }
    }

    /**
     * 删除一个接口集
     * @interface /col/del
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String} 
     * @returns {Object} 
     * @example 
     */

    async delCol(ctx){

    }

    /**
     * 
     * @param {*} ctx 
     */

    async delCase(ctx){

    }


}

module.exports = interfaceColController