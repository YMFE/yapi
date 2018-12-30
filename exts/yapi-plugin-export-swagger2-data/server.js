const exportSwaggerController = require('./controller');

module.exports = function(){
    this.bindHook('add_router', function(addRouter){
        addRouter({
            controller: exportSwaggerController,
            method: 'get',
            path: 'exportSwagger',
            action: 'exportData'
        })
    })
}