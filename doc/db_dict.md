### 数据库字典
### 数据库基于mongodb
#### 1.User数据表，表名:user
```json
{
    _id:      (int)
    username: (string)
    password: (sha1)
    passsalt: (string)
    email   : (string)
    role    : (string)
    add_time: (int)
    up_time: (int)
}
````

#### 2.Project 数据表，表名:project
```json
{
    _id:          (int)
    uid :         (int)
    name:         (string)
    basepath:     (string)
    desc:         (string)
    group_id:     (int)
    members: [
        ...  //成员uid
    ]
    prd_host: (string)//网站上线的domain,可用来获取mock数据
    env:(object){
        'local环境' : 'http://127.0.0.1'
    }
    add_time:     (int)
    up_time:      (int)
}
````

#### 3.api 数据表，表名:interface
```json
{
    _id:   (int)
    uid:      (int)   //负责人uid
    path:     (string)
    group_id: (int)
    status:   (int)
    desc  :   (string)
    add_time: (int)
    up_time : (int)
    req_headers:(Object){
        "header_name":(Object){
            default_value: (string),
            desc:          (string),
            mock:          (string)
        }
    }
    req_params_type: (form|raw)
    req_params: (Object){
        "key" : (Object){
            default_value: (string),
            desc:          (string),
            mock:          (string)
        }
    }
    res_header: (Object){
        "header_name":(Object){
            default_value: (string),
            desc:          (string),
            mock:          (string)
        }
    }
    res_body_type: (text|json),
    res_body: (Object){
        "key":(Object){
            default_value: (string),
            desc:          (string),
            mock:          (string)
        }
    }
}

```

#### 4.项目分组,表名: group
```json
{
    _id:    (int),
    uid:    (int),
    group_name:  (string),
    group_desc:  (string),
    add_time: (int),
    up_time: (int)
}
```
