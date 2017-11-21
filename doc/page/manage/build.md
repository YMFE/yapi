# 内网部署
使用我们提供的 yapi-cli 工具，部署 YApi 平台是非常容易的。建议部署成 http 站点，因 chrome 浏览器安全限制，部署成 https 会导致测试功能在请求 http 站点时文件上传功能异常。

如果您是将服务器代理到 nginx 服务器，请配置 nginx 支持 websocket。
```
在location /添加
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

## 环境要求
* nodejs（7.6+)
* mongodb（2.6+）

## 安装
### 方式一. 可视化部署[推荐]
执行 yapi server 启动可视化部署程序，输入相应的配置和点击开始部署，就能完成整个网站的部署。部署完成之后，可按照提示信息，执行 node/{网站路径/server/app.js} 启动服务器。在浏览器打开指定url, 点击登录输入您刚才设置的管理员邮箱，默认密码(ymfe.org) 登录系统（默认密码可在个人中心修改）。
```
npm install -g yapi-cli --registry https://registry.npm.taobao.org
yapi server
``` 
### 方式二. 命令行部署

如果 github 压缩文件无法下载，或需要部署到一些特殊的服务器，可尝试此方法

```
mkdir yapi
cd yapi
git clone https://github.com/YMFE/yapi.git vendors //或者下载 zip 包解压到 vendors 目录
cp vendors/config_example.json ./config.json //复制完成后请修改相关配置
cd vendors
npm install --production --registry https://registry.npm.taobao.org
npm run install-server //安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置
node server/app.js //启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
```

## 服务器管理

推荐使用 pm2 管理 node 服务器启动，停止，具体使用方法可参考下面的教程：
* <a href="http://pm2.keymetrics.io/docs/usage/quick-start/">官网文档</a>
* <a href="http://imweb.io/topic/57c8cbb27f226f687b365636">PM2实用入门指南</a> 

## 升级
升级项目版本是非常容易的，并且不会影响已有的项目数据，只会同步 vendors 目录下的源码文件。

    cd  {项目目录}
    yapi ls //查看版本号列表
    yapi update //升级到最新版本
    yapi update -v v1.1.0 //升级到指定版本

## 配置邮箱 (仅支持 SMTP)
打开项目目录 config.json 文件，新增 mail 配置， 替换默认的邮箱配置
```
{
  "port": "*****",
  "adminAccount": "********",
  "db": {...},
  "mail": {
    "enable": true,
    "host": "smtp.163.com",    //邮箱服务器
    "port": 465,               //端口
    "from": "***@163.com",     //发送人邮箱
    "auth": {
        "user": "***@163.com", //邮箱服务器账号
        "pass": "*****"        //邮箱服务器密码
    }
  }
}
```

<br><br><br><br><br>