const controller = require('./server/controller');
const caseModel = require('./server/caseModel.js');
const yapi = require('yapi.js');
const mongoose = require('mongoose');


module.exports = function(){
  yapi.connect.then(function () {
    let Col = mongoose.connection.db.collection('mock_collections');
    Col.ensureIndex({
      project_id: 1,
      interface_id: 1,
      ip: 1
    })

  })
  this.bindHook('add_router', function(addRouter){
    addRouter({
      /**
       * 获取 mock 集列表
       */
      controller: controller,
      method: 'get',
      path: 'mock-col/list',
      action: 'getMock'
    })
    addRouter({
      /**
       * 添加 mock 集
       */
      controller: controller,
      method: 'post',
      path: 'mock-col/save',
      action: 'saveCol'
    })
    addRouter({
      /**
       * 保存期望
       */
      controller: controller,
      method: 'post',
      path: 'mock-case/save',
      action: 'saveCase'
    })

    addRouter({
      /**
       * 获取期望列表
       */
      controller: controller,
      method: 'get',
      path: 'mock-case/list',
      action: 'caseList'
    })


  })
  this.bindHook('interface_del', async function(id){
    let inst = yapi.getInst(caseModel);
    await inst.delByInterfaceId(id);
  })
  this.bindHook('project_del', async function(id){
    let inst = yapi.getInst(caseModel);
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
    let inst = yapi.getInst(caseModel);
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