const projectModel = require('../models/project.js');
const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceModel = require('../models/interface.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const { handleParams, crossRequest, handleCurrDomain, checkNameIsExistInArray } = require('../../common/postmanLib')



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
    let curEnv = ctx.params.env_name;
    let colData = await this.interfaceColModel.get(id);
    let projectId = colData.project_id;
    let projectData = await this.projectModel.get(projectId);
    
    let caseList = await yapi.commons.getCaseList(id);
    if(caseList.errcode !== 0){
      ctx.body = caseList
    }
    caseList = caseList.data;
    caseList = caseList.map(item=>{
      item.id = item._id;
      item.case_env = curEnv || item.case_env;
      item.req_headers = this.handleReqHeader(item.req_headers, projectData.env, curEnv)
      return item;
    })
    
  }

  handleReqHeader(req_header, envData, curEnvName){
    // console.log('env', env);
    let currDomain = handleCurrDomain(envData, curEnvName);
    let header = currDomain.header;
    header.forEach(item => {
      if (!checkNameIsExistInArray(item.name, req_header)) {
        item.abled = true;
        req_header.push(item)
      }
    })
    return req_header
  }

}

module.exports = openController;