const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceModel = require('../models/interface.js');
const projectModel = require('../models/project.js');
const baseController = require('./base.js');
const interfaceAutoReport = require("../models/interfaceAutoReport.js");
const yapi = require('../yapi.js');
const _ = require('underscore');

class interfaceAutoReportController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.autoReport = yapi.getInst(interfaceAutoReport);
  }

  /**
   * 获取一个测试用例详情
   * @interface /report/get_report
   * @method GET
   * @category report
   * @foldnumber 10
   * @param {String} reportid
   * @returns {Object}
   * @example
   */
  async getReport(ctx) {

    try {
      let id = ctx.params.reportid;
      let result = await this.autoReport.get(id);
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '不存在的报告'));
      }
      result = result.toObject();
      ctx.body = result.report;
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }
}

module.exports = interfaceAutoReportController;
