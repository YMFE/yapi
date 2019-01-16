## 运行开发服务器
```bash
npm install
npm install -g ykit #依赖 ykit 
npm run dev #启动开发服务器
```

## 加载插件
在config.json plugins配置项，加入 demo 插件,
```json
{
  "port": "3000",
  "db": {
    "servername": "127.0.0.1",
    "DATABASE": "yapi"
  },
  ...
  "plugins": [{
    "name": "demo"，
    "options": {}
  }]
}
```

## 初始化目录

可参考 项目vendors/exts 目录下的插件

在 vendors/node_modules 下新建 yapi-plugin-demo 目录和 npm init,最后生成的目录接口如下
```
yapi-plugin-demo
  client.js  //客户端入口文件
  server.js  //服务端入口文件
  packjson.json //插件依赖管理
  index.js //插件配置文件
```

## index.js 配置说明
```
server: true // 如果为true,表名该插件需要经过后端服务器加载
client: true // 如果为true,表名该插件需要经过前端编译
```

## server.js 
在server.js 需要导出一个 function ,例如： module.exports = function(options){}

options 可在 config.json 配置
### 绑定钩子
```
this.bindHook(hookname, listener) //绑定钩子
hookname //钩子名
listener //监听函数，可以是普通函数，也可以是 asyncFunction
```

### 如何使用 YApi vendors/server 目录下的模块
可以直接 require vendors 目录下的模块，注意：后端 node 不能使用 import关键字，只能使用 require
例如： require('yapi')



### controller 和 model
新增 controller 需要继承 baseController(controller/base.js)

新增 model 需要继承 baseModel(model/base.js)

## client.js
### 绑定钩子(同后端 server.js )
```
this.bindHook(hookname, listener) //绑定钩子
hookname //钩子名
listener //监听函数，可以是普通函数，也可以是 asyncFunction
```
