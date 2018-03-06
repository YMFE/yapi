
 <h1 class="curproject-name"> test </h1> 
 


# %u516C%u5171%u5206%u7C7B
[TOC]


## 12%0A%3Ca%20id%3D12%3E%20%3C/a%3E
[TOC]

### 基本信息

**Path：** /app/code

**Method：** POST

**接口描述：**
<p><br></p>

### 请求参数
**Headers**

| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| Content-Type  |  application/x-www-form-urlencoded | 是  |   |   |

### 返回数据

```javascript

/**
 * 这是一个 response 事例
 */
{
  "errcode": 0, //错误编码
  "data": {
    "id": "uuid-xxx", //产品id
    "name": "iphone" //产品名称
  }
}

```
# tag
[TOC]


## %28tag%29%u6839%u636E%u89C4%u5219%u641C%u7D22%u4EA7%u54C1%0A%3Ca%20id%3D%28tag%29%u6839%u636E%u89C4%u5219%u641C%u7D22%u4EA7%u54C1%3E%20%3C/a%3E
[TOC]

### 基本信息

**Path：** /tag/get_product_by_tag_rule

**Method：** POST

**接口描述：**
(tag)根据规则搜索产品

### 请求参数
**Headers**

| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| SiteUID  |   | 是  |   |   |
| ClientId  |   | 是  |   |   |
| Token  |   | 否  |   |  请求令牌 |
**Body**

<table>
  <thead class="ant-table-thead">
    <tr>
      <th key=name>名称</th><th key=type>类型</th><th key=required>是否必须</th><th key=default>默认值</th><th key=desc>备注</th><th key=sub>其他信息</th>
    </tr>
  </thead><tbody className="ant-table-tbody"><tr key=00><td key=0><span style="padding-left: 0px"><span style="color: #8c8a8a"></span> tag_rule_arr</span></td><td key=1><span>object []</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5><p key=3><span style="font-weight: '700'">item 类型: </span><span>object</span></p></td></tr><tr key=000><td key=0><span style="padding-left: 20px"><span style="color: #8c8a8a">├─</span> tag_rule_detial_arr</span></td><td key=1><span>object []</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5><p key=3><span style="font-weight: '700'">item 类型: </span><span>object</span></p></td></tr><tr key=0000><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> id</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>Id</span></td><td key=5><p key=2><span style="font-weight: '700'">版本: </span><span>int32</span></p></td></tr><tr key=0001><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> rule_dimension</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>维度</span></td><td key=5></td></tr><tr key=0002><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> value</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>规则值</span></td><td key=5></td></tr><tr key=0003><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> tag_rule_id</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>规则id</span></td><td key=5></td></tr><tr key=0004><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> type</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>类型(0:and,1:or)</span></td><td key=5></td></tr>
               </tbody>
              </table>
            
### 返回数据

<table>
  <thead class="ant-table-thead">
    <tr>
      <th key=name>名称</th><th key=type>类型</th><th key=required>是否必须</th><th key=default>默认值</th><th key=desc>备注</th><th key=sub>其他信息</th>
    </tr>
  </thead><tbody className="ant-table-tbody"><tr key=00><td key=0><span style="padding-left: 0px"><span style="color: #8c8a8a"></span> code</span></td><td key=1><span>string</span></td><td key=2>必须</td><td key=3></td><td key=4><span>响应编码OK</span></td><td key=5></td></tr><tr key=01><td key=0><span style="padding-left: 0px"><span style="color: #8c8a8a"></span> info</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=010><td key=0><span style="padding-left: 20px"><span style="color: #8c8a8a">├─</span> data</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=0100><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> product_info</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=01000><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> product_code</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>唯一编码</span></td><td key=5></td></tr><tr key=01001><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> sku</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>old_sku</span></td><td key=5></td></tr><tr key=01002><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> sku_history</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>历史sku</span></td><td key=5></td></tr><tr key=01003><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_free</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>版费情况0:付费;1:免费</span></td><td key=5><p key=2><span style="font-weight: '700'">版本: </span><span>int32</span></p></td></tr><tr key=01004><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> sequence</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>维护序列号</span></td><td key=5></td></tr><tr key=01005><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> color</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>中文颜色</span></td><td key=5></td></tr><tr key=01006><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_design</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>是否自主设计1:是;0:否</span></td><td key=5><p key=2><span style="font-weight: '700'">版本: </span><span>int32</span></p></td></tr><tr key=01007><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> weight</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>重量</span></td><td key=5><p key=2><span style="font-weight: '700'">版本: </span><span>int32</span></p></td></tr><tr key=01008><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> insert_time</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>添加时间</span></td><td key=5></td></tr><tr key=0101><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> product_image</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=01010><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> id</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>imageid</span></td><td key=5></td></tr><tr key=01011><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> image_url</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>imageurl</span></td><td key=5></td></tr><tr key=01012><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> image_title</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>imagetitle</span></td><td key=5></td></tr><tr key=01013><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> sort</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>排序</span></td><td key=5></td></tr><tr key=01014><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> image_type</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>imagetype</span></td><td key=5></td></tr><tr key=01015><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> image_links</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=010150><td key=0><span style="padding-left: 80px"><span style="color: #8c8a8a">├─</span> image_medium_url</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>中等图图片链接</span></td><td key=5></td></tr><tr key=010151><td key=0><span style="padding-left: 80px"><span style="color: #8c8a8a">├─</span> image_small_url</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>小图链接</span></td><td key=5></td></tr><tr key=010152><td key=0><span style="padding-left: 80px"><span style="color: #8c8a8a">├─</span> image_url</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>原图链接</span></td><td key=5></td></tr><tr key=0102><td key=0><span style="padding-left: 40px"><span style="color: #8c8a8a">├─</span> product_category</span></td><td key=1><span>object</span></td><td key=2>非必须</td><td key=3></td><td key=4><span></span></td><td key=5></td></tr><tr key=01020><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> id</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>categoryid</span></td><td key=5></td></tr><tr key=01021><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> name</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>分类名称</span></td><td key=5></td></tr><tr key=01022><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> parent_id</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>父分类id</span></td><td key=5></td></tr><tr key=01023><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> product_type_id</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>产品类型id</span></td><td key=5></td></tr><tr key=01024><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_return</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>是否支持退换</span></td><td key=5></td></tr><tr key=01025><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_allow_sub_category</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>是否允许子分类</span></td><td key=5></td></tr><tr key=01026><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_available</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>是否可用</span></td><td key=5></td></tr><tr key=01027><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> insert_time</span></td><td key=1><span>string</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>插入时间</span></td><td key=5></td></tr><tr key=01028><td key=0><span style="padding-left: 60px"><span style="color: #8c8a8a">├─</span> is_del</span></td><td key=1><span>integer</span></td><td key=2>非必须</td><td key=3></td><td key=4><span>是否删除</span></td><td key=5></td></tr><tr key=02><td key=0><span style="padding-left: 0px"><span style="color: #8c8a8a"></span> msg</span></td><td key=1><span>string</span></td><td key=2>必须</td><td key=3></td><td key=4><span>错误描述</span></td><td key=5></td></tr>
               </tbody>
              </table>
            