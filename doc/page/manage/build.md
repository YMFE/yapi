# 内网部署
使用我们提供的 yapi-cli 工具，部署 YApi 平台是非常容易的。
## 环境要求
* nodejs（7.6+)
* mongodb（2.6+）

## 安装
执行 yapi-cli server 启动可视化部署程序，输入相应的配置和点击开始部署，就能完成整个网站的部署。部署完成之后，可按照提示信息，执行 node/{网站路径/server/app.js} 启动服务器。在浏览器打开指定url, 点击登录输入您刚才设置的管理员邮箱，默认密码(ymfe.org) 登录系统（默认密码可在个人中心修改）。
```
npm install -g yapi-cli --registry https://registry.npm.taobao.org
yapi-cli server
``` 

## 更新
    cd  {项目目录}
    yapi-cli ls //查看版本号列表
    yapi-cli update -v v1.1.0

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