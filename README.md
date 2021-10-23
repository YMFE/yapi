## YApi  可视化接口管理平台 （多级目录分支）

体验地址：

[https://yapi.feiyanyun.com/](https://yapi.feiyanyun.com/)

官方文档：
<p><a target="_blank" href="https://hellosean1025.github.io/yapi">hellosean1025.github.io/yapi</a></p>

### 分支介绍 
  *  **multi-menu** 分支 fork 官方 **api v1.10.2**
  *  主要支持`多级目录，拖拽，目录搜索`


### 内网部署
  > `multi-menu`分支 安装部署不使用`yapi-cli `工具,采用代码直接安装  
  这里采用不同安装，部署的方式，大体上步骤和官方一样  

  #### 需要事先安装 nodejs，mongodb
  

  **1.创建工程目录**
  
  ```shell
   mkdir yapi && cd yapi    #或者手动创建目录
   # 或者下载包解压到vendors,在切换分支
   git clone https://github.com/zybieku/yapi.git -b feat/multi-menu vendors --depth=1 
  ```
 
  **2.修改配置,安装依赖**
  > config.json里面的内容，具体看官方

  ```shell
   #复制完成后请修改相关配置
   cp vendors/config_example.json ./config.json 
    # 指令打开config，或者用鼠标打开
   vi ./config.json 
   npm install --production --registry https://registry.npm.taobao.org
   #安装程序会初始化数据库，管理员账号名可在 config.json 配置
    npm run install-server 
  ``` 
 **5.启动（也可以使用下面的pm2）** 

  ```shell
    node server/app.js #启动服务器后，#请访问 127.0.0.1:{config.json配置的端口}
     # linux 后台模式 注意 nohup 与 & exit
     >nohup  node server/app.js exit    
  ```

#### 服务管理
 也可以利用pm2启动和后台理维护。

    npm install pm2 -g  //安装pm2
    cd  {项目目录}
    pm2 start "vendors/server/app.js" --name yapi //pm2管理yapi服务
    pm2 info yapi //查看服务信息
    pm2 stop yapi //停止服务
    pm2 restart yapi //重启服务


#### 常见问题

 - 1. 依赖报错
 一般依赖报错是由于 yapi的很多依赖库版本有点旧 ，需要手动锁定版本

 - 2. node-sass node-gyp  安装不上 
   可能是node-gyp没安装
   ```shell
    npm install -g node-gyp
    npm rebuild node-gyp
   ```
 
 - 3. 没有ykit指令    
   npm install -g ykit