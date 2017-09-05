const config = process.env.config;

var hooks = {
  'third_login': {
    type: 'single',
    component: null
  },
  'add_interface': {
    type: 'mulit',
    component: []
  }
};

function bindHook(name, component) {
  if (!name) throw new Error('缺少hookname');
  if (name in hooks === false) {
    throw new Error('不存在的hookname');
  }
  if (hooks[name].type === 'multi') {
    hooks[name].component.push(component);
  } else {
    hooks[name].component = component;
  }

}

if (config.plugins && Array.isArray(config.plugins)) {
  config.plugins.forEach(plugin => {
    let pluginModule = require(`/Users/sean/qunar/yapi/yapi/node_modules/yapi-plugin-${plugin}/client.js`);
    pluginModule(bindHook);
  })
}

module.exports = hooks;