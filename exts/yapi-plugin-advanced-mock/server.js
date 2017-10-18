const controller = require('./controller');
const advModel = require('./model.js');
const yapi = require('yapi.js');
const mongoose = require('mongoose');


module.exports = function(){
  yapi.connect.then(function () {
    let Col = mongoose.connection.db.collection('adv_mock')
    Col.createIndex({
        interface_id: 1        
    })
    Col.createIndex({
      project_id: 1
    })
  })
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
      header: context.ctx.header,
      query: context.ctx.query,
      body: context.ctx.request.body,
      mockJson: context.mockJson
    }
    sandbox.cookie = {};
    
    context.ctx.header.cookie && context.ctx.header.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        sandbox.cookie[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    sandbox = yapi.commons.sandbox(sandbox, script);
    context.mockJson = sandbox.mockJson;
  })
}