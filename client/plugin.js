const config = process.env.config;
let hooks, pluginModule, systemPlugins;

/**
 * type component  组件
 *      listener   监听函数
 * mulit 是否绑定多个监听函数
 *      
 */

hooks = {
  'third_login': {
    type: 'component',
    mulit: false,
    listener: null
  },
  'add_interface': {
    type: 'listener',
    mulit: true,
    listener: []
  },
  import_data: {
    type: 'listener',
    mulit: true,
    listener: []
  }
};

pluginModule = {
  hooks: hooks,
  bindHook: bindHook,
  emitHook: emitHook
}

systemPlugins = ['import-postman']

config.plugins = config.plugins && Array.isArray(config.plugins) ? config.plugins: [];

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

function emitHook(name, ...args){
  if(!hooks[name]) throw new Error('不存在的hook name');
  let hook = hooks[name];
  if(hook.mulit === true && hook.type === 'listener'){
    if(Array.isArray(hook.listener)){
      hook.listener.forEach(item=>{
        if(typeof item === 'function'){
          item.call(pluginModule, ...args)
        }
      })
    }
  }else if(hook.mulit === false && hook.type === 'listener'){
    if(typeof hook.listener === 'function'){
      hook.listener.call(pluginModule, ...args);
    }
  }else if( hook.type === 'component'){
    return hook.listener;
  }
  
}


if (config.plugins && Array.isArray(config.plugins)) {
  config.plugins.forEach(plugin => {
    let p = require(`plugins/yapi-plugin-${plugin}/client.js`);
    p.call(pluginModule) ;
  })
}

systemPlugins.forEach(plugin => {
  let p = require(`exts/yapi-plugin-${plugin}/client.js`);
  p.call(pluginModule) ;
})

module.exports = pluginModule;