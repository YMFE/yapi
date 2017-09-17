let initPlugins = require('common/lib.js').initPlugins;
const config = process.env.config;
let hooks, pluginModule, systemPlugins;

/**
 * type component  组件
 *      listener   监听函数
 * mulit 是否绑定多个监听函数
 *      
 */

hooks = {
  third_login: {
    type: 'component',
    mulit: false,
    listener: null
  },
  add_interface: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  import_data: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  interface_tab: {
    type: 'listener',
    mulit: true,
    listener: []
  }
};


//初始化配置
systemPlugins = require('common/config.js').exts;
systemPlugins = initPlugins(systemPlugins);

config.plugins = config.plugins && Array.isArray(config.plugins) ? config.plugins : [];
config.plugins = initPlugins(config.plugins);

function bindHook(name, listener) {
  if (!name) throw new Error('缺少hookname');
  if (name in hooks === false) {
    throw new Error('不存在的hookname');
  }
  if (hooks[name].mulit === true) {
    hooks[name].listener.push(listener);
  } else {
    hooks[name].listener = listener;
  }

}

function emitHook(name, ...args) {
  if (!hooks[name]) throw new Error('不存在的hook name');
  let hook = hooks[name];
  if (hook.mulit === true && hook.type === 'listener') {
    if (Array.isArray(hook.listener)) {
      hook.listener.forEach(item => {
        if (typeof item === 'function') {
          item.call(pluginModule, ...args)
        }
      })
    }
  } else if (hook.mulit === false && hook.type === 'listener') {
    if (typeof hook.listener === 'function') {
      hook.listener.call(pluginModule, ...args);
    }
  } else if (hook.type === 'component') {
    return hook.listener;
  }

}

pluginModule = {
  hooks: hooks,
  bindHook: bindHook,
  emitHook: emitHook
}

config.plugins.forEach(plugin => {
  if (!plugin) return null;
  if (!plugin.enable) return null;
  if (plugin.client) {
    let p = require(`plugins/yapi-plugin-${plugin.name}/client.js`);
    p.call(pluginModule, plugin);
  }

})


systemPlugins.forEach(plugin => {
  if (!plugin) return null;
  if (!plugin.enable) return null;
  if (plugin.client) {
    let p = require(`exts/yapi-plugin-${plugin.name}/client.js`);
    p.call(pluginModule, plugin);
  }
  
})

module.exports = pluginModule;