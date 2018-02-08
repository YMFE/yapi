const projectModel = require('../models/project.js');
const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceModel = require('../models/interface.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');



class openController extends baseController{
  constructor(ctx){
    super(ctx)
    this.projectModel = yapi.getInst(projectModel)
    this.interfaceColModel = yapi.getInst(interfaceColModel)
    this.interfaceCaseModel = yapi.getInst(interfaceCaseModel)
    this.interfaceModel = yapi.getInst(interfaceModel)

    this.schemaMap = {
      runAutoTest: {
        '*id': 'number'
      }
    }
  }

  async projectInterfaceData(ctx){
    ctx.body = 'projectInterfaceData'
  }

  async runAutoTest(ctx){
    let id = ctx.params.id;
    let colData = await this.interfaceColModel.get(id);
    let projectId = colData.project_id;
    let projectData = await this.projectModel.get(projectId);
    
    ctx.body = await yapi.commons.getCaseList(id);
  }

}

module.exports = openController;