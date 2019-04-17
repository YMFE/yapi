const schedule = require('node-schedule');
const openController = require('../controllers/open.js');
const projectModel = require('../models/project.js');
const tokenModel = require('../models/token.js');
const yapi = require('../yapi.js')
const sha = require('sha.js');
const md5 = require('md5');
const { getToken } = require('../utils/token');
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

        let scheduleItem = schedule.scheduleJob(cronExpression, async () => {
            yapi.commons.log('定时器触发, syncJsonUrl:' + swaggerUrl + ",合并模式:" + syncMode);
            
            let oldPorjectData = await this.projectModel.get(projectId);
            let newSwaggerJsonData = await this.getSwaggerContent(swaggerUrl);

            //判断获取的json数据是否正确
            if(!newSwaggerJsonData || newSwaggerJsonData.indexOf('error') != -1) {
                //记录日志
                this.saveSyncLog(0, syncMode, newSwaggerJsonData, uid, projectId);
                return;
            }
            //更新之前判断本次swagger json数据是否跟上次的相同,相同则不更新
            if (oldPorjectData.old_swagger_content && oldPorjectData.old_swagger_content == md5(newSwaggerJsonData)) {
                //记录日志
                this.saveSyncLog(0, syncMode, "接口无更新", uid, projectId);
                oldPorjectData.last_sync_time = yapi.commons.time();
                await this.projectModel.up(projectId, oldPorjectData);
                return;
            }

            let _params = {
                type: 'swagger',
                json: newSwaggerJsonData,
                project_id: projectId,
                merge: syncMode,
                token: projectToken
            }
            let requestObj = {
                params: _params
            };
            await this.openController.importData(requestObj);
            
            //修改project的属性
            oldPorjectData.last_sync_time = yapi.commons.time();
            oldPorjectData.old_swagger_content = md5(newSwaggerJsonData);
            await this.projectModel.up(projectId, oldPorjectData);

            //记录日志
            this.saveSyncLog(requestObj.body.errcode, syncMode, requestObj.body.errmsg, uid, projectId);
        });

        //判断是否已经存在这个任务
        let jobItem = jobMap.get(projectId);
        if (jobItem) {
            jobItem.cancel();
        }
        jobMap.set(projectId, scheduleItem);
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

    /**
     * 记录同步日志
     * @param {*} errcode 
     * @param {*} syncMode 
     * @param {*} moremsg 
     * @param {*} uid 
     * @param {*} projectId 
     */
    saveSyncLog(errcode, syncMode, moremsg, uid, projectId) {
        yapi.commons.saveLog({
            content: '自动同步接口状态:' + (errcode == 0 ? '成功,' : '失败,') + "合并模式:" + this.getSyncModeName(syncMode) + ",更多信息:" + moremsg,
            type: 'project',
            uid: uid,
            username: "自动同步用户",
            typeid: projectId
        });
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

    async getSwaggerContent(swaggerUrl) {
        let content = '';
        try {
            let request = require("request");// let Promise = require('Promise');
            let syncGet = function (url) {
                return new Promise(function (resolve, reject) {
                    request.get({ url: url }, function (error, response, body) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(body);
                        }
                    });
                });
            }
            if (swaggerUrl) {
                content = await syncGet(swaggerUrl);
            } 
        } catch (e) {
            return 'error:json格式有误:' + e;
        }
        return content;
    }

}

module.exports = syncUtils;