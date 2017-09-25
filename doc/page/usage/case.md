## 介绍
<p style='text-indent:2em;line-height:1.8em'>在平时的开发过程中，经常遇到的一个问题是每次调试接口都需要重新填写参数，YApi测试集可以保存之前填写的参数，方便下次的调试。YApi测试集还可以一次性测试所有接口，每个的请求参数可以通过前面已请求的接口数据读取，或填写mock随机字符串。</p>

## 测试列表

<img  class="doc-img" style="width:100%" src="./images/usage/case-list.jpg"  />

在测试列表可以看到每个测试用例的 key,还有 开始测试、报告等功能

点击开始测试会按照 case 定义的参数从上往下一个一个进行测试，如果顺序有问题，可以拖动调整

测试完成之后，点击报告查看该次请求的结果

## 编辑测试用例

### Mock参数
Mock 参数每次请求都会生成随机字符串

<img  class="doc-img" style="width:100%" src="./images/usage/case-edit.jpg"  />

#### 变量参数

<img  class="doc-img" style="width:100%" src="./images/usage/mock-var-param.jpg"  />


      $.371.data._id

$. 是使用动态变量的标志

371 是用例 key ,可在用例列表查看到

data._id 是接口返回数据指向的实际字段



