const controller = require('./controller');
const advModel = require('./model.js');
const yapi = require('yapi.js');


module.exports = function(){
  
  this.bindHook('add_router', function(addRouter){
    addRouter({
      controller: controller,
      method: 'get',
      path: 'advmock/get',
      action: 'getMock'
    })
    addRouter({
      controller: controller,
      method: 'post',
      path: 'advmock/save',
      action: 'upMock'
    })
  })
  this.bindHook('interface_del', async function(id){
    let inst = yapi.getInst(advModel);
    await inst.delByInterfaceId(id);
  })
  this.bindHook('project_del', async function(id){
    let inst = yapi.getInst(advModel);
    await inst.delByProjectId(id);
  })
  /**
   * let context = {
      projectData: project,
      interfaceData: interfaceData,
      ctx: ctx,
      mockJson: res 
    } 
   */
  this.bindHook('mock_after', async function(context){
    let interfaceId = context.interfaceData._id;
    let inst = yapi.getInst(advModel);
    let data = await inst.get(interfaceId);
    if(!data || !data.enable || !data.mock_script){
      return context;
    }
    let script = data.mock_script;
    let sandbox = {
      query: context.ctx.query,
      body: context.ctx.request.body,
      mockJson: context.mockJson
    }
    sandbox = yapi.commons.sandbox(sandbox, script);
    context.mockJson = sandbox.mockJson;
    console.log(11111, context.mockJson)
  })
}