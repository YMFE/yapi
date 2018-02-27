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
const os = require("os");
let cpu = require('cpu-load');

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

  /**
   * 获取邮箱状态信息
   * @interface statismock/getSystemStatus
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getSystemStatus(ctx) {
    let mail = '';
    if (yapi.WEBCONFIG.mail && yapi.WEBCONFIG.mail.enable) {
      mail = await this.checkEmail();
      // return ctx.body = yapi.commons.resReturn(result);
    } else {
      mail = '未配置'
    }

    let load = await this.cupLoad()*100;

    let systemName = os.platform();
    let totalmem = commons.transformBytesToGB(os.totalmem());
    let freemem = commons.transformBytesToGB(os.freemem());
    let uptime = commons.transformSecondsToDay(os.uptime());
    
    let data = {
      mail,
      systemName,
      totalmem,
      freemem,
      uptime,
      load: load.toFixed(2)
    }
    return ctx.body = yapi.commons.resReturn(data);

  }


  checkEmail() {
    return new Promise((resolve, reject) => {
      let result = {}
      yapi.mail.verify((error) => {
        if (error) {
          result = '不可用';
          resolve(result)
        } else {
          result = '可用';
          resolve(result)
        }
      })
    })
  }

  cupLoad() {
    return new Promise((resolve,reject)=>{
      cpu(1000, function (load) {
        resolve(load)
      })
    })
  }
}



module.exports = statisMockController;