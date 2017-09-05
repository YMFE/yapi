const yapi = require('./yapi.js');
const plugin_path = yapi.path.join(yapi.WEBROOT, 'plugins')

module.exports = function(){
  if(yapi.WEBCONFIG.plugins && Array.isArray(yapi.WEBCONFIG.plugins)){
    yapi.WEBCONFIG.plugins.forEach(plugin=>{
      let pluginModule = require(yapi.path.join(plugin_path, 'qsso/server.js'));
      pluginModule.call(yapi)
    })
  }
}