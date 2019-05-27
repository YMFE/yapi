const controller = require('./controller/syncController.js');
const yapi =require('yapi.js');
const interfaceSyncUtils = require('./interfaceSyncUtils.js');

module.exports = function () {
  //初始化所有定时任务
  yapi.getInst(interfaceSyncUtils);

  this.bindHook('add_router', function (addRouter) {
    addRouter({
      controller: controller,
      method: 'get',
      path: 'autoSync/get',
      action: 'getSync'
    });
    addRouter({
      controller: controller,
      method: 'post',
      path: 'autoSync/save',
      action: 'upSync'
    });
    addRouter({
      controller: controller,
      method: 'get',
      path: 'autoSync/forceSync',
      action: 'forceSync'
    });
  });

};