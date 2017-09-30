const defaultPluginConfig = {
  server: true,
  client: true,
  enable: true
}

function getPluginConfig(name){
  let pluginConfig = require('yapi-plugin-' + item);
  if(!pluginConfig || typeof pluginConfig !== 'object'){
    throw new Error(`Plugin ${name} 配置有误，请检查node_modules/yapi-plugin-${name}/index.js`);
  }
  return Object.assign({}, defaultPluginConfig, pluginConfig);
}

module.exports = {
  initPlugins: function (plugins) {
    if (!plugins) {
      return [];
    }
    if (typeof plugins !== 'object' || !Array.isArray(plugins)) {
      throw new Error('插件配置有误，请检查', plugins);
    }

    return plugins.map(item => {
      let pluginConfig;
      if (item && typeof item === 'string') {
        pluginConfig = getPluginConfig(item);
        return Object.assign({}, defaultPluginConfig, pluginConfig, {name: item})
      } else if (item && typeof item === 'object') {
        pluginConfig = getPluginConfig(item.name);
        return Object.assign({}, defaultPluginConfig, pluginConfig, {name: item.name, options: item.options})
      }
    })
  }
}