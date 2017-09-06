const yapi = require('./yapi.js');
const plugin_path = yapi.path.join(yapi.WEBROOT, 'plugins')
var hooks = {
  'third_login': {
      type: 'single',
      listener: null
  },
  'add_interface': {
      type: 'mulit',
      listener: []
  }
};

function bindHook(name, listener){
  if(!name) throw new Error('缺少hookname');
  if(name in hooks === false){
      throw new Error('不存在的hookname');
  }
  if(hooks[name].type === 'multi'){
       hooks[name].listener.push(listener);
  }else{
      hooks[name].listener = listener;
  }
  
}

function emitHook(name){
  if(!name) throw new Error('缺少hookname');
  if(name in hooks === false){
      throw new Error('不存在的hookname');
  }
  
  if(hooks[name] && typeof hooks[name] === 'object'){
      if(hooks[name].type === 'single' && typeof hooks[name].listener === 'function'){
          return hooks[name].listener.apply(yapi, Array.prototype.slice.call(arguments, 1));
      }
      if(Array.isArray(hooks[name.listener])){
          hooks[name].listener.forEach(listener=>{
              listener.apply(yapi, Array.prototype.slice.call(arguments,1))
          })
      }
  }
}

yapi.bindHook = bindHook;
yapi.emitHook = emitHook;


module.exports = function(){
  if(yapi.WEBCONFIG.plugins && Array.isArray(yapi.WEBCONFIG.plugins)){
    yapi.WEBCONFIG.plugins.forEach(plugin=>{
      if(!yapi.commons.fileExist(yapi.path.join(plugin_path, 'yapi-plugin-' + plugin + '/server.js'))){
        throw new Error(`config.json配置了插件${plugin},但plugins目录没有找到此插件，请安装此插件?`);
        process.exit();
      }
      let pluginModule = require(yapi.path.join(plugin_path, 'yapi-plugin-' + plugin + '/server.js'));
      pluginModule.apply(yapi)
    })
  }
}