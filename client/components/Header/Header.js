import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu, Dropdown, message } from 'antd'
import { checkLoginState, logoutActions, loginTypeAction} from '../../actions/login'
import { changeMenuItem } from '../../actions/menu'
import { withRouter } from 'react-router';
import Srch from './Search/Search'
const { Header } = Layout;

const MenuUser = (props) => (
  <Menu
  style={{
    "boxShadow":"0 1px 6px rgba(0, 0, 0, 0.3)"
  }}
  >
    <Menu.Item key="0">
      <Link to={`/user/profile/${props.uid}`} onClick={props.relieveLink}><Icon type="user"/>个人中心</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <a onClick={props.logout}><Icon type="logout" />退出</a>
    </Menu.Item>
  </Menu>
);
MenuUser.propTypes={
  user:PropTypes.string,
  msg:PropTypes.string,
  uid: PropTypes.number,
  relieveLink:PropTypes.func,
  logout:PropTypes.func
}

const ToolUser = (props)=> (
  <ul>
    <li className="toolbar-li">
      <Srch groupList={props.groupList}/>
    </li>
    <li className="toolbar-li">
      <Dropdown
        placement = "bottomRight"
        overlay={
          <MenuUser
            user={props.user}
            msg={props.msg}
            uid={props.uid}
            relieveLink={props.relieveLink}
            logout={props.logout}
          />
      }>
        <a className="dropdown-link">
          <Icon type="solution" />
        </a>
      </Dropdown>
    </li>
  </ul>
);
ToolUser.propTypes={
  user:PropTypes.string,
  msg:PropTypes.string,
  uid: PropTypes.number,
  relieveLink:PropTypes.func,
  logout:PropTypes.func,
  groupList: PropTypes.array
};



@connect(
  (state) => {
    return{
      user: state.login.userName,
      uid: state.login.uid,
      msg: null,
      login:state.login.isLogin,
      curKey: state.menu.curKey
    }
  },
  {
    loginTypeAction,
    logoutActions,
    checkLoginState,
    changeMenuItem
  }
)
@withRouter
export default class HeaderCom extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes ={
    router: PropTypes.object,
    user: PropTypes.string,
    msg: PropTypes.string,
    uid: PropTypes.number,
    login:PropTypes.bool,
    curKey:PropTypes.string,
    relieveLink:PropTypes.func,
    logoutActions:PropTypes.func,
    checkLoginState:PropTypes.func,
    loginTypeAction:PropTypes.func,
    changeMenuItem:PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object
  }
  linkTo = (e) =>{
    this.props.changeMenuItem(e.key);
    if(!this.props.login){
      message.info('请先登录',1);
    }
  }
  relieveLink = () => {
    this.props.changeMenuItem("");
  }
  logout = (e) => {
    e.preventDefault();
    this.props.logoutActions().then((res) => {
      if (res.payload.data.errcode == 0) {
        this.props.history.push('/');
        this.props.changeMenuItem("/");
        message.success('退出成功! ');
      } else {
        message.error(res.payload.data.errmsg);
      }
    }).catch((err) => {
      message.error(err);
    });
  }
  handleLogin = (e) => {
    e.preventDefault();
    this.props.loginTypeAction("1");
  }
  handleReg = (e)=>{
    e.preventDefault();
    this.props.loginTypeAction("2");
  }
  checkLoginState = () => {
    this.props.checkLoginState.then((res) => {
      if (res.payload.data.errcode !== 0) {
        this.props.history.push('/');
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  render () {
    const { login, user, msg, uid, curKey } = this.props;
    const headerImgStyle = login?{}:{
      'background': 'url(./image/header-bg-img.jpg) no-repeat',
      'backgroundSize':'100% 100%'
    };
    const headerShadeStyle = login? {
      'padding':'0'
    }: {
      'background': 'linear-gradient(to bottom,rgba(0,0,0,0.6),rgba(0,0,0,0.5))',
      'padding':'0'
    };
    return (
      <acticle className={`header-box`} style={headerImgStyle}>
        <Header style={headerShadeStyle}>
          <div className="content">
            <div className="logo">
              <Link to="/" onClick={this.relieveLink}>YAPI</Link>
            </div>
            <Menu
              mode="horizontal"
              className="nav-toolbar"
              theme="dark"
              style={{
                lineHeight : '.64rem',
                backgroundColor:"transparent",
                borderColor:"transparent"
              }}
              onClick={this.linkTo}
              selectedKeys={[curKey]}
            >
              <Menu.Item key="/group">
                <Link to="/group">项目广场</Link>
              </Menu.Item>
            </Menu>
            <div className="user-toolbar">
              {login?
                <ToolUser
                  user = { user }
                  msg = { msg }
                  uid = { uid }
                  relieveLink = { this.relieveLink }
                  logout = { this.logout }
                />
                :""}
            </div>
          </div>
        </Header>
      </acticle>
    )
  }
}
