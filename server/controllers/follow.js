import yapi from '../yapi.js';
import baseController from './base.js';
import followModel from '../models/follow';

class followController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(followModel);
        // try{
        //     var res = this.Model.save({
        //         uid: 107,
        //         projectid: 221,
        //         projectname: 'Flight',
        //         icon: 'code'
        //     });
        //     // var res = this.Model.del(107);
        //     ctx.body = yapi.commons.resReturn(null, 200,res);
        // }catch(err){
        //     ctx.body = yapi.commons.resReturn(null, 402, err.message);
        // }


    }

    /**
     * 获取关注项目列表
     * @interface /follow/list
     * @method GET
     * @category follow
     * @foldnumber 10
     * @param {Number} uid 用户id， 不能为空
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example /follow/list
     */

    async list(ctx) {
        let uid = ctx.request.query.uid,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10;

        if (!uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '用户id不能为空');
        }

        try {
            let result = await this.Model.listWithPaging(uid, page, limit);
            let count = await this.Model.listCount(uid);

            ctx.body = yapi.commons.resReturn({
                total: Math.ceil(count / limit),
                list: result
            });
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }


    /**
     * 取消关注
     * @interface /follow/del
     * @method POST
     * @category follow
     * @foldnumber 10
     * @param {Number} id 关注id
     * @returns {Object}
     * @example /follow/del
     */

    async del(ctx) {
        let params = ctx.request.body;

        if(params.followid){
            return ctx.body = yapi.commons.resReturn(null, 400, '关注id不能为空');
        }

        try {
            let result = await this.Model.del(params.id);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 添加关注
     * @interface /follow/add
     * @method GET
     * @category follow
     * @foldnumber 10
     * @param {Number} uid 用户id
     * @param {Number} projectid 项目id
     * @param {String} projectname 项目名
     * @param {String} icon 项目icon
     * @returns {Object}
     * @example /follow/add
     */

    async add(ctx) {
        let params = ctx.request.body;
        params = yapi.commons.handleParams(params, {
            uid: 'number',
            projectid: 'number',
            projectname: 'string',
            icon: 'string',
            color: 'string'
        });

        if (!params.uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '用户id不为空');
        }

        if (!params.projectid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        let checkRepeat = await this.Model.checkProjectRepeat(params.uid,params.projectid);
        if (checkRepeat) {
            return ctx.body = yapi.commons.resReturn(null, 401, '项目已关注');
        }

        if (!params.projectname) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目名不能为空');
        }
        if (!params.icon) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目图标标志不能为空');
        }
        if (!params.color) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目颜色不能为空');
        }

        let data = {
            uid: params.uid,
            projectid: params.projectid,
            projectname: params.projectname,
            icon: params.icon,
            color: params.color

        };

        try {
            let result = await this.Model.save(data);
            result = yapi.commons.fieldSelect(result, ['_id', 'uid', 'projectid', 'projectname', 'icon', 'color']);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

}

module.exports = followController;
