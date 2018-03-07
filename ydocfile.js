module.exports = {
    "name": "YApi",
    "dest": "static/doc",
    "examplePath": "./doc/exampleCode",
    "defaultGrammar": "json",
    "instructionsInfoPath": "", //使用说明 内容路径 (需要配合JS-Component注释的@instructions使用)
    "instructionsUrlPath": "", //使用说明demo路径 (需要配合JS-Component注释的@instructions使用)
    "common": { // 通用默认配置，包括主页配置等
        "title": "YApi 接口管理平台", //page title
        "footer": "&copy; 2018 <a href=\"https://ymfe.org\">YMFE</a> Team. Build by <a href=\"http://ued.qunar.com/ydoc/\">ydoc</a>&nbsp;", // 通用尾
        "home": '<img src="./images/logo_header@2x.png" /> &nbsp;YAPI', 
        "homeUrl": "./index.html", 
        "keywords": "api管理,接口管理,接口文档,api文档",
        "description": "YApi 是高效、易用、功能强大的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi 还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。"
    },
    "options": {
        "foldcode": false,
        "markdown": { // 对于 markdown 编译器进行统一配置
            "menuLevel": 2 //选取第几级 head 作为目录，默认 -1 没有目录
        }
    },
    "pages": [
        {
            "name": "index", // Page Name 会根据他生成 html 文件，例: index.html
            "title": "", // Page Title
            "homepage": { // 配置首页，样式区别于其他页面
                "version": "v" + require('./package.json').version, // 版本信息将显示在banner底部
                "button": [{ // 按钮组将显示在banner底部
                    "name": "产品演示",
                    "href": "http://yapi.demo.qunar.com"
                },{
                    "name": "Github",
                    "href": "https://github.com/YMFE/yapi"
                }],
                "intro": [{ // 首页的正文部分，数组项依次渲染，可重复使用
                    "title": "为 API 开发者设计的管理平台", // 介绍板块标题
                    "desc": "YApi 让接口开发更简单高效，让接口的管理更具可读性、可维护性，让团队协作更合理。" // 介绍板块描述
                },{
                    "title": "",
                    "detail": {
                        "type": "thumbnail", // 三列布局的介绍板块
                        "content": [{ // 三列布局的内容，每项的key值非必需，但建议每列的key值一致
                            "name": "项目管理", // 板块名称
                            "src": "./images/intro_page_1.png", // 缩略图
                            "desc": "YApi 成熟的团队管理<br>扁平化项目权限配置满足各类企业的需求" // 描述
                        },{
                            "name": "接口管理",
                            "src": "./images/intro_page_2.png",
                            "desc": "友好的接口文档<br>基于 websocket 的多人协作接口编辑功能和类 postman 测试工具，让多人协作成倍提升开发效率"
                        },{
                            "name": "MockServer",
                            "src": "./images/intro_page_3.png",
                            "desc": "基于 Mockjs<br>使用简单功能强大"
                        }]
                    }
                }]
            },
            "banner": {
                "title": `<div class="logo">
                <svg class="svg" width="72px" height="72px" viewBox="0 0 64 64" version="1.1">
                <title>Icon</title><desc>Created with Sketch.</desc>
                <defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
                <stop stop-color="#FFFFFF" offset="0%"></stop><stop stop-color="#F2F2F2" offset="100%"></stop></linearGradient>
                <circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle>
                <filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3">
                <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="大屏幕">
                <g id="Icon"><circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle><path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fill-rule="nonzero"></path><path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fill-rule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path><path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fill-rule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path><g id="inner-round"><use fill="black" fill-opacity="1" filter="url(#filter-3)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use><use fill="#F7F7F7" fill-rule="evenodd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use></g></g></g></g></svg>
                <span class="name"> YApi</span></div>`,
                "description": "高效、易用、功能强大的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。"
            },
            "content": "./doc/home.md"
        }, {
        "name": "usage",
        "title": "使用手册",
        "banner": {
            "title": "YApi",
            "description": "高效、易用、功能强大的api管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。"
        },
        "content": {
            "sidebar": true,
            "multi": true,
            "index": "./doc/page/usage/getfamiliar.md",
            "pages": [{
                "name": "认识 YApi",
                "index": "getfamiliar",
                "content": "./doc/page/usage/getfamiliar.md"
            },{
                "name": "创建第一个API",
                "index": "quickstart",
                "content": "./doc/page/usage/quickstart.md"
            },{
                "name": "管理分组与项目",
                "index": "manage",
                "content": "./doc/page/usage/manage.md"
            },{
                "name": "项目操作",
                "index": "project",
                "content": "./doc/page/usage/project.md"
            },{
                "name": "接口操作",
                "index": "interface",
                "content": "./doc/page/usage/api.md"
            },{
                "name": "普通 Mock",
                "index": "mock",
                "content": "./doc/page/usage/mock.md"
            },{
                "name": "高级 Mock",
                "index": "adv_mock",
                "content": "./doc/page/usage/adv_mock.md"
            },{
                "name": "使用测试集",
                "index": "case",
                "content": "./doc/page/usage/case.md"
            },{
                "name": "数据导入",
                "index": "data",
                "content": "./doc/page/usage/data.md"
            }
        ]
        }
    },
//   {
//       "name": "manage",
//       "title": "管理学院",
//       "banner": {
//           "title": "管理学院",
//           "description": "超级管理员、分组/项目组长的学院。"
//       },
//       "content": {
//           "sidebar": true,
//           "multi": true,
//           "index": "./doc/page/manage/intro.md",
//           "pages": [{
//               "name": "介绍",
//               "content": "./doc/page/manage/intro.md"
//           }, {
//               "name": "部署",
//               "content": "./doc/page/manage/build.md"
//           }, {
//               "name": "超管职责",
//               "content": "./doc/page/manage/admin.md"
//           }, {
//               "name": "版本升级",
//               "content": "./doc/page/manage/update.md"
//           }]
//       }
//   },
    {
    "name": "devops",
    "title": "内网部署",
    "banner": {
        "title": "内网部署",
        "description": "部署 YApi 平台是非常容易的，即便您不懂 nodejs 或者 mongodb"
    },
    "compile": "markdown",
    "menuLevel": 2,
    "content": "./doc/page/manage/build.md"
  },
    {
      "name": "plugin",
      "title": "插件 Wiki",
      "banner": {
          "title": "插件",
          "description": "可根据业务需求，定制化功能"
      },
      "content": {
          "sidebar": true,
          "multi": true,
          "index": "./doc/page/plugin/redev.md",
          "pages": [{
            "name": "二次开发",
            "index": "redev",
            "content": "./doc/page/plugin/redev.md"
        },{
              "name": "插件管理",
              "index": "plugin-index",
              "content": "./doc/page/plugin/index.md"
          },{
            "name": "插件开发",
            "index": "plugin-dev",
            "content": "./doc/page/plugin/dev.md"
        },{
            "name": "钩子列表",
            "index": "plugin-hooks",
            "content": "./doc/page/plugin/hooks.md"
        },{
            "name": "插件列表",
            "index": "plugin-list",
            "content": "./doc/page/plugin/list.md"
        }
        ]
      }
  },
  {
    "name": "qa",
    "title": "常见问题",
    "banner": {
        "title": "常见问题",
        "description": "这里列举了常见的问题"
    },
    "compile": "markdown",
    "menuLevel": 2,
    "content": "./doc/page/usage/qa.md"
  },
  {
    "name": "releases",
    "title": "版本记录",
    "banner": {
        "title": "YApi",
        "description": "这里列举了 YApi 的历史版本、发布时间及变更记录，帮助你追溯到每个版本的演进过程。"
    },
    "compile": "markdown",
    "menuLevel": 2,
    "content": "./CHANGELOG.md"
  },{
    "name": "产品演示",
    "title": "产品演示",
    "url": "http://yapi.demo.qunar.com/"
  },
    {
        "name": "api",
        "title": "",
        "banner": {
            "title": "api",
            "description": "api文档"
        },
        "content": "./server/controllers/+(follow|base|group|interface|interfaceCol|log|project|user).js",
        "options": {
            "type": "interface",
            "source": true,
            "categories":["group","user","project", "interface","follow"]
        }
    }],
    "resources": {
        "images": "./doc/images",
        "styles": "./doc/styles"
    }
}
