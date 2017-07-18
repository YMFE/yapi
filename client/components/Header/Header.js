import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu} from 'antd'
import loginTypeAction from '../../actions/login';

const { Header } = Layout;
const ToolUser = (props)=> (
  <ul>
    <li><Icon type="question-circle-o" />帮助</li>
    <li><Icon type="user" />{ props.user }</li>
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

class HeaderCom extends Component {
  constructor(props) {
    super(props);
  }
  handleLogin = (e) => {
    e.preventDefault();
    this.props.loginTypeAction("1");
  }
  handleReg = (e)=>{
    e.preventDefault();
    this.props.loginTypeAction("2");
  }
  render () {
    const { login, user, msg } = this.props;
    return (
      <acticle className="header-box">
        <Layout className="'layout">
          <Header>
            <div className="content">
              <div className="logo">
                YAPI
              </div>
              <Menu
                mode="horizontal"
                className="nav-toolbar"
                theme="dark"
                style={{ lineHeight : '.64rem'}}
                defaultSelectedKeys={['1']}
              >
                <Menu.Item key="1">
                  <Link to={`/`}>首页</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to={`/ProjectGroups`}>分组</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  文档
                </Menu.Item>
              </Menu>
              <div className="user-toolbar">
                {login?<ToolUser user={user} msg={msg}/>:''}
              </div>
            </div>
          </Header>
        </Layout>
      </acticle>
    )
  }
}

HeaderCom.propTypes={
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
)(HeaderCom)

