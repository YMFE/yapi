## Mock功能

 <p style='text-indent:2em;line-height:1.8em'>yapi的Mock功能可以根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则([点击到Mock规则](#mock)）生成Mock接口，这些接口会自动生成模拟数据，支持复杂的生成逻辑，创建者可以自由构造需要的数据。而且与常见的Mock方式如将Mock写在代码里和JS拦截等相比yapi的Mock在使用场景和效率和复杂度上是相差甚远的，正是由于yapi的Mock是一个第三方平台那么在 团队开发时任何人都可以权限许可下创建、修改接口信息等操作，这对于团队开发是很有好处的。</p>

### 1 Mock步骤
#### 1.1 创建接口

通过点击页面上的"+添加接口"

<img src="http://note.youdao.com/yws/api/personal/file/WEB613bd4f29db038f2b41c03dcfceda2b6?method=download&shareKey=29bfc2b855f6f26ce0079baf567e54cc" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

 输入协议、URL、接口名、请求头、请求参数、Mock规则（[点击到Mock规则](#mock)）等信息。

<img src="http://note.youdao.com/yws/api/personal/file/WEB680a37ba304768804b23cf2cf36ed40d?method=download&shareKey=0d750695dce3a4c7abf697fa58d24c57" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

输入Mock规则时它会在右边同步产生一个对应的结果

<img src="http://note.youdao.com/yws/api/personal/file/WEB929dce5eed22e1b7e9a10be98ee2ab38?method=download&shareKey=5616ed1d9e09cc38f9cdbb995c892cb5" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

最后点击保存按钮，保存后将会在"Mock地址"生成一个链接。
>Mock地址的域名需要配置 host 指到我们的服务器 ip 地址

<img src="http://note.youdao.com/yws/api/personal/file/WEB525ea3dadf1f274bbe12943341ba00cb?method=download&shareKey=95dbc9cf7a7646387c55dabf64cad888" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />

取到上面的链接在浏览器中请求就可以得到如下结果。

<img src="http://note.youdao.com/yws/api/personal/file/WEBf168cd41d3ad4b5b24d68787063220c7?method=download&shareKey=beb6896165ddd3568ebecbcc92195180" width = "800" style="margin:0px auto;display:block;" alt="图片名称" align=center />



<span id = "mock"></span>
### 2.1 Mock语法规范
>参考自：[Mock.js 官网](http://mockjs.com/)

Mock.js 的语法规范包括两部分：

[1. 数据模板定义规范（Data Template Definition，DTD）](#DTD)

[2. 数据占位符定义规范（Data Placeholder Definition，DPD）](#DPD)

<span id = "DTD"></span>
### 数据模板定义规范（Data Template Definition，DTD）

数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：


```
// 属性名   name （与生成规则之间用 "|" 隔开）
// 生成规则 rule（生成规则有7种详见下面的生成规则）
// 属性值   value（可以含有 "@占位符" 同时也指定了最终值的初始值和类型）

'name|rule': value

生成规则：
'name|min-max': value
'name|count': value
'name|min-max.dmin-dmax': value
'name|min-max.dcount': value
'name|count.dmin-dmax': value
'name|count.dcount': value
'name|+step': value
```

生成规则示例：
#### 1. 属性值是字符串 String

```
1. 'name|min-max': string
通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。

2. 'name|count': string
通过重复 string 生成一个字符串，重复次数等于 count。
```
#### 2. 属性值是数字 Number
```
1. 'name|+1': number

属性值自动加 1，初始值为 number。

2. 'name|min-max': number

生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型。

3. 'name|min-max.dmin-dmax': number

生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位。

例如：
Mock.mock({
    'number1|1-100.1-10': 1,
    'number2|123.1-10': 1,
    'number3|123.3': 1,
    'number4|123.10': 1.123
})
// =>
{
    "number1": 12.92,
    "number2": 123.51,
    "number3": 123.777,
    "number4": 123.1231091814
}
```

#### 3. 属性值是布尔型 Boolean
```
1. 'name|1': boolean

随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。

2. 'name|min-max': value

随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。
```
#### 4. 属性值是对象 Object
```
1. 'name|count': object

从属性值 object 中随机选取 count 个属性。

2. 'name|min-max': object

从属性值 object 中随机选取 min 到 max 个属性。
```
#### 5. 属性值是数组 Array
```
1. 'name|1': array

从属性值 array 中随机选取 1 个元素，作为最终值。

2. 'name|+1': array

从属性值 array 中顺序选取 1 个元素，作为最终值。

3. 'name|min-max': array

通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max。

4. 'name|count': array

通过重复属性值 array 生成一个新数组，重复次数为 count。
```
#### 6. 属性值是函数 Function
```
1. 'name': function

执行函数 function，取其返回值作为最终的属性值，函数的上下文为属性 'name' 所在的对象。
```
#### 7.属性值是正则表达式 RegExp
```
1. 'name': regexp

根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。

例如：
Mock.mock({
    'regexp1': /[a-z][A-Z][0-9]/,
    'regexp2': /\w\W\s\S\d\D/,
    'regexp3': /\d{5,10}/
})
// =>
{
    "regexp1": "pJ7",
    "regexp2": "F)\fp1G",
    "regexp3": "561659409"
}
```
<span id = "DPD"></span>
### 数据占位符定义规范（Data Placeholder Definition，DPD）

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。

占位符 的格式为：
```
@占位符
@占位符(参数 [, 参数])

说明：
1. 用 @ 来标识其后的字符串是 占位符。
2. 占位符 引用的是 Mock.Random 中的方法。
3. 通过 Mock.Random.extend() 来扩展自定义占位符。
4. 占位符 也可以引用 数据模板 中的属性。
5. 占位符 会优先引用 数据模板 中的属性。
6. 占位符 支持 相对路径 和 绝对路径。

Mock.mock({
    name: {
        first: '@FIRST',
        middle: '@FIRST',
        last: '@LAST',
        full: '@first @middle @last'
    }
})
// 上面的示例可以得到如下结果：
{
    "name": {
        "first": "Charles",
        "middle": "Brenda",
        "last": "Lopez",
        "full": "Charles Brenda Lopez"
    }
}
```

## 未来计划推出功能

1. 可视化JSON编辑器，可定义JSON_Schema和mockjs
2. 支持HTTP和RPC协议
3. 自动化测试
4. 多人协作
