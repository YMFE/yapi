import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import loginTypeAction from '../../actions/login';

const ToolUser = (props)=> (
  <ul>
    <li><Icon type="user" />{ props.user }</li>
    <li>消息{ props.msg.length }</li>
    <li>退出</li>
  </ul>
);
ToolUser.propTypes={
  user:PropTypes.string,
  msg:PropTypes.string
};

const ToolGuest = (props)=> (
  <ul>
    <li onClick={e => props.onLogin(e)}><Link to={`/Login`}>登录</Link></li>
    <li onClick={e => props.onReg(e)}><Link to={`/Login`}>注册</Link></li>
  </ul>
);
ToolGuest.propTypes={
  onLogin:PropTypes.func,
  onReg:PropTypes.func
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state={
      guestToolShow:true
    }
  }
  handleLogin = (e) => {
    e.preventDefault();
    this.props.loginTypeAction("1");
    this.setState({
      guestToolShow:false
    })
  }
  handleReg = (e)=>{
    e.preventDefault();
    this.props.loginTypeAction("2");
    this.setState({
      guestToolShow:false
    })
  }
  hideGuestTool = (e)=>{
    e.preventDefault();
    this.setState({
      guestToolShow:true
    })
  }
  render () {
    const { login, user, msg } = this.props;
    return (
      <acticle className="header-box">
        <div className="content">
          <h1>YAPI</h1>
          <ul className="nav-toolbar">
            <li onClick={this.hideGuestTool}>
              <Link to={`/ProjectGroups`}>分组</Link>
            </li>
            <li onClick={this.hideGuestTool}>
              <a>我的项目</a>
            </li>
            <li onClick={this.hideGuestTool}>
              <a>文档</a>
            </li>
          </ul>
          <ul className="user-toolbar">
            {login?<ToolUser user={user} msg={msg}/>:(this.state.guestToolShow?<ToolGuest onLogin={this.handleLogin} onReg={this.handleReg}/>:'')}
          </ul>
        </div>
      </acticle>
    )
  }
}

Header.propTypes={
  user: PropTypes.string,
  msg: PropTypes.string,
  login:PropTypes.bool,
  loginTypeAction:PropTypes.func
};

export default connect(
  (state) => {
    return{
      user: state.login.userName,
      msg: "暂无消息",
      login:state.login.isLogin
    }
  },
  {loginTypeAction}
)(Header)

