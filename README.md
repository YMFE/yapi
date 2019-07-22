### <font color=RED size=24 face="黑体">  crazy-yapi</font>分支补充功能说明：

// TO DO
测试集合多级目录
断言功能加强
公共参数备注链接

2019/7/22
*  修复接口列表分页bug
*  修复搜索接口bug
*  增加：搜索接口时，过滤未命中的分类
*  增加：命中的关键字高亮显示
*  增加：树目录中接口增加状态显示



2019/7/20

*  修复接口列表页面  table中 子分类显示id的bug
*   增加接口列表页面 table中支持treeselect选择子分类修改的功能
*  优化：接口列表页面搜索时，未命中的分类/接口，不显示

2019/7/19
*  增加接口列表多级目录
*  支持多级目录拖拽移动，修复各种坑死人不偿命bug
*  接口列表页【搜索接口】支持搜索子目录接口
*  添加接口接口筛选子目录
*  跨项目移动接口支持筛选子目录

2019/7/16
*  修复接口列表状态过滤分页异常的bug（bug:状态过滤后，却任然按照过滤前的数据分页展示）
*  接口列表头增加当前分类的接口状态统计 如：全部接口共 (30) 个,其中：["开发中: 1 个","已发布: 29 个"]


2019/7/15前
*  接口定义中参数示例参数如果是json格式，则会进行染色并格式化
*  增加接口/用例空间内跨项目移动功能
*  全局搜索增加支持接口路劲搜索（不包含basepath）
*  修复form参数批量导入时，示例值中包含冒号，导入后冒号后面内容丢失的bug
*  优化查询参数示例显示宽度为自适应
*  增加接口状态（从原来的未完成-已完成  改为： 设计中，开发中，已提测，已发布，已过时，暂停开发 ）
*  增加用例前置/后置脚本处理器，兼容context、storage，执行顺序：项目请求前置脚本-》用例前置脚本-》用例后置脚本-》项目响应处理脚本
*  在F12-console控制台打印用例执行的context内容，减小对cross控制台查看请求参数的依赖
*  在控制台打印请求配置脚本以及前置后置js脚本的异常错误，提高调试效率
*  请求超时时间从5秒修改为10秒
*   post form 参数增加list类型
    -  当参数类型为list时，value以“,”逗号分隔符连接多个value  如 value1,value2,value3;
    -  list 参数仅在【服务器端】执行用例时全部生效
    -  list 参数在【浏览器端】执行用例时，因cross插件当前不支持list类型，会取list第一个参数发起请求，其他参数忽略，该问题影响不大，后续有时间的时候修改cross插件兼容




### 当前分支用户（使用当前分支的请提交issure，用的人越多 功能支持更新越快）
*   小影

### 分支部署说明
<font size=5 color=red  >前置条件：</font>
先参考主分支部署说明部署主分支，停止yapi服务后，再进行以下操作

1. 安装forerver（使用forerver 后台运行nodejs）,安装 ykit
2.  cd xxxx/yapi/vendors
3. 添加 分支仓库（若已经添加，无需重复添加） git remote add yehaoapi https://github.com/xian-crazy/yapi.git
4. 删除本地文件rm -rf *
5. 获取全部代码：git reset --hard yehaoapi/master
6. 安装依赖 npm install  --registry https://registry.npm.taobao.org
7. 前端打包 ykit pack -m
8. 启动服务 forever start -o out.log -e err.log server/app.js

### 分支升级说明
1. 停止服务：forever stopall
2. cd xxx/yapi/vendors/
3. 拉取新代码 git pull yehaoapi master
4. 打包 ykit pack -m
5. 启动服务 forever start -o out.log -e err.log server/app.js

### crazy-yapi 分支 作者
* crazy  330126160@qq.com


<font color=RED size=24 face="黑体"> ---------------------以下类容为主分支说明文档------------------------------</font>

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
    
### 教程
* [使用 YApi 管理 API 文档，测试， mock](https://juejin.im/post/5acc879f6fb9a028c42e8822)
* [自动更新 Swagger 接口数据到 YApi 平台](https://juejin.im/post/5af500e251882567096140dd)
* [自动化测试](https://juejin.im/post/5a388892f265da430e4f4681)

### YApi 插件
* [yapi sso 登录插件](https://github.com/YMFE/yapi-plugin-qsso)
* [yapi cas 登录插件](https://github.com/wsfe/yapi-plugin-cas) By wsfe
* [yapi gitlab集成插件](https://github.com/cyj0122/yapi-plugin-gitlab)
* [oauth2.0登录](https://github.com/xwxsee2014/yapi-plugin-oauth2)
* [rap平台数据导入](https://github.com/wxxcarl/yapi-plugin-import-rap)
* [dingding](https://github.com/zgs225/yapi-plugin-dding) 钉钉机器人推送插件
* [export-docx-data](https://github.com/inceptiongt/Yapi-plugin-export-docx-data) 数据导出docx文档

### 代码生成
* [yapi-to-typescript：根据 YApi 的接口定义生成 TypeScript 的请求函数](https://github.com/fjc0k/yapi-to-typescript)
* [yapi-gen-js-code: 根据 YApi 的接口定义生成 javascript 的请求函数](https://github.com/hellosean1025/yapi-gen-js-code)

### YApi docker部署（非官方）
* [使用 alpine 版 docker 镜像快速部署 yapi](https://www.jianshu.com/p/a97d2efb23c5)
* [docker-yapi](https://github.com/Ryan-Miao/docker-yapi)

### YApi 一些工具
* [mysql服务http工具,可配合做自动化测试](https://github.com/hellosean1025/http-mysql-server)
* [idea 一键上传接口到yapi插件](https://github.com/FurionCS/YapiIdeaUploadPlugin)

### YApi 主分支 的一些客户
* 去哪儿
* 携程
* 艺龙 
* 美团
* 百度
* 腾讯
* 阿里巴巴
* 京东
* 今日头条
* 唯品支付 
* 链家网
* 快手
* 便利蜂
* 中商惠民
* 新浪
* VIPKID



### 主分支 Authors
* [hellosean1025](https://github.com/hellosean1025)
* [gaoxiaomumu](https://github.com/gaoxiaomumu)
* [zwjamnsss](https://github.com/amnsss)
* [dwb1994](https://github.com/dwb1994)
* [fungezi](https://github.com/fungezi)




### License
Apache License 2.0

