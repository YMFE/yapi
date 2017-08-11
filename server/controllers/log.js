import logModel from '../models/log.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import groupModel from '../models/group';

class logController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(logModel);
        this.groupModel = yapi.getInst(groupModel);
        try{
            // var res = this.Model.save({
            //     uid: 107,
            //     typeid: 21,
            //     type: 'project',
            //     username: '小明明宝宝',
            //     content: '小明应该修改了的项目宝宝',
            //     time: yapi.commons.time()
            // });
            // var res = this.Model.del(107);
            // ctx.body = yapi.commons.resReturn(null, 200,res);
        }catch(err){
            // ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }

        
    }

    /**
     * 获取动态列表
     * @interface /log/list
     * @method GET
     * @category log
     * @foldnumber 10
     * @param {Number} typeid 动态类型id， 不能为空
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example /log/list
     */
    
    async list(ctx) {
        let typeid = ctx.request.query.typeid,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10,
            type = ctx.request.query.type;
        if (!typeid) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'typeid不能为空');
        }
        if(!type) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'type不能为空');
        }
        try {
            let result = await this.Model.listWithPaging(typeid,type, page, limit);
            let count = await this.Model.listCount(typeid,type);
            
            ctx.body = yapi.commons.resReturn({
                total: Math.ceil(count / limit),
                list: result
            });
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }

}

module.exports = logController;