import groupModel from '../models/group.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import projectModel from '../models/project.js';
import userModel from '../models/user.js';

class groupController extends baseController {
    constructor(ctx) {
        super(ctx);
    }

    /**
     * 添加项目分组
     * @interface /group/add
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} group_name 项目分组名称，不能为空
     * @param {String} [group_desc] 项目分组描述 
     * @param {String} owner_uid  组长uid
     * @returns {Object} 
     * @example ./api/group/add.json
     */
    async add(ctx) {
        let params = ctx.request.body;

        params = yapi.commons.handleParams(params, {
            group_name: 'string',
            group_desc: 'string',
            owner_uid: 'number'
        });

        if (this.getRole() !== 'admin') {
            return ctx.body = yapi.commons.resReturn(null, 401, '没有权限');
        }

        if (!params.group_name) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组名不能为空');
        }

        if(!params.owner_uid){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组必须添加一个组长');
        }

        let groupUserdata = await this.getUserdata(params.owner_uid, 'owner');
        if(groupUserdata === null){
            return ctx.body = yapi.commons.resReturn(null, 400, '组长uid不存在')
        }
        let groupInst = yapi.getInst(groupModel);

        let checkRepeat = await groupInst.checkRepeat(params.group_name);

        if (checkRepeat > 0) {
            return ctx.body = yapi.commons.resReturn(null, 401, '项目分组名已存在');
        }

        let data = {
            group_name: params.group_name,
            group_desc: params.group_desc,
            uid: this.getUid(),
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time(),
            members: [groupUserdata]
        };

        try {
            let result = await groupInst.save(data);

            result = yapi.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid', 'members']);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }

    }

    async getUserdata(uid, role){
        role = role || 'dev';
        let userInst = yapi.getInst(userModel);
        let userData = await userInst.findById(uid);
        if(!userData){
            return null;
        }
        return {
            _role: userData.role,
            role: role,
            uid: userData._id,
            username: userData.username,
            email: userData.email
        }
    }

    /**
     * 添加项目分组成员
     * @interface /group/add_member
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} id 项目分组id
     * @param {String} member_uid 项目分组成员uid
     * @returns {Object} 
     * @example 
     */


    async addMember(ctx){   
        let params = ctx.request.body;
        let groupInst = yapi.getInst(groupModel);
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组id不能为空');
        }

        var check = await groupInst.checkMemberRepeat(params.id, params.member_uid);
        if (check > 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '成员已存在');
        }
        let groupUserdata = await this.getUserdata(params.member_uid);
        if(groupUserdata === null){
            return ctx.body = yapi.commons.resReturn(null, 400, '组长uid不存在')
        }
        if(groupUserdata._role === 'admin'){
            return ctx.body = yapi.commons.resReturn(null, 400, '不能邀请管理员')
        }
        delete groupUserdata._role;
        try {
            let result = await groupInst.addMember(params.id, groupUserdata);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }


    /**
     * 修改项目分组成员角色
     * @interface /group/change_member_role
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} id 项目分组id
     * @param {String} member_uid 项目分组成员uid
     * @param {String} role  组长uid
     * @returns {Object} 
     * @example 
     */
    async changeMemberRole(ctx){
        let params = ctx.request.body;
        let groupInst = yapi.getInst(groupModel);
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组id不能为空');
        }
        var check = await groupInst.checkMemberRepeat(params.id, params.member_uid);
        if (check === 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组成员不存在');
        }
        if (await this.checkAuth(params.id, 'group', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        params.role = params.role === 'owner' ? 'owner' : 'dev';

        try {
            let result = await groupInst.changeMemberRole(params.id, params.member_uid, params.role);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }
    /**
     * 获取所有项目成员
     * @interface /group/get_member_list
     * @method GET
     * @category group
     * @foldnumber 10
     * @param {String} id 项目分组id
     * @returns {Object} 
     * @example 
     */

    async getMemberList(ctx) {
        let params = ctx.request.query;
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        try {
            let groupInst = yapi.getInst(groupModel);
            let group = await groupInst.get(params.id);
            ctx.body = yapi.commons.resReturn(group.members);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 删除项目成员
     * @interface /group/del_member
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} id 项目分组id
     * @param {String} member_uid 项目分组成员uid
     * @returns {Object} 
     * @example 
     */

    async delMember(ctx) {
        let params = ctx.request.body;
        let groupInst = yapi.getInst(groupModel);
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组id不能为空');
        }
        var check = await groupInst.checkMemberRepeat(params.id, params.member_uid);
        if (check === 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '分组成员不存在');
        }
        if (await this.checkAuth(params.id, 'group', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        try {
            let result = await groupInst.delMember(params.id, params.member_uid);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 获取项目分组列表
     * @interface /group/list
     * @method get
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/list.json
     */
    async list(ctx) {
        try {
            var groupInst = yapi.getInst(groupModel);
            let result = await groupInst.list();
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 删除项目分组
     * @interface /group/del
     * @method post
     * @param {String} id 项目分组id
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/del.json
     */
    async del(ctx) {
        if (this.getRole() !== 'admin') {
            return ctx.body = yapi.commons.resReturn(null, 401, '没有权限');
        }

        try {
            let groupInst = yapi.getInst(groupModel);
            let projectInst = yapi.getInst(projectModel);
            let id = ctx.request.body.id;

            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 402, 'id不能为空');
            }

            let count = await projectInst.countByGroupId(id);

            if (count > 0) {
                return ctx.body = yapi.commons.resReturn(null, 403, '请先删除该分组下的项目');
            }

            let result = await groupInst.del(id);
            ctx.body = yapi.commons.resReturn(result);
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }

    /**
     * 更新项目分组
     * @interface /group/up
     * @method post
     * @param {String} id 项目分组id
     * @param {String} group_name 项目分组名称
     * @param {String} group_desc 项目分组描述
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/up.json
     */
    async up(ctx) {
        if (await this.checkAuth(id, 'group', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }
        try {
            ctx.request.body = yapi.commons.handleParams(ctx.request.body, {
                id: 'number',
                group_name: 'string',
                group_desc: 'string'
            });
            let groupInst = yapi.getInst(groupModel);
            let id = ctx.request.body.id;
            let data = {};
            ctx.request.body.group_name && (data.group_name = ctx.request.body.group_name);
            ctx.request.body.group_desc && (data.group_desc = ctx.request.body.group_desc);
            if (Object.keys(data).length === 0) {
                ctx.body = yapi.commons.resReturn(null, 404, '分组名和分组描述不能为空');
            }
            let result = await groupInst.up(id, data);
            ctx.body = yapi.commons.resReturn(result);
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }
}

module.exports = groupController;