const _ = require('underscore');

function getPluginConfig(name, type) {
  let pluginConfig;
  if (type === 'ext') {
    pluginConfig = require('../exts/yapi-plugin-' + name);
  } else {
    pluginConfig = require('yapi-plugin-' + name);
  }

  if (!pluginConfig || typeof pluginConfig !== 'object') {
    throw new Error(`Plugin ${name} Config 配置错误，请检查 yapi-plugin-${name}/index.js`);
  }

  return {
    server: pluginConfig.server,
    client: pluginConfig.client
  }
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

  plugins = plugins.map(item => {
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
  plugins = plugins.filter(item => {
    return item.enable === true && (item.server || item.client)
  })

  return _.uniq(plugins, item => item.name)
}