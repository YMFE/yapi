import projectModel from '../models/project.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import interfaceModel from '../models/interface.js';
import interfaceColModel from '../models/interfaceCol.js';
import interfaceCaseModel from '../models/interfaceCase.js';
import interfaceCatModel from '../models/interfaceCat.js';
import groupModel from '../models/group';
import commons from '../utils/commons.js';
import userModel from '../models/user.js';
import logModel from '../models/log.js';
import Mock from 'mockjs';
const send = require('koa-send');

class projectController extends baseController {

    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(projectModel);
        this.groupModel = yapi.getInst(groupModel);
        this.logModel = yapi.getInst(logModel);
    }

    handleBasepath(basepath) {
        if (!basepath) return "";
        if (basepath === '/') return "";
        if (basepath[0] !== '/') basepath = '/' + basepath;
        if (basepath[basepath.length - 1] === '/') basepath = basepath.substr(0, basepath.length - 1);
        if (!yapi.commons.verifyPath(basepath)) {
            return false;
        }
        return basepath;
    }

    verifyDomain(domain) {
        if (!domain) return false;
        if (/^[a-zA-Z0-9\-_\.]+?\.[a-zA-Z0-9\-_\.]*?[a-zA-Z]{2,6}$/.test(domain)) {
            return true;
        }
        return false;
    }

    /**
     * 添加项目分组
     * @interface /project/add
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {String} name 项目名称，不能为空
     * @param {String} basepath 项目基本路径，不能为空
     * @param {Number} group_id 项目分组id，不能为空
     * @param {Number} group_name 项目分组名称，不能为空
     * @param {String} project_type private public
     * @param  {String} [desc] 项目描述
     * @returns {Object}
     * @example ./api/project/add.json
     */
    async add(ctx) {
        let params = ctx.request.body;
        params = yapi.commons.handleParams(params, {
            name: 'string',
            basepath: 'string',
            group_id: 'number',
            group_name: 'string',
            desc: 'string',
            color: 'string',
            icon: 'string'
        });

        if (await this.checkAuth(params.group_id, 'group', 'edit') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        if (!params.group_id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }

        if (!params.name) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目名不能为空');
        }

        let checkRepeat = await this.Model.checkNameRepeat(params.name);

        if (checkRepeat > 0) {
            return ctx.body = yapi.commons.resReturn(null, 401, '已存在的项目名');
        }

        params.basepath = params.basepath || '';

        if ((params.basepath = this.handleBasepath(params.basepath)) === false) {
            return ctx.body = yapi.commons.resReturn(null, 401, 'basepath格式有误');
        }

        let data = {
            name: params.name,
            desc: params.desc,
            basepath: params.basepath,
            members: [],
            project_type: params.project_type || 'private',
            uid: this.getUid(),
            group_id: params.group_id,
            group_name: params.group_name,
            icon: params.icon,
            color: params.color,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        };

        try {
            let result = await this.Model.save(data);
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `用户${username}添加了项目${params.name}`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: params.group_id,
                typename: params.group_name,
                color: params.color,
                icon: params.icon
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }

    }
    /**
    * 添加项目成员
    * @interface /project/add_member
    * @method POST
    * @category project
    * @foldnumber 10
    * @param {Number} id 项目id，不能为空
    * @param {String} member_uid 项目成员uid,不能为空
    * @returns {Object}
    * @example ./api/project/add_member.json
    */
    async addMember(ctx) {
        let params = ctx.request.body;
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        if (await this.checkAuth(params.id, 'project', 'edit') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        var check = await this.Model.checkMemberRepeat(params.id, params.member_uid);
        if (check > 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员已存在');
        }

        params.role = params.role === 'owner' ? 'owner' : 'dev';

        let userdata = await this.getUserdata(params.member_uid, params.role);
        if(userdata === null){
            return ctx.body = yapi.commons.resReturn(null, 400, '成员uid不存在')
        }


        try {
            let result = await this.Model.addMember(params.id, userdata);
            let username = this.getUsername();
            let project = await this.Model.get(params.id);
            yapi.commons.saveLog({
                content: `用户${username}添加了项目成员${userdata.username}`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: params.id,
                color: project.color,
                icon: project.icon
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }

    }
    /**
    * 删除项目成员
    * @interface /project/del_member
    * @method POST
    * @category project
    * @foldnumber 10
    * @param {Number} id 项目id，不能为空
    * @param {member_uid} uid 项目成员uid,不能为空
    * @returns {Object}
    * @example ./api/project/del_member.json
    */

    async delMember(ctx) {
        let params = ctx.request.body;
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        var check = await this.Model.checkMemberRepeat(params.id, params.member_uid);
        if (check === 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员不存在');
        }

        if (await this.checkAuth(params.id, 'project', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        try {
            let result = await this.Model.delMember(params.id, params.member_uid);
            let username = this.getUsername();
            let project = await this.Model.get(params.id);
            let member =  await yapi.getInst(userModel).findById(params.member_uid);
            yapi.commons.saveLog({
                content: `用户${username}删除了项目${project.name}中的成员${member.username}`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: params.id,
                color: project.color,
                icon: project.icon
            });
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
            role: role,
            uid: userData._id,
            username: userData.username,
            email: userData.email
        }
    }

    /**
     * 获取项目成员列表
     * @interface /project/get_member_list
     * @method GET
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @return {Object}
     * @example ./api/project/get_member_list.json
     */

    async getMemberList(ctx) {
        let params = ctx.request.query;
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        try {
            let project = await this.Model.get(params.id);
            ctx.body = yapi.commons.resReturn(project.members);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
    * 获取项目信息
    * @interface /project/get
    * @method GET
    * @category project
    * @foldnumber 10
    * @param {Number} id 项目id，不能为空
    * @returns {Object}
    * @example ./api/project/get.json
    */

    async get(ctx) {
        let params = ctx.request.query;
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        try {
            let result = await this.Model.getBaseInfo(params.id);
            if(!result){
                return ctx.body = yapi.commons.resReturn(null, 400, '不存在的项目');
            }
            result = result.toObject();
            let catInst = yapi.getInst(interfaceCatModel);
            let cat = await catInst.list(params.id);
            result.cat = cat;
            result.role = await this.getProjectRole(params.id, 'project');
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 获取项目列表
     * @interface /project/list
     * @method GET
     * @category project
     * @foldnumber 10
     * @param {Number} group_id 项目group_id，不能为空
     * @returns {Object}
     * @example ./api/project/list.json
     */

    async list(ctx) {
        let group_id = ctx.request.query.group_id

        if (!group_id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }

        let auth =await  this.checkAuth(group_id, 'group', 'edit')
        try {
            let result = await this.Model.list(group_id, auth);
            let uids = [];
            result.forEach((item) => {
                if (uids.indexOf(item.uid) === -1) {
                    uids.push(item.uid);
                }

            });
            let _users = {}, users = await yapi.getInst(userModel).findByUids(uids);
            users.forEach((item) => {
                _users[item._id] = item;
            });
            ctx.body = yapi.commons.resReturn({
                list: result
            });
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 删除项目
     * @interface /project/del
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @returns {Object}
     * @example ./api/project/del.json
     */

    async del(ctx) {
        try {
            let id = ctx.request.body.id;
            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
            }

            if (await this.checkAuth(id, 'project', 'danger') !== true) {
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }

            let interfaceInst = yapi.getInst(interfaceModel);
            let interfaceColInst = yapi.getInst(interfaceColModel);
            let interfaceCaseInst = yapi.getInst(interfaceCaseModel);
            await interfaceInst.delByProjectId(id)
            await interfaceCaseInst.delByProjectId(id)
            await interfaceColInst.delByProjectId(id)

            let result = await this.Model.del(id);
            ctx.body = yapi.commons.resReturn(result);
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }

    /**
     * 修改项目成员角色
     * @interface /project/change_member_role
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {String} id 项目id
     * @param {String} member_uid 项目成员uid
     * @param {String} role 权限 ['owner'|'dev']
     * @returns {Object}
     * @example
     */
    async changeMemberRole(ctx){
        let params = ctx.request.body;
        console.log(params);
        let projectInst = yapi.getInst(projectModel);
        if (!params.member_uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        var check = await projectInst.checkMemberRepeat(params.id, params.member_uid);
        if (check === 0) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员不存在');
        }
        if (await this.checkAuth(params.id, 'group', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        params.role = params.role === 'owner' ? 'owner' : 'dev';

        try {
            let result = await projectInst.changeMemberRole(params.id, params.member_uid, params.role);

            let username = this.getUsername();
            let project = await this.Model.get(params.id);
            let member = await yapi.getInst(userModel).findByUids(params.member_uid);
            yapi.commons.saveLog({
                content: `用户${username}修改了项目${project.name}中成员${member.username}的角色为${params.role}`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: params.id,
                color: project.color,
                icon: project.icon
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 编辑项目
     * @interface /project/up
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @param {String} name 项目名称，不能为空
     * @param {String} basepath 项目基本路径，不能为空
     * @param {String} [desc] 项目描述
     * @param {Array} [env] 项目环境配置
     * @param {String} [env[].name] 环境名称
     * @param {String} [env[].domain] 环境域名
     * @returns {Object}
     * @example ./api/project/up.json
     */

    async up(ctx) {
        try {
            let id = ctx.request.body.id;
            let params = ctx.request.body;
            params.basepath = params.basepath || '';
            params = yapi.commons.handleParams(params, {
                name: 'string',
                basepath: 'string',
                group_id: 'number',
                desc: 'string',
                icon: 'string',
                color: 'string'
            });
            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 405, '项目id不能为空');
            }

            if (await this.checkAuth(id, 'project', 'edit') !== true) {
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }

            let projectData = await this.Model.get(id);

            if ((params.basepath = this.handleBasepath(params.basepath)) === false) {
                return ctx.body = yapi.commons.resReturn(null, 401, 'basepath格式有误');
            }

            if (projectData.name === params.name) {
                delete params.name;
            }

            if (params.name) {
                let checkRepeat = await this.Model.checkNameRepeat(params.name);
                if (checkRepeat > 0) {
                    return ctx.body = yapi.commons.resReturn(null, 401, '已存在的项目名');
                }
            }

            let data = {
                up_time: yapi.commons.time()
            };

            if (params.name) data.name = params.name;
            if (params.desc) data.desc = params.desc;
            if (params.basepath ) {
                data.basepath = params.basepath;
            }
            if (params.env) data.env = params.env;
            if(params.color) data.color = params.color;
            if(params.icon) data.icon = params.icon;
            let result = await this.Model.up(id, data);

            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `用户${username}更新了项目${projectData.name}`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: id,
                icon: params.icon,
                color: params.color
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 模糊搜索项目名称或者组名称
     * @interface /project/search
     * @method GET
     * @category project
     * @foldnumber 10
     * @param {String} q
     * @return {Object}
     * @example ./api/project/search.json
    */
    async search(ctx) {
        const { q } = ctx.request.query;

        if (!q) {
            return ctx.body = yapi.commons.resReturn(void 0, 400, 'No keyword.');
        }

        if (!yapi.commons.validateSearchKeyword(q)) {
            return ctx.body = yapi.commons.resReturn(void 0, 400, 'Bad query.');
        }

        let projectList = await this.Model.search(q);
        let groupList = await this.groupModel.search(q);
        let projectRules = [
            '_id',
            'name',
            'basepath',
            'uid',
            'env',
            'members',
            { key: 'group_id', alias: 'groupId' },
            { key: 'up_time', alias: 'upTime' },
            { key: 'add_time', alias: 'addTime' }
        ];
        let groupRules = [
            '_id',
            'uid',
            { key: 'group_name', alias: 'groupName' },
            { key: 'group_desc', alias: 'groupDesc' },
            { key: 'add_time', alias: 'addTime' },
            { key: 'up_time', alias: 'upTime' }
        ];

        projectList = commons.filterRes(projectList, projectRules);
        groupList = commons.filterRes(groupList, groupRules);

        let queryList = {
            project: projectList,
            group: groupList
        };

        return ctx.body = yapi.commons.resReturn(queryList, 0, 'ok');
    }

    /**
     * 下载项目的 Mock 数据
     * @interface /project/download
     * @method GET
     * @category project
     * @foldnumber 10
     * @author wenbo.dong
     * @param {String} project_id
    */
    async download(ctx) {
        const project_id = ctx.request.query.project_id;
        let interfaceInst = yapi.getInst(interfaceModel);
        // 根据 project_id 获取接口数据
        let count = await interfaceInst.list(project_id);

        if (!project_id) {
            return ctx.body = yapi.commons.resReturn(null, 405, '项目id不能为空');
        } else if (!count) {
            return ctx.body = yapi.commons.resReturn(null, 401, '项目id不存在');
        }

        const arr = JSON.stringify(count.map(function(item) {
            // 返回的json模板数据: item.res_body
            const mockData = Mock.mock(
                yapi.commons.json_parse(item.res_body)
            );
            return {
                path: item.path,
                mock: mockData
            }
        }));

        const fileName = 'mock.js';
        ctx.attachment(fileName);
        await send(ctx, fileName, { root: __dirname + '/public' });

        const res = `
        var Mock = require('mockjs');
        var xhook = require('xhook');
        var data = ${arr};
        function run() {
            xhook.before(function(request, callback) {
                setTimeout(function() {
                    var res;
                    data.forEach((item) => {
                        // 请求的接口在 data 中存在
                         if(request.url === item.path) {
                            res = {
                                status: 200,
                                text: Mock.mock(item.mock)
                            }
                        }
                    });
                    if (res) {
                        callback(res);
                    }else {
                        callback({ status: 405, text: '接口不存在' });
                    }
              }, 500);
            });
        }
        module.exports = run;`
        .trim();
        return ctx.body = res;
    }
}

module.exports = projectController;
