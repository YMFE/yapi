const schedule = require('node-schedule');
const openController = require('../controllers/open.js');
const projectModel = require('../models/project.js')
const tokenModel = require('../models/token.js')
const yapi = require('../yapi.js')
const sha = require('sha.js');
const {getToken} = require('../utils/token')
const jobMap = new Map();

class syncUtils {

    constructor(ctx) {
        yapi.commons.log("-------------------------------------interfaceSyncUtils constructor-----------------------------------------------");
        this.ctx = ctx;
        this.openController = yapi.getInst(openController);
        this.tokenModel = yapi.getInst(tokenModel)
        this.projectModel = yapi.getInst(projectModel);
        this.init()
    }

    //初始化定时任务
    async init() {
        let allProject = await this.projectModel.listAll();
        for (let i = 0, len = allProject.length; i < len; i++) {
            let projectItem = allProject[i];
            if (projectItem.is_sync_open) {
                this.addSyncJob(projectItem._id, projectItem.sync_cron, projectItem.sync_json_url, projectItem.sync_mode, projectItem.uid);
            }
        }
    }

    /**
     * 新增同步任务.
     * @param {*} projectId 项目id
     * @param {*} cronExpression cron表达式,针对定时任务
     * @param {*} swaggerUrl 获取swagger的地址
     * @param {*} syncMode 同步模式
     * @param {*} uid 用户id
     */
    async addSyncJob(projectId, cronExpression, swaggerUrl, syncMode, uid) {
        let projectToken = await this.getProjectToken(projectId, uid);

        let scheduleItem = schedule.scheduleJob(cronExpression, async ()=>{
            yapi.commons.log('定时器触发, syncJsonUrl:' + swaggerUrl +",合并模式:" + syncMode);
            let _params = {
                type: 'swagger',
                url: swaggerUrl,
                project_id: projectId,
                merge: syncMode,
                token: projectToken
            }
            let requestObj = {
                params: _params
            };
            await this.openController.importData(requestObj);

            //记录日志
            yapi.commons.saveLog({
                content: '自动同步接口状态:' + (requestObj.body.errcode == 0? '成功,' : '失败,') + "合并模式:" + this.getSyncModeName(syncMode) + ",更多信息:" + requestObj.body.errmsg,
                type: 'project',
                uid: uid,
                username: "自动同步用户",
                typeid: projectId
            });
        });

        let jobItem = jobMap.get(projectId);
        if (jobItem) {
            jobItem.cancel();
        }
        jobMap.set(projectId, scheduleItem);
    }

    /**
     * 获取项目token,因为导入接口需要鉴权.
     * @param {*} project_id 项目id
     * @param {*} uid 用户id
     */
    async getProjectToken(project_id, uid) {
      try {
        let data = await this.tokenModel.get(project_id);
        let token;
        if (!data) {
          let passsalt = yapi.commons.randStr();
          token = sha('sha1')
            .update(passsalt)
            .digest('hex')
            .substr(0, 20);
  
          await this.tokenModel.save({ project_id, token });
        } else {
          token = data.token;
        }
  
        token = getToken(token, uid);
  
        return token;
      } catch (err) {
          return "";
      }
    }

    getUid(uid) {
        return parseInt(uid, 10);
    }

    /**
     * 转换合并模式的值为中文.
     * @param {*} syncMode 合并模式
     */
    getSyncModeName(syncMode) {
        if (syncMode == 'good') {
            return '智能合并';
        } else if (syncMode == 'normal') {
            return '普通模式';
        } else if (syncMode == 'merge') {
            return '完全覆盖';
        }
        return '';
    }

    getSyncJob(projectId) {
        return jobMap.get(projectId);
    }

    deleteSyncJob(projectId) {
        let jobItem = jobMap.get(projectId);
        if (jobItem) {
            jobItem.cancel();
        }
    }
}

module.exports = syncUtils;