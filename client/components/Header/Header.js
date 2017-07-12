import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'

const ToolUser = (props)=> (
  <ul>
    <li><Icon type="user" />{ props.user }</li>
    <li>消息{ props.msg.length }</li>
    <li>退出</li>
  </ul>
);
ToolUser.propTypes={
  user:PropTypes.string.isRequired,
  msg:PropTypes.string.isRequired
};

const ToolGuest = ()=>
  (
    <ul>
      <li><Link to={`/Login`}>登录</Link></li>
      <li>注册</li>
    </ul>
  );

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    const { login, user, msg } = this.props;
    return (
      <acticle className="header-box">
        <div className="content">
          <h1>YAPI</h1>
          <ul className="nav-toolbar">
            <li>
              <Link to={`/ProjectGroups`}>分组</Link>
            </li>
            <li>
              <a>我的项目</a>
            </li>
            <li>
              <a>文档</a>
            </li>
          </ul>
          <ul className="user-toolbar">
            {login?<ToolUser user={user} msg={msg}/>:<ToolGuest/>}
          </ul>

        </div>
      </acticle>
    )
  }
}

Header.propTypes={
  user: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  login:PropTypes.bool.isRequired
};

export default connect(
  () => ({
    user: "王亮",
    msg: "暂无消息",
    login:false
  })
)(Header)

