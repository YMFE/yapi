import React, { Component } from 'react'
import { Row, Col, Input, Button, Select, message, Upload} from 'antd'
import axios from 'axios';
import {formatTime} from '../../common.js'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

@connect(state=>{
  console.log(state);
  return {
    curUid: state.user.uid,
    userType: state.user.type,
    curRole: state.user.role
  }
},{

})

class Profile extends Component {

  static propTypes = {
    match: PropTypes.object,
    curUid: PropTypes.number,
    userType: PropTypes.string,
    curRole: PropTypes.string
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
    this.getUserInfo(uid)
  }

  handleEdit = (key, val) => {
    var s = {};
    s[key] = val;
    this.setState(s)
  }

  getUserInfo = (id) => {
    var _this = this;
    axios.get('/api/user/find?id=' + id).then((res) => {
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

    axios.post('/api/user/update', params).then( (res)=>{
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


    axios.post('/api/user/change_password', params).then( (res)=>{
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
    let roles = { admin: '管理员', member: '会员' };
    let userType = "";
    if(this.props.userType === "third"){
      userType = false;
    }else if(this.props.userType === "site"){
      userType = true;
    }else{
      userType = false;
    }
    if (this.state.usernameEdit === false) {
      let btn = "";
      if(userType){
        if(userinfo.uid === this.props.curUid){//本人
          btn = <Button  icon="edit" onClick={() => { this.handleEdit('usernameEdit', true) }}>修改</Button>;
        }else{
          
          if(this.props.curRole === "admin"){
            btn = <Button  icon="edit" onClick={() => { this.handleEdit('usernameEdit', true) }}>修改</Button>;
          }else{
            btn = "";
          }
        }
      }else{
        // if(userinfo.uid === this.props.curUid){//本人
        //   btn = <Button  icon="edit" onClick={() => { this.handleEdit('usernameEdit', true) }}>修改</Button>;
        // }else{
        btn = "";
        // }
      }
      userNameEditHtml = <div >
        <span className="text">{userinfo.username}</span>&nbsp;&nbsp;
        {/*<span className="text-button"  onClick={() => { this.handleEdit('usernameEdit', true) }}><Icon type="edit" />修改</span>*/}
        {
          btn
        }
      </div>
    } else {
      userNameEditHtml = <div>
        <Input value={_userinfo.username} name="username" onChange={this.changeUserinfo} placeholder="用户名"  />
        <ButtonGroup className="edit-buttons" >
          <Button  className="edit-button" onClick={() => { this.handleEdit('usernameEdit', false) }} >取消</Button>
          <Button  className="edit-button" onClick={ () => { this.updateUserinfo('username')} } type="primary">确定</Button>
        </ButtonGroup>
      </div>
    }

    if (this.state.emailEdit === false) {
      let btn = "";
      if(userType){
        if(userinfo.uid === this.props.curUid){//本人
          btn = <Button  icon="edit" onClick={() => { this.handleEdit('emailEdit', true) }}>修改</Button>
        }else{
          if(this.props.curRole === "admin"){
            btn = <Button  icon="edit" onClick={() => { this.handleEdit('emailEdit', true) }}>修改</Button>
          }else{
            btn = "";
          }
        }
      }else{
        if(userinfo.uid === this.props.curUid){//本人
          // btn = <Button  icon="edit" onClick={() => { this.handleEdit('emailEdit', true) }}>修改</Button>
        }else{
          btn = "";
        }
      }
      emailEditHtml = <div >
        <span className="text">{userinfo.email}</span>&nbsp;&nbsp;
        {/*<span className="text-button" onClick={() => { this.handleEdit('emailEdit', true) }} ><Icon type="edit" />修改</span>*/}
        {btn}
      </div>
    } else {
      emailEditHtml = <div>
        <Input placeholder="Email" value={_userinfo.email} name="email" onChange={this.changeUserinfo} />
        <ButtonGroup className="edit-buttons" >
          <Button  className="edit-button" onClick={() => { this.handleEdit('emailEdit', false) }} >取消</Button>
          <Button  className="edit-button" type="primary" onClick={ () => { this.updateUserinfo('email')} }>确定</Button>
        </ButtonGroup>
      </div>
    }

    if (this.state.roleEdit === false) {
      let btn = "";
      roleEditHtml = <div>
        <span className="text">{roles[userinfo.role]}</span>&nbsp;&nbsp;
        {btn}
      </div>
    } else {
      roleEditHtml = <Select defaultValue={_userinfo.role} onChange={ this.changeRole} style={{ width: 150 }} >
        <Option value="admin">管理员</Option>
        <Option value="member">会员</Option>
      </Select>
    }

    if (this.state.secureEdit === false) {
      let btn = "";
      if(this.props.curRole === "admin" && userType){
        btn = <Button  icon="edit" onClick={() => { this.handleEdit('secureEdit', true) }}>修改</Button>
      }
      secureEditHtml = btn;
    } else {
      secureEditHtml = <div>
        <Input style={{display: this.props.curRole === 'admin' ? 'none': ''}} placeholder="旧的密码" type="password" name="old_password" id="old_password" />
        <Input placeholder="新的密码" type="password" name="password" id="password" />
        <Input placeholder="确认密码" type="password" name="verify_pass" id="verify_pass" />
        <ButtonGroup className="edit-buttons" >
          <Button  className="edit-button" onClick={() => { this.handleEdit('secureEdit', false) }}>取消</Button>
          <Button  className="edit-button" onClick={this.updatePassword} type="primary">确定</Button>
        </ButtonGroup>
      </div>
    }

    return <div className="user-profile">
      <Row className="user-item" type="flex" justify="start">
        <Col span={24}>{userinfo.uid === this.props.curUid?<AvatarUpload uid={userinfo.uid}>点击上传头像</AvatarUpload>:<img className = "avatarImg" src = {`/api/user/avatar?uid=${userinfo.uid}`} />}</Col>
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
      <Row className="user-item" style={{display: this.props.curRole === 'admin'? '': 'none'}} type="flex" justify="start">
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

      {(this.props.curRole === "admin" && userType)?<Row className="user-item" type="flex" justify="start">
        <Col span={4}>密码</Col>
        <Col span={12}>
          {secureEditHtml}
        </Col>
      </Row>:""}
    </div>
  }
}



class AvatarUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: ""
    }
  }
  static propTypes = {
    uid: PropTypes.number
  }
  uploadAvatar(basecode){
    axios.post("/api/user/upload_avatar",{basecode: basecode}).then(()=>{
      this.setState({ imageUrl: basecode });
    }).catch((e)=>{
      console.log(e);
    })
  }
  handleChange(info){
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, basecode=>{this.uploadAvatar(basecode)});
    }
  }
  render() {
    let imageUrl = this.state.imageUrl?this.state.imageUrl:`/api/user/avatar?uid=${this.props.uid}`;
    // console.log(this.props.uid);
    
    return <div className="avatar-box">
      <Upload
        className="avatar-uploader"
        name="basecode"
        showUploadList={false}
        action="/api/user/upload_avatar"
        beforeUpload={beforeUpload}
        onChange={this.handleChange.bind(this)} >
        {/*<Avatar size="large" src={imageUrl}  />*/}
        <img className = "avatar" src = {imageUrl} />
      </Upload>
      <span className="avatarChange">点击头像更换</span>
    </div>
  }
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  if (!isJPG && !isPNG) {
    message.error('图片的格式只能为 jpg、png！');
  }
  const isLt2M = file.size / 1024 / 1024 < 0.2;
  if (!isLt2M) {
    message.error('图片必须小于 200kb!');
  }
  
  return (isPNG||isJPG) && isLt2M;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


export default Profile
