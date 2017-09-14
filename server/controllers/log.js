const logModel = require('../models/log.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const groupModel = require('../models/group');

class logController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(logModel);
        this.groupModel = yapi.getInst(groupModel);
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