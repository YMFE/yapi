const controller = require('./importController.js');

module.exports = function () {

  this.bindHook('add_router', function (addRouter) {
    addRouter({
      controller: controller,
      method: 'post',
      path: 'customizeSwagger/updateData',
      action: 'updateData'
    });
  });
};