## 后端 hookList

目前 hooksList 只有下面列出的部分，如果您有其他的需求，可提建议到 github 或者 qq 群

```
/**
 * 钩子配置
 */
var hooks = {
    /**
     * 第三方sso登录钩子，暂只支持设置一个
     * @param ctx
     * @return 必需返回一个 promise 对象，resolve({username: '', email: ''})
     */
    'third_login': {
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
    'project_add':{
        type: 'multi',
        listener: []
    },
    /**
     * 客户端删除删除一个项目
     * @param id 项目id
     */
    'project_del':{
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
     * addPLuginPLugin(config)
     * config = {
     *  path,      // String
     *  method,    // String
     *  controller // Class 继承baseController的class
     *  action     // String controller的Action
     * }
     */
    add_router: {
        type: 'multi',
        listener: []
    }
};
```

## 前端 hookList

```
/**
 * type component  组件
 *      listener   监听函数
 * mulit 是否绑定多个监听函数
 *
 */

hooks = {
  /**
   * 第三方登录 //可参考 yapi-plugin-qsso 插件
   */
  third_login: {
    type: 'component',
    mulit: false,
    listener: null
  },
  /**
   * 导入数据
   * @param Object importDataModule
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-import-swagger插件
   * importDataModule = {};
   *
   */
  import_data: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 导出数据
   * @param Object exportDataModule
   * @param projectId
   * @info
   * exportDataModule = {};
   * exportDataModule.pdf = {
   *   name: 'Pdf',
   *   route: '/api/plugin/export/pdf',
   *   desc: '导出项目接口文档为 pdf 文件'
   * }
   */
  export_data: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * 接口页面 tab 钩子
   * @param InterfaceTabs
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-advanced-mock
   * let InterfaceTabs = {
      view: {
        component: View,
        name: '预览'
      },
      edit: {
        component: Edit,
        name: '编辑'
      },
      run: {
        component: Run,
        name: '运行'
      }
    }
   */
  interface_tab: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * header下拉菜单 menu 钩子
   * @param HeaderMenu
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-statistics
   * let HeaderMenu = {
  user: {
    path: '/user/profile',
    name: '个人中心',
    icon: 'user',
    adminFlag: false
  },
  star: {
    path: '/follow',
    name: '我的关注',
    icon: 'star-o',
    adminFlag: false
  },
  solution: {
    path: '/user/list',
    name: '用户管理',
    icon: 'solution',
    adminFlag: true

  },
  logout: {
    path: '',
    name: '退出',
    icon: 'logout',
    adminFlag: false

  }
};
   */
  header_menu: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /**
   * Route路由列表钩子
   * @param AppRoute
   *
   * @info
   * 可参考 vendors/exts/yapi-plugin-statistics
   * 添加位置在Application.js 中
   * let AppRoute = {
  home: {
    path: '/',
    component: Home
  },
  group: {
    path: '/group',
    component: Group
  },
  project: {
    path: '/project/:id',
    component: Project
  },
  user: {
    path: '/user',
    component: User
  },
  follow: {
    path: '/follow',
    component: Follows
  },
  addProject: {
    path: '/add-project',
    component: AddProject
  },
  login: {
    path: '/login',
    component: Login
  }
};
};
   */
  app_route: {
    type: 'listener',
    mulit: true,
    listener: []
  },
  /*
   * 添加 reducer
   * @param Object reducerModules
   *
   * @info
   * importDataModule = {};
   *
   */

  add_reducer: {
    type: 'listener',
    mulit: true,
    listener: []
  }
};
```
