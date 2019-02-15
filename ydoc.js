module.exports = {
  "title": "YApi 接口管理平台",
  "keywords": "api管理,接口管理,接口文档,api文档",
  "author": "ymfe",
  "description": "YApi 是高效、易用、功能强大的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi 还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理",
  "plugins": ["search", "img-view"],
  "dist": "static/doc",
  "pluginsConfig": {
    "import-asset": {
      "css": "web.css"
    } 
  },
  version: require('./package.json').version,
  markdownIt: function(md){
    md.use(require('markdown-it-include'), __dirname)
  }
}
