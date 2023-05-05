const controller = require('./controller')

// const mongoose = require('mongoose');
// const _ = require('underscore');

module.exports = function() {
  this.bindHook('add_router', function(addRouter) {
    addRouter({
      controller: controller,
      method: 'post',
      path: 'export',
      action: 'exportData',
    })
  })
}
