/**
 * Created by gxl.gao on 2017/10/24.
 */
const baseController = require('controllers/base.js');
const statisMockModel = require('./statisMockModel.js');
const groupModel = require('models/group.js');
const projectModel = require('models/project.js');
const interfaceModel = require('models/interface.js');
const interfaceCaseModel = require('models/interfaceCase.js')

const yapi = require('yapi.js');
const config = require('./index.js');
const commons = require('./util.js');

class statisMockController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(statisMockModel);
    this.groupModel = yapi.getInst(groupModel);
    this.projectModel = yapi.getInst(projectModel);
    this.interfaceModel = yapi.getInst(interfaceModel);
    this.interfaceCaseModel = yapi.getInst(interfaceCaseModel);
  }

  /**
     * 获取所有统计总数
     * @interface statismock/count
     * @method get
     * @category statistics
     * @foldnumber 10
     * @returns {Object}
     */
  async getStatisCount(ctx) {
    let groupCount = await this.groupModel.getGroupListCount();
    let projectCount = await this.projectModel.getProjectListCount();
    let interfaceCount = await this.interfaceModel.getInterfaceListCount();
    let interfaceCaseCount = await this.interfaceCaseModel.getInterfaceCaseListCount();

    return ctx.body = yapi.commons.resReturn({ groupCount, projectCount, interfaceCount, interfaceCaseCount });
  }

  /**
   * 获取所有mock接口数据信息
   * @interface statismock/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getMockDateList(ctx) {
    let mockCount = await this.Model.getTotalCount();
    let mockDateList = [];

    if (!this.getRole() === 'admin') {
      return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
    }
    //  默认时间是30 天为一周期
    let dateInterval = commons.getDateRange();
    mockDateList = await this.Model.getDayCount(dateInterval);
    return ctx.body = yapi.commons.resReturn({ mockCount, mockDateList });
  }
}



module.exports = statisMockController;