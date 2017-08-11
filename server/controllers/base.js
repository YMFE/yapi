import yapi from '../yapi.js';
import projectModel from '../models/project.js';
import userModel from '../models/user.js';
import interfaceModel from '../models/interface.js'
import groupModel from '../models/group.js'

import _ from 'underscore'
const jwt = require('jsonwebtoken');

class baseController {
    constructor(ctx) {
        this.ctx = ctx;
        //网站上线后，role对象key是不能修改的，value可以修改
        this.roles = {
            admin: 'Admin',
            member: '网站会员'
        };
    }

    async init(ctx) {
        this.$user = null;
        let ignoreRouter = [
            '/user/login_by_token',
            '/user/login',
            '/user/reg',
            '/user/status',
            '/user/logout'
        ];
        if (ignoreRouter.indexOf(ctx.path) > -1) {            
            this.$auth = true;
        } else {
            await this.checkLogin(ctx);
        }

    }

    getUid() {
        return parseInt(this.$uid, 10);
    }

    async checkLogin(ctx) {
        let token = ctx.cookies.get('_yapi_token');
        let uid = ctx.cookies.get('_yapi_uid');

        try {
            if (!token || !uid) return false;
            let userInst = yapi.getInst(userModel); //创建user实体
            let result = await userInst.findById(uid);
            let decoded = jwt.verify(token, result.passsalt);

            if (decoded.uid == uid) {
                this.$uid = uid;
                this.$auth = true;
                this.$user = result;
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }

    }
    /**
     * 
     * @param {*} ctx 
     */

    async getLoginStatus(ctx) {
        if (await this.checkLogin(ctx) === true) {
            let result = yapi.commons.fieldSelect(this.$user, ['_id', 'username', 'email', 'up_time', 'add_time', 'role', 'type']);
            result.server_ip = yapi.WEBCONFIG.server_ip;
            return ctx.body = yapi.commons.resReturn(result);
        }
        return ctx.body = yapi.commons.resReturn(null, 300, 'Please login.');
    }

    getRole() {
        return this.$user.role;
    }

    /**
     * 
     * @param {*} id type对应的id
     * @param {*} type enum[interface, project, group] 
     * @param {*} action enum[ danger , edit ] danger只有owner或管理员才能操作,edit只要是dev或以上就能执行
     */
    async checkAuth(id, type, action) {
        let result = {};
        try {
            if (this.getRole() === 'admin') {
                return true;
            }
            if (type === 'interface') {
                let interfaceInst = yapi.getInst(interfaceModel);
                let interfaceData = await interfaceInst.get(id)
                result.interfaceData = interfaceData;
                if (interfaceData.uid === this.getUid()) {
                    return true;
                }
                type = 'project';
                id = interfaceData.project_id;
            }

            if (type === 'project') {
                let projectInst = yapi.getInst(projectModel);
                let projectData = await projectInst.get(id);   
                if(projectData.uid === this.getUid()){
                    return true;
                }             
                let memberData = _.find(projectData.members, (m) => {
                    if (m.uid === this.getUid()) {
                        return true;
                    }
                })

                if (memberData && memberData.role) {
                    if(action === 'danger' && memberData.role === 'owner'){
                        return true;
                    }
                    if(action === 'edit'){
                        return true;
                    }
                }
                type = 'group';
                id = projectData.group_id
            }

            if (type === 'group') {
                let groupInst = yapi.getInst(groupModel);
                let groupData = await groupInst.get(id);
                let groupMemberData = _.find(groupData.members, (m) => {
                    if (m.uid === this.getUid()) {
                        return true;
                    }
                })
                if (groupMemberData && groupMemberData.role) {
                    if(action === 'danger' && groupMemberData.role === 'owner'){
                        return true;
                    }
                    if(action === 'edit'){
                        return true;
                    }
                }
            }

            return false;
        }
        catch (e) {
            yapi.commons.log(e.message, 'error')
            return false;
        }
    }
}

module.exports = baseController;