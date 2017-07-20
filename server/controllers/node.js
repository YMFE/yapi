import nodeModel from '../models/node.js'
import yapi from '../yapi.js'
import baseController from './base.js'
import interfaceModel from '../models/interface.js'
import groupModel from '../models/group'
import commons from '../utils/commons.js'

class nodeController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(nodeModel);
        this.groupModel = yapi.getInst(groupModel);
    }

    /**
     * 添加记录节点
     * @interface /node/add
     * @method POST
     * @category node
     * @foldnumber 10
     * @param {String} title 节点名称，不能为空
     * @param {String} content 节点内容，不能为空
     * @returns {Object}
     * @example ./api/node/add.json
     */
    async add(ctx) {
        let params = ctx.request.body;

        if(!params.title) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'title不能为空');
        }
        if(!params.content) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'content不能为空');
        }

        let data = {
            title: params.title,
            content: params.content,
            is_read: false,
            uid: this.getUid(),
            add_time: yapi.commons.time()
        };

        try {
            let result = await this.Model.save(data);
            ctx.body = yapi.commons.resReturn(result);
        } catch(e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }

    }

    /**
     * 获取节点
     * @interface /node/get
     * @method GET
     * @category node
     * @foldnumber 10
     * @param {Number} id 节点id，不能为空
     * @returns {Object}
     * @example ./api/node/get.json
     */

    async get(ctx){
        let params = ctx.request.query;
        if(!params.id){
            return ctx.body = yapi.commons.resReturn(null, 400, '节点id不能为空');
        }

        try {
            let result = await this.Model.get(params.id);
            ctx.body = yapi.commons.resReturn(result);
        } catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
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

    /**
     * 删除节点
     * @interface /node/del
     * @method POST
     * @category node
     * @foldnumber 10
     * @param {Number} id 节点id，不能为空
     * @returns {Object}
     * @example ./api/project/del.json
     */

    async del(ctx){
        try{
            let id = ctx.request.body.id;
            if(!id){
                return ctx.body = yapi.commons.resReturn(null, 400, '节点id不能为空');
            }

            let result = await this.Model.del(id);
            ctx.body = yapi.commons.resReturn(result);
        }catch(err){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 编辑节点
     * @interface /node/up
     * @method POST
     * @category node
     * @foldnumber 10
     * @param {Number} id 节点id，不能为空
     * @param {String} [title]
     * @param {String} [content] 节点描述
     * @param {Boolean} [is_read] 是否阅读
     * @returns {Object}
     * @example ./api/node/up.json
     */

    async up(ctx){
        try{
            let id = ctx.request.body.id;
            let params = ctx.request.body;

            if(await this.jungeMemberAuth(id, this.getUid()) !== true){
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }

            if(!id){
                return ctx.body =  yapi.commons.resReturn(null, 402, '节点id不能为空');
            }

            let data= {
                uid: this.getUid(),
                up_time: yapi.commons.time()
            };

            if(params.title) data.title = params.title;
            if(params.content) data.content = params.content;
            if(params.is_read) data.is_read = params.is_read;

            let result = await this.Model.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        } catch(e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }
}

module.exports = nodeController;