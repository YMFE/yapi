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
            //     groupid: 21,
            //     type: 'project',
            //     username: 'xiaomingg',
            //     content: '小明修改了 <b>小明</b> 的项目',
            //     time: yapi.commons.time()
            // });
            // var res = this.Model.del(107);
            // ctx.body = yapi.commons.resReturn(null, 200,res);
        }catch(err){
            // ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }

        
    }

    /**
     * 获取节点列表
     * @interface /node/list
     * @method GET
     * @category node
     * @foldnumber 10
     * @param {Number} uid 用户id， 不能为空
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example ./api/project/list.json
     */
    
    async list(ctx) {
        let groupid = ctx.request.query.groupid,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10;

        if (!groupid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        try {
            let result = await this.Model.listWithPaging(groupid, page, limit);
            let count = await this.Model.listCount(groupid);
            
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