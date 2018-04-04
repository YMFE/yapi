
 <h1 class="curproject-name"> email_test </h1> 
 


# %u516C%u5171%u5206%u7C7B
[TOC]


# tag
[TOC]


## %28tag%29%u6839%u636E%u6709%u89C4%u5219%u7684%u6807%u7B7E%u5217%u8868%u6807%u7B7E%0A%3Ca%20id%3D%28tag%29%u6839%u636E%u6709%u89C4%u5219%u7684%u6807%u7B7E%u5217%u8868%u6807%u7B7E%3E%20%3C/a%3E
[TOC]

### 基本信息

**Path：** /api/tag/get_rule_tag_list22

**Method：** POST

**接口描述：**
<p>(tag)根据有规则的标签列表标签qqqwwwwww他吞吞吐吐vvvvvvvv</p>
<p>ddd</p>


### 请求参数
**Headers**

| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| Content-Type  |  application/json | 是  |   |   |
| SiteUID  |   | 是  |   |   |
| ClientId  |   | 是  |   |   |
| Token  |   | 是  |   |  请求令牌 |
**Query**

| 参数名称  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ |
| page_num | 是  |   |  页码数 |
| page_size | 是  |   |  一页数据数量 |
**Body**

```javascript
{
   "id": "@integer",
   "name1": "@string",
   "tag_group_id": "@integer",
   "type": "@integer",
   "type1": "@integer",
   "type3": "@integer",
   "type4": "@email"
}
```
### 返回数据

```javascript
{
   "code": "@string",
   "info": {
      "data": [
         {
            "id_11": "@integer",
            "name": "@string",
            "weight": "@integer",
            "is_show": "@integer",
            "type": "@integer",
            "is_automatic_update": "@integer",
            "product_count": "@integer",
            "insert_time": "@string",
            "tag_group_1": [
               {
                  "id": "@integer",
                  "name": "@string",
                  "insert_time": "@string"
               }
            ]
         }
      ],
      "meta": {
         "count": "@integer"
      }
   },
   "msg": "@string"
}
```
# test
[TOC]

