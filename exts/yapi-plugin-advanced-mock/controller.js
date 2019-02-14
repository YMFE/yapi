const baseController = require('controllers/base.js');
const advModel = require('./advMockModel.js');
const yapi = require('yapi.js');
const caseModel = require('./caseModel.js');
const userModel = require('models/user.js');
const config = require('./index.js');

class advMockController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(advModel);
    this.caseModel = yapi.getInst(caseModel);
    this.userModel = yapi.getInst(userModel);
  }

  async getMock(ctx) {
    let id = ctx.query.interface_id;
    let mockData = await this.Model.get(id);
    if (!mockData) {
      return (ctx.body = yapi.commons.resReturn(null, 408, 'mock脚本不存在'));
    }
    return (ctx.body = yapi.commons.resReturn(mockData));
  }

  async upMock(ctx) {
    let params = ctx.request.body;
    try {
      let auth = await this.checkAuth(params.project_id, 'project', 'edit');

      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 40033, '没有权限'));
      }

      if (!params.interface_id) {
        return (ctx.body = yapi.commons.resReturn(null, 408, '缺少interface_id'));
      }
      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 408, '缺少project_id'));
      }

      let data = {
        interface_id: params.interface_id,
        mock_script: params.mock_script || '',
        project_id: params.project_id,
        uid: this.getUid(),
        enable: params.enable === true ? true : false
      };
      let result;
      let mockData = await this.Model.get(data.interface_id);
      if (mockData) {
        result = await this.Model.up(data);
      } else {
        result = await this.Model.save(data);
      }
      return (ctx.body = yapi.commons.resReturn(result));
    } catch (e) {
      return (ctx.body = yapi.commons.resReturn(null, 400, e.message));
    }
  }

  async list(ctx) {
    try {
      let id = ctx.query.interface_id;
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '缺少 interface_id'));
      }
      let result = await this.caseModel.list(id);
      for (let i = 0, len = result.length; i < len; i++) {
        let userinfo = await this.userModel.findById(result[i].uid);
        result[i] = result[i].toObject();
        // if (userinfo) {
        result[i].username = userinfo.username;
        // }
      }

      ctx.body = yapi.commons.resReturn(result);
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }

  async getCase(ctx) {
    let id = ctx.query.id;
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '缺少 id'));
    }
    let result = await this.caseModel.get({
      _id: id
    });

    ctx.body = yapi.commons.resReturn(result);
  }

  async saveCase(ctx) {
    let params = ctx.request.body;

    if (!params.interface_id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少interface_id'));
    }
    if (!params.project_id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少project_id'));
    }

    if (!params.res_body) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '请输入 Response Body'));
    }

    let data = {
      interface_id: params.interface_id,
      project_id: params.project_id,
      ip_enable: params.ip_enable,
      name: params.name,
      params: params.params || [],
      uid: this.getUid(),
      code: params.code || 200,
      delay: params.delay || 0,
      headers: params.headers || [],
      up_time: yapi.commons.time(),
      res_body: params.res_body,
      ip: params.ip
    };

    data.code = isNaN(data.code) ? 200 : +data.code;
    data.delay = isNaN(data.delay) ? 0 : +data.delay;
    if (config.httpCodes.indexOf(data.code) === -1) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '非法的 httpCode'));
    }

    let findRepeat, findRepeatParams;
    findRepeatParams = {
      project_id: data.project_id,
      interface_id: data.interface_id,
      ip_enable: data.ip_enable
    };

    if (data.params && typeof data.params === 'object' && Object.keys(data.params).length > 0) {
      for (let i in data.params) {
        findRepeatParams['params.' + i] = data.params[i];
      }
    }

    if (data.ip_enable) {
      findRepeatParams.ip = data.ip;
    }

    findRepeat = await this.caseModel.get(findRepeatParams);

    if (findRepeat && findRepeat._id !== params.id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '已存在的期望'));
    }

    let result;
    if (params.id && !isNaN(params.id)) {
      data.id = +params.id;
      result = await this.caseModel.up(data);
    } else {
      result = await this.caseModel.save(data);
    }
    return (ctx.body = yapi.commons.resReturn(result));
  }

  async delCase(ctx) {
    let id = ctx.request.body.id;
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少 id'));
    }
    let result = await this.caseModel.del(id);
    return (ctx.body = yapi.commons.resReturn(result));
  }

  async hideCase(ctx) {
    let id = ctx.request.body.id;
    let enable = ctx.request.body.enable;
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少 id'));
    }
    let data = {
      id,
      case_enable: enable
    };
    let result = await this.caseModel.up(data);
    return (ctx.body = yapi.commons.resReturn(result));
  }
}

module.exports = advMockController;
