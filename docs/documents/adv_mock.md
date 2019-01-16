# 高级Mock
高级 Mock 分为`Mock 期望`和`自定义 Mock 脚本`两种方式。

## Mock 期望
在测试时，很多时候需要根据不同的请求参数、IP 返回不同的 HTTP Code、HTTP 头和 JSON 数据。

Mock 期望就是根据设置的请求过滤规则，返回期望数据。

### 使用方法
1. 进入接口详情页，点击『高级 Mock』选项。
<div class="doc-img-wrapper"><img class="doc-img-r" src="./images/usage/adv-mock-case1.png"/></div>
2. 点击『添加期望』，填写过滤规则以及期望返回数据，点击『确定』保存。
<div class="doc-img-wrapper"><img class="doc-img-r" src="./images/usage/adv-mock-case3.png"/></div>
<div class="doc-img-wrapper"><img class="doc-img-r" src="./images/usage/adv-mock-case4-new.png"/></div>
3. 然后尝试在浏览器里发送符合规则的请求，查看返回的数据是否符合期望。
<div class="doc-img-wrapper"><img class="doc-img-r" src="./images/usage/adv-mock-case5-new.png"/></div>

### 期望填写

基本信息

* 期望名称：给此条期望命名
* IP 过滤：请求的 IP 是设置的地址才可能返回期望。默认 IP 过滤关闭，任何 IP 地址都可能返回期望。
* 参数过滤：请求必须包含设置的参数，并且值相等才可能返回期望。参数可以在 Body 或 Query 中。

响应

* HTTP Code：期望响应的 HTTP 状态码
* 延时：期望响应的延迟时间
* HTTP 头：期望响应带有的 HTTP 头
* 返回 JSON：期望返回的 JSON 数据


## 自定义 Mock 脚本
在前端开发阶段，对于某些接口，业务相对复杂，而 UI 端也需要根据接口返回的不同内容去做相应的处理。

YApi 提供了写 JS 脚本方式处理这一问题，可以根据用户请求的参数修改返回内容。

### 全局变量
请求

- `header` 请求的 HTTP 头
- `params` 请求参数，包括 Body、Query 中所有参数
- `cookie` 请求带的 Cookies

响应

- `mockJson` 
  接口定义的响应数据 Mock 模板

- `resHeader` 
响应的 HTTP 头

- `httpCode` 
响应的 HTTP 状态码

- `delay` 
Mock 响应延时，单位为 ms

- `Random` 
Mock.Random 方法，可以添加自定义占位符,详细使用方法请查看 <a href="https://github.com/nuysoft/Mock/wiki/Mock.Random">Wiki</a>

### 使用方法
1. 首先开启此功能
2. Mock 脚本就是用 JavaScript 对 `mockJson` 变量修改,请避免被全局变量(httpCode, resHeader, delay)的修改


### 示例1, 根据请求参数重写 mockJson
```
if(params.type == 1){
  mockJson.errcode = 400;
  mockJson.errmsg = 'error';
}

if(header.token == 't'){
  mockJson.errcode = 300;
  mockJson.errmsg = 'error';
}

if(cookie.type == 'a'){
  mockJson.errcode = 500;
  mockJson.errmsg = 'error';
}

```

### 示例2, 生成高度自定义数据内容
```
var a = [1,1,1,1,1,1,1,1,1,1]

mockJson = {
    errcode: 0,
    email: Random.email('qq.com'),
    data: a.map(function(item){
        return Random.city() + '银行'
    })
}

```


## Mock 优先级说明
请求 Mock 数据时，规则匹配优先级：Mock 期望 > 自定义 Mock 脚本 > 项目全局 mock 脚本 > 普通 Mock。

如果前面匹配到 Mock 数据，后面 Mock 则不返回。
