import React from 'react'
import { Menu, Button, Input, Icon, Tag } from 'antd';
export default () => {
  return <div>
    <div className="interface-filter">
      <Input placeholder="Filter by name" style={{width:"70%"}} />
      <Tag color="#108ee9" style={{marginLeft:"15px"}} ><Icon type="plus" /></Tag>
    </div>
    <Menu className="interface-list">
      <Menu.Item><Button className="btn-http" type="primary">POST  </Button>获取用过个人信息</Menu.Item>

      <Menu.Item><Button className="btn-http btn-http-get" type="primary">GET</Button>获取用过个人信息</Menu.Item>

    </Menu>
  </div>

}