const exportSwaggerController = require('./controller')

module.exports = function() {
  this.bindHook('add_router', function(addRouter) {
    addRouter({
      controller: exportSwaggerController,
      method: 'post',
      path: 'exportSwagger',
      action: 'exportData',
    })
  })
}
