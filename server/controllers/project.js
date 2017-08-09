import projectModel from '../models/project.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import interfaceModel from '../models/interface.js';
import groupModel from '../models/group';
import commons from '../utils/commons.js';
import userModel from '../models/user.js';

class projectController extends baseController {

    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(projectModel);
        this.groupModel = yapi.getInst(groupModel);
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
     * @param {String} prd_host 项目线上域名，不能为空。可通过配置的域名访问到mock数据
     * @param {String} protocol 线上域名协议，不能为空
     * @param {Number} group_id 项目分组id，不能为空
     * @param  {String} [desc] 项目描述
     * @returns {Object}
     * @example ./api/project/add.json
     */
    async add(ctx) {
        let params = ctx.request.body;
        params = yapi.commons.handleParams(params, {
            name: 'string',
            basepath: 'string',
            prd_host: 'string',
            protocol: 'string',
            group_id: 'number',
            desc: 'string'
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

  
        if (!params.prd_host) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目domain不能为空');
        }

        params.basepath = params.basepath || '';

        if ((params.basepath = this.handleBasepath(params.basepath)) === false) {
            return ctx.body = yapi.commons.resReturn(null, 401, 'basepath格式有误');
        }

        if (!this.verifyDomain(params.prd_host)) {
            return ctx.body = yapi.commons.resReturn(null, 401, '线上域名格式有误');
        }

        let checkRepeatDomain = await this.Model.checkDomainRepeat(params.prd_host, params.basepath);

        if (checkRepeatDomain > 0) {
            return ctx.body = yapi.commons.resReturn(null, 401, '已存在domain和basepath');
        }

        

        let data = {
            name: params.name,
            desc: params.desc,
            prd_host: params.prd_host,
            basepath: params.basepath,
            protocol: params.protocol || 'http',
            members: [],
            uid: this.getUid(),
            group_id: params.group_id,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        };

        try {
            let result = await this.Model.save(data);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }

    }
    /**
    * 添加项目
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

        let userdata = await this.getUserdata(params.member_uid);
        if(userdata === null){
            return ctx.body = yapi.commons.resReturn(null, 400, '成员uid不存在')
        }


        try {
            let result = await this.Model.addMember(params.id, userdata);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }

    }
    /**
    * 添加项目
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
    * 添加项目
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
            let result = await this.Model.get(params.id);
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
        let group_id = ctx.request.query.group_id,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10;

        if (!group_id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }

        let auth = this.checkAuth(group_id, 'group', 'edit')

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
                list: result,
                userinfo: _users
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
            let interfaceInst = yapi.getInst(interfaceModel);
            let count = await interfaceInst.countByProjectId(id);
            if (count > 0) {
                return ctx.body = yapi.commons.resReturn(null, 400, '请先删除该项目下所有接口');
            }

            if (await this.checkAuth(id, 'project', 'danger') !== true) {
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }
            let result = await this.Model.del(id);
            ctx.body = yapi.commons.resReturn(result);
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }

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
        if (await this.checkAuth(id, 'group', 'danger') !== true) {
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
     * 编辑项目
     * @interface /project/up
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @param {String} name 项目名称，不能为空
     * @param {String} basepath 项目基本路径，不能为空
     * @param {String} prd_host 项目线上域名，不能为空。可通过配置的域名访问到mock数据
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
                prd_host: 'string',
                protocol: 'string',
                group_id: 'number',
                desc: 'string'
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

            if (!this.verifyDomain(params.prd_host)) {
                return ctx.body = yapi.commons.resReturn(null, 401, '线上域名格式有误');
            }

            if (projectData.name === params.name) {
                delete params.name;
            }
            if (projectData.basepath === params.basepath && projectData.prd_host === params.prd_host) {
                delete params.basepath;
                delete params.prd_host;
            }

            if (params.name) {
                let checkRepeat = await this.Model.checkNameRepeat(params.name);
                if (checkRepeat > 0) {
                    return ctx.body = yapi.commons.resReturn(null, 401, '已存在的项目名');
                }
            }

            if (params.basepath && params.prd_host) {
                let checkRepeatDomain = await this.Model.checkDomainRepeat(params.prd_host, params.basepath);
                if (checkRepeatDomain > 0) {
                    return ctx.body = yapi.commons.resReturn(null, 401, '已存在domain和basepath');
                }
            }

            let data = {
                up_time: yapi.commons.time()
            };

            if (params.name) data.name = params.name;
            if (params.desc) data.desc = params.desc;
            if (params.prd_host ) {
                data.prd_host = params.prd_host;
                data.basepath = params.basepath;
            }
            if (params.protocol) data.protocol = params.protocol;
            if (params.env) data.env = params.env;

            let result = await this.Model.up(id, data);
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
            { key: 'prd_host', alias: 'prdHost' },
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
}

module.exports = projectController;
