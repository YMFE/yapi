const controller = require('./controller');

// const mongoose = require('mongoose');
// const _ = require('underscore');

module.exports = function(){
  this.bindHook('add_router', function(addRouter){
    addRouter({
      controller: controller,
      method: 'get',
      path: 'export',
      action: 'exportData'
    });
    // @feat: serives 
    addRouter({
      controller: controller,
      method: 'get',
      prefix: '/open',
      path: 'export-full',
      action: 'exportFullData'
    });
  })

}