const baseController = require('controllers/base.js');
const yapi = require('yapi.js');
const syncModel = require('../syncModel.js');
const md5 = require('md5');
const interfaceSyncUtils = require('../interfaceSyncUtils.js')

class syncController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.syncModel = yapi.getInst(syncModel);
    this.interfaceSyncUtils = yapi.getInst(interfaceSyncUtils);
  }

  /**
   * 保存定时任务
   * @param {*} ctx 请求上下文
   */
  async upSync(ctx) {
    let requestBody = ctx.request.body;
    let projectId = requestBody.project_id;
    if (!projectId) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少项目Id'));
    }

    if ((await this.checkAuth(projectId, 'project', 'edit')) !== true) {
      return (ctx.body = yapi.commons.resReturn(null, 405, '没有权限'));
    }

    let result;
    if (requestBody.id) {
      result = await this.syncModel.up(requestBody);
    } else {
      result = await this.syncModel.save(requestBody);
    }

    //操作定时任务
    if (requestBody.is_sync_open) {
      this.interfaceSyncUtils.addSyncJob(projectId, requestBody.sync_cron, requestBody.sync_json_url, requestBody.sync_mode, requestBody.uid);
    } else {
      this.interfaceSyncUtils.deleteSyncJob(projectId);
    }
    return (ctx.body = yapi.commons.resReturn(result));
  }

  /**
   * 强制执行一次定时任务，不论上次同步的数据与 old_swagger_content 是否相同
   * @param {*} ctx 请求上下文
   */
  async forceSync(ctx) {
    let projectId = ctx.query.project_id;
    if (!projectId) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '缺少项目Id'));
    }
    let syncItem = await this.syncModel.getByProjectId(projectId);
    //覆盖上次记录的swagger数据
    syncItem.old_swagger_content = md5("");
    await this.syncModel.up(syncItem);

    if (syncItem.is_sync_open) {
      this.interfaceSyncUtils.addSyncJob(projectId, syncItem.sync_cron, syncItem.sync_json_url, syncItem.sync_mode, syncItem.uid);
      return (ctx.body = yapi.commons.resReturn(syncItem));
    } else {
      return (ctx.body = yapi.commons.resReturn(null, 400, '未打开定时同步'));
    }
  }

  /**
   * 查询定时任务 请求上下文
   * @param {*} ctx 
   */
  async getSync(ctx) {
    let projectId = ctx.query.project_id;
    if (!projectId) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '缺少项目Id'));
    }
    let result = await this.syncModel.getByProjectId(projectId);
    return (ctx.body = yapi.commons.resReturn(result));
  }

}


module.exports = syncController;