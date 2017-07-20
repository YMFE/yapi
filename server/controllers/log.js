import logModel from '../models/log.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import groupModel from '../models/group';

class logController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(logModel);
        this.groupModel = yapi.getInst(groupModel);
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
        let uid = ctx.request.query.uid,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10;

        if(!uid){
            return ctx.body = yapi.commons.resReturn(null, 400, '用户id不能为空');
        }

        try {
            let result = await this.Model.listWithPaging(uid, page, limit);
            let count = await this.Model.listCount(uid);
            ctx.body = yapi.commons.resReturn({
                total: Math.ceil(count / limit),
                list: result
            })
        } catch(err) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

}

module.exports = logController;