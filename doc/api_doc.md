### 1.User
- /user/get //获取用户个人信息
- /user/list //获取用户列表，需要提供分页功能
- /user/del //删除用户
- /user/up  //更新用户个人信息
- /uesr/login //登录
- /user/reg //注册
- /user/login/status //获取用户登录状态

### 2.Group
- /group/list //获取项目分组列表
- /group/add //添加
- /group/up //更新
- /group/del //删除

### 3.Project
- /project/list/:group_id
- /project/add //添加项目
- /project/up //编辑项目
- /project/del //删除项目
- /project/add_member //添加项目成员
- /project/del_member //删除项目成员
- /project/get //获取一个项目详细信息



### 4.interface
- /interface/list/:project_id
- /interface/add
- /interface/up
- /interface/del
- /interface/mock //执行用户定义的mock，返回mock结果

### 5. mock服务器
用户修改host指到yapi服务器，yapi服务器收到请求后根据domain/basepath 找到相对应的项目，根据req信息，找到对应的接口，执行用户定义的mock数据，返回给用户相应的结果
