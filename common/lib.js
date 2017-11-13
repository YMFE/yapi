const _ =require('underscore');

function getPluginConfig(name, type) {
  let pluginConfig;
  if(type === 'ext'){
    pluginConfig = require('../exts/yapi-plugin-' + name);
  }else {
    pluginConfig = require('../node_modules/yapi-plugin-' + name);
  }
  
  if(!pluginConfig || typeof pluginConfig !== 'object'){
    throw new Error(`Plugin ${name} Config 配置错误，请检查 yapi-plugin-${name}/index.js`);
  }

  return {
    server: pluginConfig.server,
    client: pluginConfig.client 
  }
}

function isObj(object) {  
  return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";  
}  

function isArray(object) {  
  return object && typeof (object) == 'object' && object.constructor == Array;  
}  

function getLength(object) {  
  return Object.keys(object).length; 
}  

function Compare(objA, objB) {  
  if (!isObj(objA) && !isObj(objB)){
    return objA == objB;
  }
  if (!isObj(objA) || !isObj(objB)) return false;   
  if (getLength(objA) != getLength(objB)) return false;   
  return CompareObj(objA, objB, true);  
}  

function CompareObj(objA, objB, flag) {  
  for (var key in objA) {  
      if (!flag)   
          break;  
      if (!objB.hasOwnProperty(key)) { flag = false; break; }  
      if (!isArray(objA[key])) {   
          if (objB[key] != objA[key]) { flag = false; break; }  
      } else {  
          if (!isArray(objB[key])) { flag = false; break; }  
          var oA = objA[key], oB = objB[key];  
          if (oA.length != oB.length) { flag = false; break; }  
          for (var k in oA) {  
              if (!flag)   
                  break;  
              flag = CompareObj(oA[k], oB[k], flag);  
          }  
      }  
  }  
  return flag;  
}  

/**
   * type @string enum[plugin, ext] plugin是外部插件，ext是内部插件
   */
exports.initPlugins = function (plugins, type) {
  if (!plugins) {
    return [];
  }
  if (typeof plugins !== 'object' || !Array.isArray(plugins)) {
    throw new Error('插件配置有误，请检查', plugins);
  }

  plugins =  plugins.map(item => {
    let pluginConfig;
    if (item && typeof item === 'string') {
      pluginConfig = getPluginConfig(item, type);
      return Object.assign({}, pluginConfig, { name: item, enable: true })
    } else if (item && typeof item === 'object') {
      pluginConfig = getPluginConfig(item.name, type);
      return Object.assign({},
        pluginConfig,
        {
          name: item.name,
          options: item.options,
          enable: item.enable === false ? false : true
        })
    }
  })
  plugins =  plugins.filter(item=>{
    return item.enable === true && (item.server || item.client)
  })

  return _.uniq(plugins, item=>item.name)
}
exports.jsonEqual = Compare;

exports.isDeepMatch = function(obj, properties){
  if(!properties || typeof properties !== 'object' || Object.keys(properties).length === 0){
    return true;
  }

  if(!obj || typeof obj !== 'object' || Object.keys(obj).length === 0){
    return false;
  }

  let match = true;
  for(var i in properties){
    if(!Compare(obj[i], properties[i])){
      match = false;
      break;
    }
  }
  return match;
}