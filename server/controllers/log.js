const logModel = require('../models/log.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const groupModel = require('../models/group');
const projectModel = require('../models/project');
const interfaceModel = require('../models/interface');

class logController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(logModel);
    this.groupModel = yapi.getInst(groupModel);
    this.projectModel = yapi.getInst(projectModel);
    this.interfaceModel = yapi.getInst(interfaceModel);
    this.schemaMap = {
      listByUpdate: {
        '*type': 'string',
        '*typeid': 'number',
        apis: [
          {
            method: 'string',
            path: 'string'
          }
        ]
      }
    };
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
      type = ctx.request.query.type,
      selectValue = ctx.request.query.selectValue;
    if (!typeid) {
      return (ctx.body = yapi.commons.resReturn(null, 400, 'typeid不能为空'));
    }
    if (!type) {
      return (ctx.body = yapi.commons.resReturn(null, 400, 'type不能为空'));
    }
    try {
      if (type === 'group') {
        let projectList = await this.projectModel.list(typeid);
        let projectIds = [],
          projectDatas = {};
        for (let i in projectList) {
          projectDatas[projectList[i]._id] = projectList[i];
          projectIds[i] = projectList[i]._id;
        }
        let projectLogList = await this.Model.listWithPagingByGroup(
          typeid,
          projectIds,
          page,
          limit
        );
        projectLogList.forEach((item, index) => {
          item = item.toObject();
          if (item.type === 'project') {
            item.content =
              `在 <a href="/project/${item.typeid}">${projectDatas[item.typeid].name}</a> 项目: ` +
              item.content;
          }
          projectLogList[index] = item;
        });
        let total = await this.Model.listCountByGroup(typeid, projectIds);
        ctx.body = yapi.commons.resReturn({
          list: projectLogList,
          total: Math.ceil(total / limit)
        });
      } else if (type === "project") {
        let result = await this.Model.listWithPaging(typeid, type, page, limit, selectValue);
        let count = await this.Model.listCount(typeid, type, selectValue);

        ctx.body = yapi.commons.resReturn({
          total: Math.ceil(count / limit),
          list: result
        });
      }
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 402, err.message);
    }
  }
  /**
   * 获取特定cat_id下最新修改的动态信息
   * @interface /log/list_by_update
   * @method post
   * @category log
   * @foldnumber 10
   * @param {Number} typeid 动态类型id， 不能为空
   * @returns {Object}
   * @example /log/list
   */

  async listByUpdate(ctx) {
    let params = ctx.params;

    try {
      let { typeid, type, apis } = params;
      let list = [];
      let projectDatas = await this.projectModel.getBaseInfo(typeid, 'basepath');
      let basePath = projectDatas.toObject().basepath;

      for (let i = 0; i < apis.length; i++) {
        let api = apis[i];
        if (basePath) {
          api.path = api.path.indexOf(basePath) === 0 ? api.path.substr(basePath.length) : api.path;
        }
        let interfaceIdList = await this.interfaceModel.getByPath(
          typeid,
          api.path,
          api.method,
          '_id'
        );

        for (let j = 0; j < interfaceIdList.length; j++) {
          let interfaceId = interfaceIdList[j];
          let id = interfaceId.id;
          let result = await this.Model.listWithCatid(typeid, type, id);

          list = list.concat(result);
        }
      }

      // let result = await this.Model.listWithCatid(typeid, type, catId);
      ctx.body = yapi.commons.resReturn(list);
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 402, err.message);
    }
  }
}

module.exports = logController;
