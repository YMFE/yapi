const config = process.env.config;

/**
 * type single  只绑定一个监听函数,会返回处理结果
 *      mulit   绑定多个监听函数
 *      
 */

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

function bindHook(name, listener) {
  if (!name) throw new Error('缺少hookname');
  if (name in hooks === false) {
    throw new Error('不存在的hookname');
  }
  if (hooks[name].type === 'multi') {
    hooks[name].listener.push(listener);
  } else {
    hooks[name].listener = listener;
  }

}

var yapi = {
  hooks: hooks,
  bindHook: bindHook
}

if (config.plugins && Array.isArray(config.plugins)) {
  config.plugins.forEach(plugin => {
    let pluginModule = require(`plugins/yapi-plugin-${plugin}/client.js`);
    pluginModule.call(yapi) ;
  })
}

module.exports = hooks;