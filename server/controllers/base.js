const yapi = require('../yapi.js');
const projectModel = require('../models/project.js');
const userModel = require('../models/user.js');
const interfaceModel = require('../models/interface.js');
const groupModel = require('../models/group.js');

const _ = require('underscore');
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
      '/api/user/login_by_token',
      '/api/user/login',
      '/api/user/reg',
      '/api/user/status',
      '/api/user/logout',
      '/api/user/avatar'
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
      let result = yapi.commons.fieldSelect(this.$user, ['_id', 'username', 'email', 'up_time', 'add_time', 'role', 'type', 'study']);
      return ctx.body = yapi.commons.resReturn(result);
    }
    return ctx.body = yapi.commons.resReturn(null, 40011, '请登录...');
  }

  getRole() {
    return this.$user.role;
  }

  getUsername() {
    return this.$user.username;
  }

  getEmail(){
    return this.$user.email;
  }

  async getProjectRole(id, type) {
    let result = {};
    try {
      if (this.getRole() === 'admin') {
        return 'admin';
      }
      if (type === 'interface') {
        let interfaceInst = yapi.getInst(interfaceModel);
        let interfaceData = await interfaceInst.get(id)
        result.interfaceData = interfaceData;
        // 项目创建者相当于 owner
        if (interfaceData.uid === this.getUid()) {
          return 'owner';
        }
        type = 'project';
        id = interfaceData.project_id;
      }

      if (type === 'project') {
        let projectInst = yapi.getInst(projectModel);
        let projectData = await projectInst.get(id);
        if (projectData.uid === this.getUid()) {
          return 'owner';
        }
        let memberData = _.find(projectData.members, (m) => {
          if (m.uid === this.getUid()) {
            return true;
          }
        })

        if (memberData && memberData.role) {
          if (memberData.role === 'owner') {
            return 'owner';
          } else if (memberData.role === 'dev') {
            return 'dev';
          } else {
            return 'guest';
          }
        }
        type = 'group';
        id = projectData.group_id
      }

      if (type === 'group') {
        let groupInst = yapi.getInst(groupModel);
        let groupData = await groupInst.get(id);
        if (groupData.uid === this.getUid()) {
          return 'owner';
        }


        let groupMemberData = _.find(groupData.members, (m) => {
          if (m.uid === this.getUid()) {
            return true;
          }
        })
        if (groupMemberData && groupMemberData.role) {
          if (groupMemberData.role === 'owner') {
            return 'owner';
          } else if (groupMemberData.role === 'dev') {
            return 'dev'
          } else {
            return 'guest'
          }
        }
      }

      return 'member';
    }
    catch (e) {
      yapi.commons.log(e.message, 'error')
      return false;
    }
  }
  /**
   * 身份验证
   * @param {*} id type对应的id
   * @param {*} type enum[interface, project, group] 
   * @param {*} action enum[ danger, edit, view ] danger只有owner或管理员才能操作,edit只要是dev或以上就能执行
   */
  async checkAuth(id, type, action) {
    let role = await this.getProjectRole(id, type);
    if (action === 'danger') {
      if (role === 'admin' || role === 'owner') {
        return true;
      }
    } else if (action === 'edit') {
      if (role === 'admin' || role === 'owner' || role === 'dev') {
        return true;
      }
    } else if (action === 'view') {
      if (role === 'admin' || role === 'owner' || role === 'dev' || role === 'guest') {
        return true;
      }
    }
    return false;
  }
}

module.exports = baseController;