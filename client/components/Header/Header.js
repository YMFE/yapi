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
  <Menu>
    <Menu.Item key="0">
      <Link to={`/profile/${props.uid}`} onClick={props.relieveLink}><Icon type="user" />{ props.user }</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/news" onClick={props.relieveLink}><Icon type="mail" />{ props.msg }</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <a onClick={props.logout}>退出</a>
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
      <Dropdown overlay={
        <MenuUser
          user={props.user}
          msg={props.msg}
          uid={props.uid}
          relieveLink={props.relieveLink}
          logout={props.logout}
        />
      }>
        <a className="dropdown-link">
          <Icon type="user"/>
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


@withRouter
class HeaderCom extends Component {
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
    // this.props.curKey = e.key;
    // this.setState({
    //   current : e.key
    // })
  }
  relieveLink = () => {
    this.props.changeMenuItem("");
    // this.setState({
    //   current : ""
    // })
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
                selectedKeys={[curKey]}
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
                <Menu.Item key="/doc">
                  <a>文档</a>
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
        </Layout>
      </acticle>
    )
  }
}

export default connect(
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
)(HeaderCom)
