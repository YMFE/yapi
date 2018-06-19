## 安装YApi

1.创建工程目录

```bash
mkdir yapi && cd yapi
git clone https://github.com/YMFE/yapi.git vendors --depth=1 # 或者下载 zip 包解压到 vendors 目录
```

2.修改配置

```bash
cp vendors/config_example.json ./config.json # 复制完成后请修改相关配置
vi ./config.json
```

配置如下，主要配置 MongoDB 数据库，以及 Admin 账号。

```json
{
  "port": "3011",
  "adminAccount": "admin@admin.com",
  "db": {
    "servername": "127.0.0.1",
    "DATABASE":  "yapi",
    "port": 27017,
    "user": "yapi",
    "pass": "yapi123"
  },
  "mail": {
    "enable": true,
    "host": "smtp.163.com",
    "port": 465,
    "from": "***@163.com",
    "auth": {
        "user": "***@163.com",
        "pass": "*****"
    }
  }
}
```
> db.user 和 db.pass 是 mongodb 的用户名和密码，如果没有开启 mongo 认证功能，请删除这两个选项。

3.安装依赖

```bash
cd vendors
npm install  --registry https://registry.npm.taobao.org # 安装依赖
```

4.初始化

```bash
npm run install-server  # 安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置
# 默认输出
# 初始化管理员账号成功,账号名："admin@admin.com"，密码："ymfe.org"
```

5.启动开发机

```bash
npm run dev
# 启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
# 127.0.0.1:3011
```

目录结构

```
|-- config.json
|-- init.lock
|-- log
`-- vendors
    |-- CHANGELOG.md
    |-- LICENSE
    |-- README.md
    |-- client
    |-- common
    |-- config_example.json
    |-- doc
    |-- exts
    |-- nodemon.json
    |-- npm-debug.log
    |-- package.json
    |-- plugin.json
    |-- server
    |-- static
    |-- test
    |-- webpack.alias.js
    |-- yapi-base-flow.jpg
    |-- ydocfile.js
    `-- ykit.config.js
```



## 技术栈说明

后端： koa mongoose

前端： react redux

## 启动开发环境服务器

```bash
  cd vendors
  npm run dev
  # 启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
```

## 启动生产环境服务器

```bash
  cd vendors
  ykit pack -m
  node server/app.js
```