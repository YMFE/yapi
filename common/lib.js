const defaultPluginConfig = {
  name: null,
  server: true,
  client: true,
  enable: true
}

module.exports = {
  initPlugins: function (plugins) {
    if (!plugins) {
      return [];
    }
    if (typeof plugins !== 'object' || !Array.isArray(plugins)) {
      console.error('插件配置有误，请检查', plugins);
      return [];
    }

    return plugins.map(item => {
      if (item && typeof item === 'string') {
        return Object.assign({}, defaultPluginConfig, { name: item })
      } else if (item && typeof item === 'object') {
        return Object.assign({}, defaultPluginConfig, item)
      }
    })
  }
}