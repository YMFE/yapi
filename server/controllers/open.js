const projectModel = require('../models/project.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');

class openController extends baseController{
  constructor(ctx){
    super(ctx)
    this.projectModel = yapi.getInst(projectModel)
  }

  async projectInterfaceData(ctx){
    ctx.body = 'projectInterfaceData'
  }

  async runAutoTest(ctx){
    ctx.body = 'running...'
  }

}

module.exports = openController;