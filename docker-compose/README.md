## 关于docker 使用省略，下面是制作过程

* 在当前目录执行　docker build


> docker build
~~~~~~
docker build -t yapi:v0.7.ry .

~~~~~~

> 启动项目

* 默认docker-yapi-compose.yml yml配置中使用了　/opt/yapi　目录需要提前创建
~~~~~~
mkdir -p /optyapi

docker-compose -p yapi -f ./docker-yapi-compose.yml up -d

~~~~~~

> 访问IP 9090 端口根据需求初始化项

* 初始化部署路径不要修改[不建议修改，如果修改请保持与　yapi_start.sh中的目录保持一直]
* 由于拆分数据镜像了　数据地址填写　mongo
* 项目初始化成功会提示＂部署成功字样　提示访问　http://127.0.0.1:3000"　重启一下　yapi 服务即可正常访问

> 重启　yapi 
* 访问　访问IP 3000 端口

~~~~~~
docker restart yapi
~~~~~~

## 项目启动/关闭

~~~~~~

docker-compose -p yapi -f ./docker-yapi-compose.yml up -d
docker-compose -p yapi -f ./docker-yapi-compose.yml down
~~~~~~

------

[具体说明:]

* ./docker-compose/docker-yapi-compose.yml 

* - 1. docker-compose 脚本需要根据自己需要创建一个数据挂在目录，可以根据自己需求自行修改
* - 2. docker-compose image，可以根据自己需求定义镜像名　docker build -t <image:tag> .
* - 3. docker-compose ports 关于使用端口自行定义
* - 4. docker-compose restart: always # 设置容器自启模式

------

* ./docker-compose/dockerfile/Dockerfile

* - 1. 使用了FROM node:12　基础镜像
* - 2. 执行默认WORKDIR /data/yapi
* - 3. 把初始化脚本放到了　/yapi_start.sh

------

* ./docker-compose/dockerfile/yapi_start.sh

* - 1. 定义了项目部署路径　vendors=/data/yapi/my-yapi/vendors
* - 2. 判断mongod 服务是否启动
* - 3. 第一次启动项目是vendors是不存在的，根据项目判断是否初始化　9090 服务
* - 4. vendors存在初始化 3000 服务

