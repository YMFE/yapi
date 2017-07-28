## YApi  高效、易用、功能强大的api管理系统

## 平台介绍

YAPI管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护、监控和保护任意规模的 API，而且yapi为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的创建。

## 功能
1. 项目接口管理

    提供基本的项目分组，项目管理，接口管理功能

2. mockServer服务

    用户只需在项目配置线上域名和接口基本路径，通过将线上域名指到我们的yapi平台服务器，就可使用mockServer服务

3. 用户管理

    提供基本的用户注册登录管理等功能，集成了去哪儿QSSO登录

## 快速开始
### 1 接口管理架构
平台以**项目分组** -> **项目** -> **接口**的划分进行接口组织管理。

#### 1.1 项目分组
登录之后进到项目首页，左边侧边栏显示的即分组列表。

![分组列表](http://upload-images.jianshu.io/upload_images/842107-d90ca4b3242fa760.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

管理员有权限添加或删除分组。
![添加分组](http://upload-images.jianshu.io/upload_images/842107-a0d4d9a98003896a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 分组名称具有唯一性

#### 1.2 项目
选中不同的分组，右边会显示该分组下的项目列表。

![项目列表](http://upload-images.jianshu.io/upload_images/842107-137bcae58b84715e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

创建项目需要填写项目名称，项目线上域名（添加完成后可配置项目其他环境域名），项目接口基本路径（接口路径前面相同的部分）以及项目描述。
![创建项目](http://upload-images.jianshu.io/upload_images/842107-360a50ddb746f73d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 项目『线上域名 + 基本路径』具有唯一性

#### 1.3 接口
点击项目名称，进入该项目接口列表。
![接口列表](http://upload-images.jianshu.io/upload_images/842107-e858005f714f4889.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击编辑，进入接口详情页（之后接口详情页和编辑也会分开），可以编辑接口或者请求测试真实接口。

![接口详情](http://upload-images.jianshu.io/upload_images/842107-78c0ea839619d068.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![请求真实接口](http://upload-images.jianshu.io/upload_images/842107-2ee7171d707e91ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### Mock功能

 &emsp;&emsp;yapi的Mock功能可以根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据，支持复杂的生成逻辑，创建者可以自由构造需要的数据。而且与常见的Mock方式如将Mock写在代码里和JS拦截等相比yapi的Mock在使用场景和效率和复杂度上是相差甚远的，正是由于yapi的Mock是一个第三方平台那么在 团队开发时任何人都可以权限许可下创建、修改接口信息等操作，这对于团队开发是很有好处的。

##### 第一步：添加接口
通过点击页面上的"+添加接口"

![接口添加](http://note.youdao.com/yws/api/personal/file/WEB613bd4f29db038f2b41c03dcfceda2b6?method=download&shareKey=29bfc2b855f6f26ce0079baf567e54cc)

##### 第二步：输入协议、URL、接口名、请求头、请求参数、mock规则等信息，然后点击右上角的"Mock"按钮。

![接口详情](http://note.youdao.com/yws/api/personal/file/WEB0759331a53e095d910cfb4024ea657d5?method=download&shareKey=a86046f0bd2353d4763a9c962d747e5b)

##### 第三步：当点击"Mock"按钮之后，就会在页面下方生成一个mock结果并产生一个API接口。点击"复制"按钮即可复制，用户拿到接口后就可以发请求了。

![Mock结果](http://note.youdao.com/yws/api/personal/file/WEB265d4bf7cc979bda06d07639d1b84557?method=download&shareKey=64d41dea0371e38761f494d7899b3b35)

##### 第四步：当拿到复制好接口之后就可以发起一个请求了，先将请求的信息填写完善如：请求方法（post、get等）、URL、请求头、请求的数据等。然后就点击"发送"，然后在"返回结果"出可以看到接口返回的数据。

![请求接口](http://note.youdao.com/yws/api/personal/file/WEB1c22d5c4062be5f10be0b1cdfae86621?method=download&shareKey=93be3a4f1fe56219b89ea2c5ba04014d)

你也可以通过点击"管理成员"来添加和删除项目的成员，便于团队管理。

![成员管理](http://note.youdao.com/yws/api/personal/file/WEB1b9defdf0cb884f46c2bd6c30ceb02fb?method=download&shareKey=218b9326659208ec564b9fff3ea8c6c3)

## 未来计划推出功能
1. 可视化JSON编辑器，可定义JSON_Schema和mockjs
2. 支持HTTP和RPC协议
3. 自动化测试
4. 多人协作
