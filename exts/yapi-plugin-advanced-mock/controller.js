const baseController = require('controllers/base.js');
const advModel = require('./advMockModel.js');
const yapi = require('yapi.js');
const caseModel = require('./caseModel.js');

class advMockController extends baseController{
  constructor(ctx){
    super(ctx);
    this.Model = yapi.getInst(advModel);
    this.caseModel = yapi.getInst(caseModel);
  }

  async getMock(ctx){
    let id = ctx.query.interface_id;
    let mockData = await  this.Model.get(id);
    if(!mockData){
      return ctx.body = yapi.commons.resReturn(null, 408, 'mock脚本不存在');
    }
    return ctx.body = yapi.commons.resReturn(mockData);
  }

  async upMock(ctx){
    let params = ctx.request.body;
    try{
      if(!params.interface_id){
        return ctx.body =yapi.commons.resReturn(null, 408, '缺少interface_id');
      }
      if(!params.project_id){
        return ctx.body =yapi.commons.resReturn(null, 408, '缺少project_id');
      }

      let data = {
        interface_id: params.interface_id,
        mock_script: params.mock_script || '',
        project_id: params.project_id,
        uid: this.getUid(),
        enable: params.enable === true ? true : false
      }
      let result;
      let mockData = await  this.Model.get(data.interface_id);
      if(mockData){
        result = await this.Model.up(data);
      }else{
        result = await this.Model.save(data);
      }
      return ctx.body = yapi.commons.resReturn(result);
    }catch(e){
      return ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }

  async list(ctx){
    let id = ctx.query.interface_id;
    if(!id){
      return ctx.body = yapi.commons.resReturn(null, 400, '缺少 interface_id');
    }
    let result = await this.caseModel.list(id);

    ctx.body = yapi.commons.resReturn(result);
  }

  async getCase(ctx){
    let id = ctx.query.id;
    if(!id){
      return ctx.body = yapi.commons.resReturn(null, 400, '缺少 id');
    }
    let result = await this.caseModel.get({
      _id: id
    })
    ctx.body = yapi.commons.resReturn(result);
  }

  async saveCase(ctx){
    let params = ctx.request.body;
    if(!params.interface_id){
      return ctx.body =yapi.commons.resReturn(null, 408, '缺少interface_id');
    }
    if(!params.project_id){
      return ctx.body =yapi.commons.resReturn(null, 408, '缺少project_id');
    }
    let data = {
      interface_id: params.interface_id,      
      project_id: params.project_id,
      ip_enable: params.ip_enable,
      name: params.name,
      params: params.params || [],
      uid: this.getUid(),
      code: params.code || 200,
      deplay: +params.deplay || 0,
      headers: params.headers || [],
      up_time: yapi.commons.time(),
      res_body: params.res_body || '',
      ip: params.ip
    }

    let result;
    if(params.id && !isNan(params.id)){
      data.id = +params.id;
      result = await this.caseModel.up(data);
    }else{
      result = await this.caseModel.save(data);
    }
    return ctx.body = yapi.commons.resReturn(result);    
  }

  async delCase(ctx){
    let id = ctx.request.body.id;
    if(!id){
      return ctx.body =yapi.commons.resReturn(null, 408, '缺少 id');
    }
    ctx.body = await this.caseModel.del(id);
  }


}

module.exports = advMockController;