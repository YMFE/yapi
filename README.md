## YApi  http://yapi.demo.qunar.com 

### 平台介绍
![avatar](yapi-base-flow.jpg)

YApi是<strong>高效</strong>、<strong>易用</strong>、<strong>功能强大</strong>的api管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。

### 特性
1.  基于 Json5 和 Mockjs 定义接口返回数据的结构和文档，效率提升多倍
2.  扁平化权限设计，即保证了大型企业级项目的管理，又保证了易用性
3.  不仅有类似postman的接口调试，还有强大的测试集功能
4.  免费开源，内网部署，信息再也不怕泄露了！

### 内网部署
#### 环境要求
* nodejs（7.6+)
* mongodb（2.6+）
#### 安装
使用我们提供的 yapi-cli 工具，部署 YApi 平台是非常容易的。执行 yapi-cli server 启动可视化部署程序，输入相应的配置和点击开始部署，就能完成整个网站的部署。部署完成之后，可按照提示信息，执行 node/{网站路径/server/app.js} 启动服务器

    npm install -g yapi-cli --registry https://registry.npm.taobao.org
    yapi-cli server 
### 在线demo
http://yapi.demo.qunar.com

管理员账号： yapi.demo@qunar.com ymfe.org

### 意见反馈
QQ群： 644642474

### License
Apache 2.0

