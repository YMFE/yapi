## YApi  可视化接口管理平台

### 平台介绍
![avatar](yapi-base-flow.jpg)

YApi 是<strong>高效</strong>、<strong>易用</strong>、<strong>功能强大</strong>的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi 还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。

**QQ交流群**: 644642474

### 特性
1.  基于 Json5 和 Mockjs 定义接口返回数据的结构和文档，效率提升多倍
2.  扁平化权限设计，即保证了大型企业级项目的管理，又保证了易用性
3.  不仅有类似 postman 的接口调试，还有强大的测试集功能
4.  支持 postman, har, swagger 数据导入
5.  免费开源，内网部署，信息再也不怕泄露了！

### 内网部署
#### 环境要求
* nodejs（7.6+)
* mongodb（2.6+）
#### 安装
使用我们提供的 yapi-cli 工具，部署 YApi 平台是非常容易的。执行 yapi-cli server 启动可视化部署程序，输入相应的配置和点击开始部署，就能完成整个网站的部署。部署完成之后，可按照提示信息，执行 node/{网站路径/server/app.js} 启动服务器。在浏览器打开指定url, 点击登录输入您刚才设置的管理员邮箱，默认密码为 ymfe.org 登录系统（默认密码可在个人中心修改）。

    npm install -g yapi-cli --registry https://registry.npm.taobao.org
    yapi-cli server 

#### 升级
升级项目版本是非常容易的，并且不会影响已有的项目数据，只会同步 vendors 目录下的源码文件。

    cd  {项目目录}
    yapi-cli ls //查看版本号列表
    yapi-cli update //更新到最新版本
    yapi-cli update -v {Version} //更新到指定版本



### 在线 Demo
<p><a target="_blank" href="http://yapi.demo.qunar.com">yapi.demo.qunar.com</a></p>

管理员账号

用户名： yapi.demo@qunar.com

密码： ymfe.org

### License
Apache Licene 2.0

