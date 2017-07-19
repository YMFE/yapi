import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu} from 'antd'
import { logoutActions, loginTypeAction} from '../../actions/login'

const { Header } = Layout;
const ToolUser = (props)=> (
  <ul>
    <li><Icon type="question-circle-o" />帮助</li>
    <li><Link to="/user" onClick={props.relieveLink}><Icon type="user" />{ props.user }</Link></li>
    <li><Link to="/News" onClick={props.relieveLink}><Icon type="mail" />{ props.msg }</Link></li>
    <li onClick={props.logout}>退出</li>
  </ul>
);
ToolUser.propTypes={
  user:PropTypes.string,
  msg:PropTypes.string,
  relieveLink:PropTypes.func,
  logout:PropTypes.func
};

const ToolGuest = ()=> (
  <ul>
    <li><Icon type="question-circle-o" />帮助</li>
  </ul>
);
ToolGuest.propTypes={
  onLogin:PropTypes.func,
  onReg:PropTypes.func
}

class HeaderCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current : window.location.hash.split("#")[1]
    }
  }
  static propTypes ={
    user: PropTypes.string,
    msg: PropTypes.string,
    login:PropTypes.bool,
    relieveLink:PropTypes.func,
    logoutActions:PropTypes.func,
    loginTypeAction:PropTypes.func
  }
  linkTo = (e) =>{
    this.setState({
      current : e.key
    })
  }
  relieveLink = () => {
    this.setState({
      current : ""
    })
  }
  logout = (e) => {
    e.preventDefault();
    this.props.logoutActions();
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
                onClick={this.linkTo}
                selectedKeys={[this.state.current]}
              >
                <Menu.Item key="/">
                  <Link to="/">首页</Link>
                </Menu.Item>
                <Menu.Item key="/ProjectGroups">
                  <Link to="/ProjectGroups">分组</Link>
                </Menu.Item>
                <Menu.Item key="/Interface">
                  <Link to="/Interface">接口</Link>
                </Menu.Item>
              </Menu>
              <div className="user-toolbar">
                {login?<ToolUser user={user} msg={msg} relieveLink={this.relieveLink} logout={this.logout}/>:<ToolGuest/>}
              </div>
            </div>
          </Header>
        </Layout>
      </acticle>
    )
  }
}

export default connect(
  (state) => {
    return{
      user: state.login.userName,
      msg: null,
      login:state.login.isLogin
    }
  },
  {
    loginTypeAction,
    logoutActions
  }
)(HeaderCom)

