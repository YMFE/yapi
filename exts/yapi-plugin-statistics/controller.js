/**
 * Created by gxl.gao on 2017/10/24.
 */
const baseController = require('controllers/base.js');
const statisMockModel = require('./statisMockModel.js');
const groupModel = require('models/group.js');
const projectModel = require('models/project.js');
const interfaceModel = require('models/interface.js');

const yapi = require('yapi.js');
const config = require('./index.js');

class statisMockController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(statisMockModel);
    this.groupModel = yapi.getInst(groupModel);
    this.projectModel = yapi.getInst(projectModel);
    this.interfaceModel = yapi.getInst(interfaceModel);
  }

  async getStatisMock(ctx) {
    // let id = ctx.query.interface_id;
    // let mockData = await this.Model.get(id);
    let groupCount = await this.groupModel.getGroupListCount();
    let projectCount = await this.projectModel.getProjectListCount();
    let interfaceCount = await this.interfaceModel.getInterfaceListCount();

    // if(!mockData){
    //     return ctx.body = yapi.commons.resReturn(null, 408, 'mock脚本不存在');
    // }
    return ctx.body = yapi.commons.resReturn({groupCount, projectCount, interfaceCount});
  }
}

module.exports = statisMockController;