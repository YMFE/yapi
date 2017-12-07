const projectModel = require('../models/project.js');
const yapi = require('../yapi.js');
const _ = require("underscore");
const baseController = require('./base.js');
const interfaceModel = require('../models/interface.js');
const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceCatModel = require('../models/interfaceCat.js');
const groupModel = require('../models/group');
const commons = require('../utils/commons.js');
const userModel = require('../models/user.js');
const logModel = require('../models/log.js');
const followModel = require('../models/follow.js');


class projectController extends baseController {

    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(projectModel);
        this.groupModel = yapi.getInst(groupModel);
        this.logModel = yapi.getInst(logModel);
        this.followModel = yapi.getInst(followModel);
    }

    handleBasepath(basepath) {
        if (!basepath) return "";
        if (basepath === '/') return "";
        if (basepath[0] !== '/') basepath = '/' + basepath;
        if (basepath[basepath.length - 1] === '/') basepath = basepath.substr(0, basepath.length - 1);
        if (!/^\/[a-zA-Z0-9\-\/_]+$/.test(basepath)) {
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
            up_time: yapi.commons.time(),
            env: [{ name: 'local', domain: 'http://127.0.0.1' }]
        };

        try {
            let result = await this.Model.save(data);
            let colInst = yapi.getInst(interfaceColModel);
            let catInst = yapi.getInst(interfaceCatModel);
            if (result._id) {
                await colInst.save({
                    name: '公共测试集',
                    project_id: result._id,
                    desc: '公共测试集',
                    uid: this.getUid(),
                    add_time: yapi.commons.time(),
                    up_time: yapi.commons.time()
                })
                await catInst.save({
                    name: '公共分类',
                    project_id: result._id,
                    desc: '公共分类',
                    uid: this.getUid(),
                    add_time: yapi.commons.time(),
                    up_time: yapi.commons.time()
                })
            }
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `<a href="/user/profile/${this.getUid()}">${username}</a> 添加了项目 <a href="/project/${result._id}">${params.name}</a>`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: result._id
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
        if (!params.member_uids || !params.member_uids.length) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if (!params.id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        if (await this.checkAuth(params.id, 'project', 'edit') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }


        params.role = ['owner', 'dev', 'guest'].find(v => v === params.role) || 'dev';
        let add_members = [];
        let exist_members = [];
        let no_members = []
        for(let i = 0, len = params.member_uids.length; i < len; i++) {
            let id = params.member_uids[i]
            let check = await this.Model.checkMemberRepeat(params.id, id); 
            let userdata = await this.getUserdata(id, params.role);
            if (check > 0) {
                exist_members.push(userdata)
            } else if (!userdata) {
                no_members.push(id)
            } else {
                add_members.push(userdata)
            }
        }

        // var check = await this.Model.checkMemberRepeat(params.id, params.member_uids);
        // if (check > 0) {
        //     // return ctx.body = yapi.commons.resReturn(null, 400, '项目成员已存在');
        // }

        // params.role = ['owner', 'dev', 'guest'].find(v => v === params.role) || 'dev';

        // let userdata = await this.getUserdata(params.member_uid, params.role);
        // if (!add_members.length) {
        //     return ctx.body = yapi.commons.resReturn(null, 400, '成员uid不存在')
        // }


        try {
            let result = await this.Model.addMember(params.id, add_members);
            if(add_members.length){
                let members = add_members.map((item)=>{
                    return `<a href = "/user/profile/${item.uid}">${item.username}</a>`
                })
                members = members.join("、");
                let username = this.getUsername();
                yapi.commons.saveLog({
                    content: `<a href="/user/profile/${this.getUid()}">${username}</a> 添加了项目成员 ${members}`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: params.id
                });
            }
            ctx.body = yapi.commons.resReturn({
                result,
                add_members,
                exist_members,
                no_members
            });
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
            yapi.getInst(userModel).findById(params.member_uid).then((member)=>{
                yapi.commons.saveLog({
                    content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了项目中的成员 <a href="/user/profile/${params.member_uid}">${member.username}</a>`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: params.id
                });
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }


    async getUserdata(uid, role) {
        role = role || 'dev';
        let userInst = yapi.getInst(userModel);
        let userData = await userInst.findById(uid);
        if (!userData) {
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
            if (!result) {
                return ctx.body = yapi.commons.resReturn(null, 400, '不存在的项目');
            }
            if (result.project_type === 'private') {
                if (await this.checkAuth(result._id, 'project', 'view') !== true) {
                    return ctx.body = yapi.commons.resReturn(null, 406, '没有权限');
                }
            }
            result = result.toObject();
            let catInst = yapi.getInst(interfaceCatModel);
            let cat = await catInst.list(params.id);
            result.cat = cat;
            result.role = await this.getProjectRole(params.id, 'project');
            
            yapi.emitHook('project_add', params.id).then();
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
        let group_id = ctx.request.query.group_id, project_list = [];

        if (!group_id) {
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }

        let groupData = await this.groupModel.get(group_id);
        let isPrivateGroup = false;
        if(groupData.type === 'private' && this.getUid() === groupData.uid){
            isPrivateGroup = true;
        }
        let auth = await this.checkAuth(group_id, 'group', 'view')
        try {
            let result = await this.Model.list(group_id);
            let follow = await this.followModel.list(this.getUid());
            if(isPrivateGroup === false){                
                for(let index=0, item, r =  1; index< result.length; index++){
                    item = result[index].toObject();
                    if(item.project_type === 'private' && auth === false){
                        r = await this.Model.checkMemberRepeat(item._id, this.getUid());
                        if(r === 0){
                            continue;
                        }
                    }
                    
                    let f = _.find(follow, (fol) => {
                        return fol.projectid === item._id
                    })
                    // 排序：收藏的项目放前面
                    if (f) {
                        item.follow = true;
                        project_list.unshift(item);
                    } else {
                        item.follow = false;
                        project_list.push(item);
                    }
                }
            }else{                
                follow = follow.map(item=>{
                    item = item.toObject();
                    item.follow = true;
                    return item;
                })
                project_list = _.uniq(follow.concat(result), item=>item._id)
            }          

            ctx.body = yapi.commons.resReturn({
                list: project_list
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
            yapi.emitHook('project_del', id).then();
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
    async changeMemberRole(ctx) {
        let params = ctx.request.body;
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
        if (await this.checkAuth(params.id, 'project', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }

        params.role = ['owner', 'dev', 'guest'].find(v => v === params.role) || 'dev';
        let rolename = {
            'owner': '组长',
            'dev': '开发者',
            'guest': '访客'
        };
        try {
            let result = await projectInst.changeMemberRole(params.id, params.member_uid, params.role);

            let username = this.getUsername();
            yapi.getInst(userModel).findById(params.member_uid).then((member)=>{
                yapi.commons.saveLog({
                    content: `<a href="/user/profile/${this.getUid()}">${username}</a> 修改了项目中的成员 <a href="/user/profile/${params.member_uid}">${member.username}</a> 的角色为 "${rolename[params.role]}"`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: params.id
                });
            })
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 项目设置
     * @interface /project/upset
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @param {String} icon 项目icon
     * @param {Array} color 项目color
     * @returns {Object}
     * @example ./api/project/upset
     */
    async upSet(ctx) {
        let id = ctx.request.body.id;
        let data = {};
        if (await this.checkAuth(id, 'project', 'danger') !== true) {
            return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
        }
        data.color = ctx.request.body.color;
        data.icon = ctx.request.body.icon;
        if (!id) {
            return ctx.body = yapi.commons.resReturn(null, 405, '项目id不能为空');
        }
        try {
            let result = await this.Model.up(id, data);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
        try {
            this.followModel.updateById(this.getUid(), id, data).then(()=>{
                let username = this.getUsername();
                yapi.commons.saveLog({
                    content: `<a href="/user/profile/${this.getUid()}">${username}</a> 修改了项目图标、颜色`,
                    type: 'project',
                    uid: this.getUid(),
                    username: username,
                    typeid: id
                });
            });
        } catch (e) {
            yapi.commons.log(e, 'error'); // eslint-disable-line
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

            if (await this.checkAuth(id, 'project', 'danger') !== true) {
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
            if(params.project_type){
                data.project_type = params.project_type
            }

            if (!_.isUndefined(params.name)) data.name = params.name;
            if (!_.isUndefined(params.desc)) data.desc = params.desc;
            if (!_.isUndefined(params.group_id)) data.group_id = params.group_id;
            data.basepath = params.basepath;            
            if (!_.isUndefined(params.color)) data.color = params.color;
            if (!_.isUndefined(params.icon)) data.icon = params.icon;
            let result = await this.Model.up(id, data);
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `<a href="/user/profile/${this.getUid()}">${username}</a> 更新了项目 <a href="/project/${id}/interface/api}">${projectData.name}</a>`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: id
            });
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }    


    /**
     * 编辑项目
     * @interface /project/up_env
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {Number} id 项目id，不能为空
     * @param {Array} [env] 项目环境配置
     * @param {String} [env[].name] 环境名称
     * @param {String} [env[].domain] 环境域名
     * @returns {Object}
     * @example 
     */
    async upEnv(ctx) {
        try {
            let id = ctx.request.body.id;
            let params = ctx.request.body;
            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 405, '项目id不能为空');
            }

            if (await this.checkAuth(id, 'project', 'edit') !== true) {
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }

            if(!params.env || !Array.isArray(params.env)){
                return ctx.body = yapi.commons.resReturn(null, 405, 'env参数格式有误');
            }

            let projectData = await this.Model.get(id);
            let data = {
                up_time: yapi.commons.time()
            };

            data.env = params.env;
            let result = await this.Model.up(id, data);
            let username = this.getUsername();
            yapi.commons.saveLog({
                content: `<a href="/user/profile/${this.getUid()}">${username}</a> 更新了项目 <a href="/project/${id}/interface/api">${projectData.name}</a> 的环境`,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: id
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
}

module.exports = projectController;
