const baseController = require('controllers/base.js');
const advModel = require('./model.js');
const yapi = require('yapi.js');

class advMockController extends baseController{
  constructor(ctx){
    super(ctx);
    this.Model = yapi.getInst(advModel);
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
}

module.exports = advMockController;