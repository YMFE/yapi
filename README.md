## YApi  可视化接口管理平台
<p><a target="_blank" href="http://yapi.demo.qunar.com">yapi.demo.qunar.com</a></p>

### 平台介绍
![avatar](yapi-base-flow.jpg)

YApi 是<strong>高效</strong>、<strong>易用</strong>、<strong>功能强大</strong>的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi 还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。

**QQ交流群**: 644642474

### 特性
*  基于 Json5 和 Mockjs 定义接口返回数据的结构和文档，效率提升多倍
*  扁平化权限设计，即保证了大型企业级项目的管理，又保证了易用性
*  类似 postman 的接口调试
*  自动化测试, 支持对 Response 断言
*  MockServer 除支持普通的随机 mock 外，还增加了 Mock 期望功能，根据设置的请求过滤规则，返回期望数据
*  支持 postman, har, swagger 数据导入
*  免费开源，内网部署，信息再也不怕泄露了

### 内网部署
#### 环境要求
* nodejs（7.6+)
* mongodb（2.6+）
* git
#### 安装
使用我们提供的 yapi-cli 工具，部署 YApi 平台是非常容易的。执行 yapi server 启动可视化部署程序，输入相应的配置和点击开始部署，就能完成整个网站的部署。部署完成之后，可按照提示信息，执行 node/{网站路径/server/app.js} 启动服务器。在浏览器打开指定url, 点击登录输入您刚才设置的管理员邮箱，默认密码为 ymfe.org 登录系统（默认密码可在个人中心修改）。

    npm install -g yapi-cli --registry https://registry.npm.taobao.org
    yapi server 

#### 升级
升级项目版本是非常容易的，并且不会影响已有的项目数据，只会同步 vendors 目录下的源码文件。

    cd  {项目目录}
    yapi ls //查看版本号列表
    yapi update //更新到最新版本
    yapi update -v {Version} //更新到指定版本


### YApi 插件
* [yapi sso 登录插件](https://github.com/YMFE/yapi-plugin-qsso)
* [yapi cas 登录插件](https://github.com/wsfe/yapi-plugin-cas) By wsfe

### YApi 教程
* [使用 alpine 版 docker 镜像快速部署 yapi](https://www.jianshu.com/p/a97d2efb23c5)
* [Centos-安装环境配置](https://github.com/suxiaoxin/yapi_user_guide/blob/master/centos%20%E5%AE%89%E8%A3%85%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.md)
* [MacOS-YAPI初次使用指南](https://github.com/liuyuan1989/yapi_user_guide/blob/master/YAPI%E5%88%9D%E6%AC%A1%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97_MacOS.md) By liuyuan1989
* [Docker构建yapi(接口管理)容器,从构建到发布](https://juejin.im/post/5b4c518b6fb9a04fd4508af1)

### YApi 的一些客户
* 去哪儿
* 携程
* 艺龙 
* 京东
* 唯品支付 
* 链家网
* 快手
* 便利蜂
* [中商惠民](http://www.huimin.cn/)

### Authors
* [hellosean1025](https://github.com/hellosean1025)
* [zwjamnsss](https://github.com/amnsss)
* [dwb1994](https://github.com/dwb1994)
* [fungezi](https://github.com/fungezi)
* [gaoxiaomumu](https://github.com/gaoxiaomumu)

### License
Apache License 2.0

