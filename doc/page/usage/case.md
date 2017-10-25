## 介绍
<p style='text-indent:2em;line-height:1.8em'>在平时的开发过程中，经常遇到的一个问题是每次调试接口都需要重新填写参数，YApi测试集可以保存之前填写的参数，方便下次的调试。YApi测试集还可以一次性测试所有接口，每个的请求参数可以通过前面已请求的接口数据读取，或填写mock随机字符串。</p>

## 测试列表

<img class="doc-img" style="width: 618px;" src="./images/usage/case-list.gif"  />

在测试列表可以看到每个测试用例的 key,还有 开始测试、报告等功能

点击开始测试会按照 case 定义的参数从上往下一个一个进行测试，如果顺序有问题，可以拖动调整

测试完成之后，点击报告查看该次请求的结果

## 编辑测试用例

### Mock参数
Mock 参数每次请求都会生成随机字符串

<img  class="doc-img" style="width:100%" src="./images/usage/case-edit.jpg"  />

#### 变量参数

YApi 提供了强大的变量参数功能，你可以在测试的时候使用前面接口的 `参数` 或 `返回值` 作为 `后面接口的参数`，即使接口之间存在依赖，也可以轻松 **一键测试~**

格式：
```
$.{key}.{params|body}.{path}
```

例如：现有两个接口，分别是“导航标题”和“文章列表”
<img class="doc-img" style="width: 678px;" src="./images/usage/case_key_list.png" />

文章列表接口需要传参数: `当前标题(id)`，而这个 id 需要通过 `导航标题` 的返回值获取，这时应在 `文章列表` 的参数输入框中根据前者的 key 找到对应 id。

`导航标题` 的参数和返回值有如下结构：
<div style="margin: 16px 0;">
  <span style="display: inline-block; width: 60px;vertical-align: top;">参数：</span>
  <img style="width: 165px;" src="./images/usage/case_key_res_query.png" />
</div>
<div style="margin: 16px 0;">
  <span style="display: inline-block; width: 60px;vertical-align: top;">返回值：</span>
  <img style="width: 122px;" src="./images/usage/case_key_res.png" />
</div>

则 `文章列表` 的参数可以如下配置：
<img  class="doc-img" style="width: 624px;" src="./images/usage/case_key_query.png" />

其中 **$.** 是使用 **动态变量** 的标志，$.269.**params** 即表示 key 值为 269 用例的请求参数，$.269.**body** 即表示 key 值为 269 用例的返回值。

> Tips: 上下拖动测试集合的列表项可以调整测试的顺序。
