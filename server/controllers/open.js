const projectModel = require('../models/project.js');
const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceModel = require('../models/interface.js');
const tokenModel = require('../models/token.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');
const { handleParams, crossRequest, handleCurrDomain, checkNameIsExistInArray } = require('../../common/postmanLib')
const {handleParamsValue} = require('../../common/utils.js')
const renderToHtml = require('../utils/reportHtml')

class openController extends baseController{
  constructor(ctx){
    super(ctx)
    this.projectModel = yapi.getInst(projectModel)
    this.interfaceColModel = yapi.getInst(interfaceColModel)
    this.interfaceCaseModel = yapi.getInst(interfaceCaseModel)
    this.interfaceModel = yapi.getInst(interfaceModel)
    this.tokenModel = yapi.getInst(tokenModel);
    this.handleValue = this.handleValue.bind(this)
    this.schemaMap = {
      runAutoTest: {
        '*id': 'number',
        'env_name': 'string',
        'token': 'string',
        'mode' : {
          type: 'string',
          default: 'html'
        }
      }
    }
  }

  async getProjectIdByToken(token){
    let projectId = await this.tokenModel.findId(token);
    return projectId.toObject().project_id
  }

  async projectInterfaceData(ctx){
    ctx.body = 'projectInterfaceData'
  }

  handleValue(val){
    return handleParamsValue(val, this.records);
  }

  async runAutoTest(ctx){
    const startTime = new Date().getTime();
    const records = this.records = {};
    const reports = this.reports = {};
    const testList = []
    let id = ctx.params.id;
    let token = ctx.params.token;
    let curEnv = ctx.params.env_name;
    let colData = await this.interfaceColModel.get(id);
    if(!colData){
      return ctx.body = yapi.commons.resReturn(null, 40022, 'id值不存在');
    }

    if(!token){
      return ctx.body = yapi.commons.resReturn(null, 40033, '没有权限');
    }
    
    let checkId = await this.getProjectIdByToken(token);
    
    let projectId = colData.project_id;
    if(checkId !== projectId){
      return ctx.body = yapi.commons.resReturn(null, 40033, '没有权限');
    }
    let projectData = await this.projectModel.get(projectId);
    
    let caseList = await yapi.commons.getCaseList(id);
    if(caseList.errcode !== 0){
      ctx.body = caseList
    }
    caseList = caseList.data;
    for(let i=0, l= caseList.length; i< l; i++){
      let item = caseList[i];
      item.id = item._id;
      item.case_env = curEnv || item.case_env;
      item.req_headers = this.handleReqHeader(item.req_headers, projectData.env, curEnv)
      item.pre_script = projectData.pre_script;
      item.after_script = projectData.after_script;
      item.env= projectData.env;
      let result;
      try{
        result = await this.handleTest(item);
      }catch(err){        
        result = err;
      }

      reports[item.id] = result;
      records[item.id] = {
        params: result.params,
        body: result.res_body
      }
      testList.push(result)
    }

    function getMessage(testList){
      let successNum = 0, failedNum = 0, len = 0, msg='';
      testList.forEach(item=>{
        len++;
        if(item.code ===0) successNum++;
        else failedNum++;
      })
      if(failedNum === 0){
        msg= `一共 ${len} 测试用例，全部验证通过`
      } else{
        msg= `一共 ${len} 测试用例，${successNum} 个验证通过， ${failedNum} 个未通过。`
      }
      

      return { msg, len, successNum, failedNum }
    }

    const endTime = new Date().getTime();
    const executionTime = (endTime - startTime)/1000;

    let reportsResult = {
      message: getMessage(testList),
      runTime: executionTime + 's',
      numbs: testList.length,
      list: testList
    }
    if(ctx.params.mode === 'json'){
      return ctx.body = reportsResult
    }else{
      return ctx.body = renderToHtml(reportsResult)
    }
  }

  async handleTest(interfaceData){
    let requestParams = {};
    let options;
    options = handleParams(interfaceData, this.handleValue, requestParams)
    let result = {
      id: interfaceData.id,
      name: interfaceData.title,
      path: interfaceData.path,
      code: 400,
      validRes: []
    };
    try {
      let data = await crossRequest(options, interfaceData.pre_script, interfaceData.after_script)
      let res= data.res;
      
      result = Object.assign(
        result,
        {
          status: res.status,
          statusText: res.statusText,
          url: data.req.url,
          method: data.req.method,
          data: data.req.data,
          headers: data.req.headers,
          res_header: res.header,
          res_body: res.body
        }
      )
      if (options.data && typeof options.data === 'object') {
        requestParams = Object.assign(
          requestParams,
          options.data
        )
      }

      let validRes = [];

      let responseData = Object.assign({}, {
        status: res.status,
        body: res.body,
        header: res.header,
        statusText: res.statusText
      })

      await this.handleScriptTest(interfaceData, responseData, validRes, requestParams);
      result.params = requestParams;
      if (validRes.length === 0) {
        result.code = 0;
        result.validRes = [{ message: '验证通过' }];
      } else if (validRes.length > 0) {
        result.code = 1;
        result.validRes = validRes;
      }

    }catch(data){
      result = Object.assign(options,
        result,
        {
          res_header: data.header,
          res_body: data.body || data.message,
          status: null,
          statusText: data.message,
          code: 400
        }
      )

    }

    return result;
  }



  async handleScriptTest (interfaceData, response, validRes, requestParams){
    if (interfaceData.enable_script !== true) {
      return null;
    }
    try {
      let test = await yapi.commons.runCaseScript({
        response: response,
        records: this.records,
        script: interfaceData.test_script,
        params: requestParams
      })
      if (test.errcode !== 0) {
        test.data.logs.forEach(item => {
          validRes.push({
            message: item
          })
        })
      }
    } catch (err) {
      validRes.push({
        message: 'Error: ' + err.message
      })
    }
  }

  handleReqHeader(req_header, envData, curEnvName){
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