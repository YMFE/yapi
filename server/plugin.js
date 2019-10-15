const yapi = require('./yapi.js');
const plugin_path = yapi.path.join(yapi.WEBROOT, 'node_modules');
const plugin_system_path = yapi.path.join(yapi.WEBROOT, 'exts');
const initPlugins = require('../common/plugin.js').initPlugins;
var extConfig = require('../common/config.js').exts;

/**
 * 钩子配置
 */
var hooks = {
  /**
   * 第三方sso登录钩子，暂只支持设置一个
   * @param ctx
   * @return 必需返回一个 promise 对象，resolve({username: '', email: ''})
   */
  third_login: {
    type: 'single',
    listener: null
  },
  /**
   * 客户端增加接口成功后触发
   * @param data 接口的详细信息
   */
  interface_add: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端删除接口成功后触发
   * @param data 接口id
   */
  interface_del: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端更新接口成功后触发
   * @param id 接口id
   */
  interface_update: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端获取接口数据列表
   * @param list 返回接口的数据列表
   */
  interface_list: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端获取一条接口信息触发
   * @param data 接口的详细信息
   */
  interface_get: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端增加一个新项目
   * @param id 项目id
   */
  project_add: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端更新一个新项目
   * @param id 项目id
   */
  project_up: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端获取一个项目
   * @param id 项目id
   */
  project_get: {
    type: 'multi',
    listener: []
  },
  /**
   * 客户端删除删除一个项目
   * @param id 项目id
   */
  project_del: {
    type: 'multi',
    listener: []
  },
  /**
     * 导出 markdown 数据
     * @param context Object
     * {
     *  projectData: project,
        interfaceData: interfaceData,
        ctx: ctx,
        mockJson: res 
     * }
     * 
     */
  export_markdown: {
    type: 'multi',
    listener: []
  },
  /**
     * MockServer生成mock数据后触发
     * @param context Object
     * {
     *  projectData: project,
        interfaceData: interfaceData,
        ctx: ctx,
        mockJson: res 
     * }
     * 
     */
  mock_after: {
    type: 'multi',
    listener: []
  },
  /**
   * 增加路由的钩子
   * type Sync
   * @param addPluginRouter Function
   * @info
   * addPLuginPLugin(config)
   *
   * config = {
   *  path,      // String 路由名称
   *  method,    // String 请求方法 get post ...
   *  controller // Class 继承baseController的class
   *  action     // String controller的Action
   * }
   *
   * 示例：
   * config = {
   *  path:  "export/pdf",
   *  method: "get",
   *  controller: controller,
   *  action: "exportPdf"
   * }
   */
  add_router: {
    type: 'multi',
    listener: []
  },
  /**
   * 增加websocket路由的钩子
   * type Sync
   * @param addPluginRouter Function
   * @info
   * addPLuginPLugin(config)
   *
   * config = {
   *  path,      // String 路由名称
   *  method,    // String 请求方法 get post ...
   *  controller // Class 继承baseController的class
   *  action     // String controller的Action
   * }
   *
   * 示例：
   * config = {
   *  path:  "export/pdf",
   *  method: "get",
   *  controller: controller,
   *  action: "exportPdf"
   * }
   */
  add_ws_router: {
    type: 'multi',
    listener: []
  },

  import_data: {
    type: 'multi',
    listener: []
  },

  /**
   * addNoticePlugin(config)
   * 
   * config.weixin = {
   *    title: 'wechat',
   *    hander: (emails, title, content)=> {...}
   * }
   */
  addNotice:{
    type: 'multi',
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
    if (typeof hooks[name].listener === 'function') {
      throw new Error('重复绑定singleHook(' + name + '), 请检查');
    }
    hooks[name].listener = listener;
  }
}

/**
 *
 * @param {*} hookname
 * @return promise
 */
function emitHook(name) {
  if (hooks[name] && typeof hooks[name] === 'object') {
    let args = Array.prototype.slice.call(arguments, 1);
    if (hooks[name].type === 'single' && typeof hooks[name].listener === 'function') {
      return Promise.resolve(hooks[name].listener.apply(yapi, args));
    }
    let promiseAll = [];
    if (Array.isArray(hooks[name].listener)) {
      let listenerList = hooks[name].listener;
      for (let i = 0, l = listenerList.length; i < l; i++) {
        promiseAll.push(Promise.resolve(listenerList[i].apply(yapi, args)));
      }
    }
    return Promise.all(promiseAll);
  }
}

yapi.bindHook = bindHook;
yapi.emitHook = emitHook;
yapi.emitHookSync = emitHook;

let pluginsConfig = initPlugins(yapi.WEBCONFIG.plugins, 'plugin');
pluginsConfig.forEach(plugin => {
  if (!plugin || plugin.enable === false || plugin.server === false) return null;

  if (
    !yapi.commons.fileExist(
      yapi.path.join(plugin_path, 'yapi-plugin-' + plugin.name + '/server.js')
    )
  ) {
    throw new Error(`config.json配置了插件${plugin},但plugins目录没有找到此插件，请安装此插件`);
  }
  let pluginModule = require(yapi.path.join(
    plugin_path,
    'yapi-plugin-' + plugin.name + '/server.js'
  ));
  pluginModule.call(yapi, plugin.options);
});

extConfig = initPlugins(extConfig, 'ext');

extConfig.forEach(plugin => {
  if (!plugin || plugin.enable === false || plugin.server === false) return null;

  if (
    !yapi.commons.fileExist(
      yapi.path.join(plugin_system_path, 'yapi-plugin-' + plugin.name + '/server.js')
    )
  ) {
    throw new Error(`config.json配置了插件${plugin},但plugins目录没有找到此插件，请安装此插件`);
  }
  let pluginModule = require(yapi.path.join(
    plugin_system_path,
    'yapi-plugin-' + plugin.name + '/server.js'
  ));
  pluginModule.call(yapi, plugin.options);
});

//delete bindHook方法，避免误操作
delete yapi.bindHook;
