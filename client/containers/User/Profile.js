import React, { Component } from 'react'
import { Row, Col, Icon , Input, Button, Select} from 'antd'
import axios from 'axios';

class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      usernameEdit: false,
      emailEdit: false,
      secureEdit: false,
      roleEdit: false
    }
    this.getUserInfo(101)
  }

  handleEdit = (key, val) =>{
    var s = {};
    s[key] = val ;
    this.setState(s)
  }

  getUserInfo = (id) => {
    axios.get('/user/find', {
      id: id 
    }).then((res) =>{
      console.log(res)
    })
  }

  render() {
    let ButtonGroup = Button.Group;
    let userNameEditHtml, emailEditHtml,secureEditHtml, roleEditHtml;
    const Option = Select.Option;
    if(this.state.usernameEdit === false){
      userNameEditHtml = <div >
        <span className="text">xiaoming</span>&nbsp;&nbsp; 
        <span className="text-button" onClick={() => {this.handleEdit( 'usernameEdit', true)}}><Icon type="edit"/>修改</span>
      </div>
    }else{
      userNameEditHtml = <div>
        <Input placeholder="用户名"  />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => {this.handleEdit( 'usernameEdit', false)}} >Cancel</Button>
          <Button  className="edit-button" type="primary">OK</Button>
        </ButtonGroup>
      </div>
    }

    if(this.state.emailEdit === false){
      emailEditHtml = <div >
        <span className="text">abc@qq.com</span>&nbsp;&nbsp; 
        <span className="text-button" onClick={() => {this.handleEdit( 'emailEdit', true)}} ><Icon type="edit"/>修改</span>
      </div>
    }else{
      emailEditHtml = <div>
        <Input placeholder="Email"  />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => {this.handleEdit( 'emailEdit', false)}} >Cancel</Button>
          <Button  className="edit-button" type="primary">OK</Button>
        </ButtonGroup>
      </div>
    }

    if(this.state.roleEdit === true){
      roleEditHtml = <div>
        <span className="text">管理员</span>&nbsp;&nbsp; 
        <span className="text-button" onClick={() => {this.handleEdit( 'roleEdit', true)}} ><Icon type="edit"/>修改</span>
      </div>
    }else{
      roleEditHtml = <Select defaultValue="admin" style={{ width: 150 }} >
        <Option value="admin">管理员</Option>
        <Option value="member">会员</Option>
        
      </Select>
    }   

    if(this.state.secureEdit === false){
      secureEditHtml = <Button  type="primary" onClick={() => {this.handleEdit( 'secureEdit', true)}}>密码修改</Button>
    }else{
      secureEditHtml = <div>
        <Input placeholder="旧的密码"  />
        <Input placeholder="新的密码"  />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => {this.handleEdit( 'secureEdit', false)}}>Cancel</Button>
          <Button  className="edit-button" type="primary">OK</Button>
        </ButtonGroup>
      </div>
    }


    return <div className="user-profile">
      <Row className="user-item" type="flex"  justify="start">
        <Col span={4}>用户名</Col>
        <Col span={12}>
          {userNameEditHtml}
        </Col>
        
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>Email</Col>
        <Col span={12}>
          {emailEditHtml}
        </Col>
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>角色</Col>
        <Col span={12}>
          {roleEditHtml}
        </Col>
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>安全</Col>
        <Col span={12}>
          {secureEditHtml}
        </Col>
      </Row>
    </div>
  }
}

export default Profile
