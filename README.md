### Yapi是一个高效，易用，功能强大的api管理系统

#### 后台server如何启动和热更新？

1. npm install
2. npm run dev-server

# 平台介绍
## 1 接口管理架构
平台以**项目分组** -> **项目** -> **接口**的划分进行接口组织管理。

### 1.1 项目分组
登录之后进到项目首页，左边侧边栏显示的即分组列表。
![分组列表](http://upload-images.jianshu.io/upload_images/842107-bf341260ab637b36.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

管理员有权限添加或删除分组。
![添加分组](http://upload-images.jianshu.io/upload_images/842107-a0d4d9a98003896a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 分组名称具有唯一性

### 1.2 项目
选中不同的分组，右边会显示该分组下的项目列表。

![项目列表](http://upload-images.jianshu.io/upload_images/842107-137bcae58b84715e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

创建项目需要填写项目名称，项目线上域名（添加完成后可配置项目其他环境域名），项目接口基本路径（接口路径前面相同的部分）以及项目描述。
![创建项目](http://upload-images.jianshu.io/upload_images/842107-360a50ddb746f73d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 项目『线上域名 + 基本路径』具有唯一性

### 1.3 接口
点击项目名称，进入该项目接口列表。
![接口列表](http://upload-images.jianshu.io/upload_images/842107-e858005f714f4889.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击编辑，进入接口详情页（之后接口详情页和编辑也会分开），可以编辑接口或者请求测试真实接口。

![接口详情](http://upload-images.jianshu.io/upload_images/842107-78c0ea839619d068.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![请求真实接口](http://upload-images.jianshu.io/upload_images/842107-2ee7171d707e91ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
