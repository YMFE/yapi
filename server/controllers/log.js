const logModel = require('../models/log.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const groupModel = require('../models/group');
const projectModel = require('../models/project');

class logController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(logModel);
        this.groupModel = yapi.getInst(groupModel);
        this.projectModel = yapi.getInst(projectModel);
    }

    /**
     * 获取动态列表
     * @interface /log/list
     * @method GET
     * @category log
     * @foldnumber 10
     * @param {Number} typeid 动态类型id， 不能为空
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example /log/list
     */
    
    async list(ctx) {
        let typeid = ctx.request.query.typeid,
            page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10,
            type = ctx.request.query.type;
        if (!typeid) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'typeid不能为空');
        }
        if(!type) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'type不能为空');
        }
        try {
            if(type === "group"){
                let projectList = await this.projectModel.list(typeid);
                let projectIds = [], projectDatas = {};
                for(let i in projectList){
                    projectDatas[projectList[i]._id] = projectList[i];
                    projectIds[i] = projectList[i]._id;
                }
                let projectLogList = await this.Model.listWithPagingByGroup(typeid,projectIds,page,limit);
                projectLogList.forEach((item, index)=>{
                    item = item.toObject();
                    if(item.type === 'project'){
                        item.content = `在 <a href="/project/${item.typeid}">${projectDatas[item.typeid].name}</a> 项目: ` + item.content;
                    }
                    projectLogList[index] = item;
                })
                let total = await this.Model.listCountByGroup(typeid,projectIds);
                ctx.body = yapi.commons.resReturn({
                    list: projectLogList,
                    total: Math.ceil(total / limit)
                });
            }else if(type === "project"){
                let result = await this.Model.listWithPaging(typeid,type, page, limit);
                let count = await this.Model.listCount(typeid,type);
                
                ctx.body = yapi.commons.resReturn({
                    total: Math.ceil(count / limit),
                    list: result
                });
            }
            
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 402, err.message);
        }
    }

}

module.exports = logController;