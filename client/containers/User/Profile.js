import React, { Component } from 'react'
import { Row, Col, Icon, Input, Button, Select, message } from 'antd'
import axios from 'axios';
import { connect } from 'react-redux'
import {formatTime} from '../../common.js'
import {
  changeCurUid
} from '../../actions/user.js'
import PropTypes from 'prop-types'

@connect(
  state => ({
    curUid: state.user.curUid
  }),
  {
    changeCurUid
  }
)

class Profile extends Component {

  static propTypes = {
    curUid: PropTypes.string,
    changeCurUid: PropTypes.func,
    match: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      usernameEdit: false,
      emailEdit: false,
      secureEdit: false,
      roleEdit: false,
      userinfo: {

      }
    }
    
  }

  componentDidMount(){
    const uid = this.props.match.params.uid;
    this.props.changeCurUid(uid)
    this.getUserInfo(uid)
  }

  handleEdit = (key, val) => {
    var s = {};
    s[key] = val;
    this.setState(s)
  }

  getUserInfo = (id) => {
    var _this = this;
    axios.get('/user/find?id=' + id).then((res) => {
      _this.setState({
        userinfo: res.data.data,
        _userinfo: res.data.data
      })
    })
  }

  updateUserinfo = (name) =>{
    var state = this.state;
    let value = this.state._userinfo[name];
    let params = {uid: state.userinfo.uid}
    params[name] = value;
    
    axios.post('/user/update', params).then( (res)=>{
      let data = res.data;
      if(data.errcode === 0){
        let userinfo = this.state.userinfo;
        userinfo[name] = value;
        this.setState({
          userinfo: userinfo
        })

        this.handleEdit(name + 'Edit', false)
        message.success('更新用户信息成功');
      }else{
        message.error(data.errmsg)
      }
      
    }, (err) => {
      message.error(err.message)
    } )
  }

  changeUserinfo = (e) =>{
    let dom = e.target;
    let name = dom.getAttribute("name");
    let value = dom.value;
    let userinfo = this.state._userinfo;
    userinfo[name] = value;
    this.setState({
      _userinfo: userinfo
    })
  }

  changeRole = (val) =>{
    let userinfo = this.state.userinfo;
    userinfo.role = val;
    this.setState({
      _userinfo: userinfo
    })
    this.updateUserinfo('role');
  }

  updatePassword = () =>{
    let old_password = document.getElementById('old_password').value;
    let password = document.getElementById('password').value;
    let verify_pass = document.getElementById('verify_pass').value;
    if(password != verify_pass){
      return message.error('两次输入的密码不一样');
    }
    let params = {
      uid: this.state.userinfo.uid,
      password: password,
      old_password: old_password
    }
    
    
    axios.post('/user/change_password', params).then( (res)=>{
      let data = res.data;
      if(data.errcode === 0){
        this.handleEdit('secureEdit', false)
        message.success('修改密码成功');
      }else{
        message.error(data.errmsg)
      }
      
    }, (err) => {
      message.error(err.message)
    } )
    
  }

  render() {
    let ButtonGroup = Button.Group;
    let userNameEditHtml, emailEditHtml, secureEditHtml, roleEditHtml;
    const Option = Select.Option;
    let userinfo = this.state.userinfo;
    let _userinfo = this.state._userinfo;
    let roles = { admin: '管理员', member: '会员' }
    if (this.state.usernameEdit === false) {
      userNameEditHtml = <div >
        <span className="text">{userinfo.username}</span>&nbsp;&nbsp;
        <span className="text-button"  onClick={() => { this.handleEdit('usernameEdit', true) }}><Icon type="edit" />修改</span>
      </div>
    } else {
      userNameEditHtml = <div>
        <Input value={_userinfo.username} name="username" onChange={this.changeUserinfo} placeholder="用户名"  />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => { this.handleEdit('usernameEdit', false) }} >Cancel</Button>
          <Button className="edit-button" onClick={ () => { this.updateUserinfo('username')} } type="primary">OK</Button>
        </ButtonGroup>
      </div>
    }

    if (this.state.emailEdit === false) {
      emailEditHtml = <div >
        <span className="text">{userinfo.email}</span>&nbsp;&nbsp;
        <span className="text-button" onClick={() => { this.handleEdit('emailEdit', true) }} ><Icon type="edit" />修改</span>
      </div>
    } else {
      emailEditHtml = <div>
        <Input placeholder="Email" value={_userinfo.email} name="email" onChange={this.changeUserinfo} />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => { this.handleEdit('emailEdit', false) }} >Cancel</Button>
          <Button className="edit-button" type="primary" onClick={ () => { this.updateUserinfo('email')} }>OK</Button>
        </ButtonGroup>
      </div>
    }

    if (this.state.roleEdit === false) {
      roleEditHtml = <div>
        <span className="text">{roles[userinfo.role]}</span>&nbsp;&nbsp;
        <span className="text-button" onClick={() => { this.handleEdit('roleEdit', true) }} ><Icon type="edit" />修改</span>
      </div>
    } else {
      roleEditHtml = <Select defaultValue={_userinfo.role} onChange={ this.changeRole} style={{ width: 150 }} >
        <Option value="admin">管理员</Option>
        <Option value="member">会员</Option>

      </Select>
    }

    if (this.state.secureEdit === false) {
      secureEditHtml = <Button type="primary" onClick={() => { this.handleEdit('secureEdit', true) }}>密码修改</Button>
    } else {
      secureEditHtml = <div>
        <Input style={{display: this.state.userinfo.role === 'admin' ? 'none': ''}} placeholder="旧的密码" type="password" name="old_password" id="old_password" />
        <Input placeholder="新的密码" type="password" name="password" id="password" />
        <Input placeholder="确认密码" type="password" name="verify_pass" id="verify_pass" />
        <ButtonGroup className="edit-buttons" >
          <Button className="edit-button" onClick={() => { this.handleEdit('secureEdit', false) }}>Cancel</Button>
          <Button className="edit-button" onClick={this.updatePassword} type="primary">OK</Button>
        </ButtonGroup>
      </div>
    }


    return <div className="user-profile">
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>用户id</Col>
        <Col span={12}>
          {userinfo.uid}
        </Col>
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>用户名</Col>
        <Col span={12}>
          {userNameEditHtml}
        </Col>
      </Row>
      <Row className="user-item"  type="flex" justify="start">
        <Col span={4}>Email</Col>
        <Col span={12}>
          {emailEditHtml}
        </Col>
      </Row>
      <Row className="user-item" style={{display: this.state.userinfo.role === 'admin'? '': 'none'}} type="flex" justify="start">
        <Col span={4}>角色</Col>
        <Col span={12}>
          {roleEditHtml}
        </Col>
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>创建账号时间</Col>
        <Col span={12}>
          {formatTime(userinfo.add_time)}
        </Col>
      </Row>
      <Row className="user-item" type="flex" justify="start">
        <Col span={4}>更新账号时间</Col>
        <Col span={12}>
          {formatTime(userinfo.up_time)}
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
