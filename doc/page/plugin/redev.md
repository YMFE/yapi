## 运行开发服务器

首先确保安装了 ykit, 没有安装请执行 npm install -g ykit

```
mkdir yapi
cd yapi
git clone https://github.com/YMFE/yapi.git vendors
cp vendors/config_example.json ./config.json //复制完成后请修改相关配置
cd vendors
npm install
npm run install-server //安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置
npm run dev //启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
```

## 安装成功后的目录结构

```
yapi
  config.json //服务器配置，可参考 vendors/config_example.json
  vendors //yapi 
  init.lock //安装锁文件，重新安装需要删除此文件
  log //运行日志
```

## 技术栈说明

后端： koa mongoose

前端： react redux

## 启动 prd 环境服务器
```
  cd vendors
  ykit pack -m
  node server/app.js
```