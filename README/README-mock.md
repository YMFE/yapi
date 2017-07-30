### Mock功能

 <p style='text-indent:2em;line-height:1.8em'>yapi的Mock功能可以根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据，支持复杂的生成逻辑，创建者可以自由构造需要的数据。而且与常见的Mock方式如将Mock写在代码里和JS拦截等相比yapi的Mock在使用场景和效率和复杂度上是相差甚远的，正是由于yapi的Mock是一个第三方平台那么在 团队开发时任何人都可以权限许可下创建、修改接口信息等操作，这对于团队开发是很有好处的。</p>

#### 1 添加接口

通过点击页面上的"+添加接口"

<img src="http://note.youdao.com/yws/api/personal/file/WEB613bd4f29db038f2b41c03dcfceda2b6?method=download&shareKey=29bfc2b855f6f26ce0079baf567e54cc" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

 输入协议、URL、接口名、请求头、请求参数、mock规则等信息，然后点击右上角的"Mock"按钮。

<img src="http://upload-images.jianshu.io/upload_images/842107-78c0ea839619d068.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

#### 2 Mock

当点击"Mock"按钮之后，就会在页面下方生成一个mock结果并产生一个API接口。点击"复制"按钮即可复制，用户拿到接口后就可以发请求了。

<img src="http://note.youdao.com/yws/api/personal/file/WEBf9b154cb88d21daa8206e8c4a3d76042?method=download&shareKey=1999f6c2cf197b5b6d775c312e34073d" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

将请求的信息填写完善如：请求方法（post、get等）、URL、请求头、请求的数据等。然后就点击"发送"，然后在"返回结果"出可以看到接口返回的数据。

<img src="http://upload-images.jianshu.io/upload_images/842107-2ee7171d707e91ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

#### 3 成员管理

你也可以通过点击"管理成员"来添加和删除项目的成员，便于团队管理。

<img src="http://note.youdao.com/yws/api/personal/file/WEB1b9defdf0cb884f46c2bd6c30ceb02fb?method=download&shareKey=218b9326659208ec564b9fff3ea8c6c3" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

## 未来计划推出功能

1. 可视化JSON编辑器，可定义JSON_Schema和mockjs
2. 支持HTTP和RPC协议
3. 自动化测试
4. 多人协作