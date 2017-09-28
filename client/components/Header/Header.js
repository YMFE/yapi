import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu, Dropdown, message, Tooltip, Avatar, Popover } from 'antd'
import { checkLoginState, logoutActions, loginTypeAction} from '../../reducer/modules/user'
import { changeMenuItem } from '../../reducer/modules/menu'
import { withRouter } from 'react-router';
import Srch from './Search/Search'
const { Header } = Layout;
import { logoSVG } from '../../common.js';
import Breadcrumb from '../Breadcrumb/Breadcrumb.js'
import GuideBtns from '../GuideBtns/GuideBtns.js';

const MenuUser = (props) => (
  <Menu theme="dark" className="user-menu" >
    <Menu.Item style={{"background":"#32363a",color:"white"}} key="0">
      <Link style={{color:"white"}} to={`/user/profile/${props.uid}`} onClick={props.relieveLink}><Icon type="user"/>个人中心</Link>
    </Menu.Item>
    <Menu.Item  key="1">
      <a style={{color:"white"}} onClick={props.logout}><Icon type="logout" />退出</a>
    </Menu.Item>
  </Menu>
);

const tip = (<div className="title-container">
  <h3 className="title">工具栏</h3>
  <p><Icon type="search" /> 搜索功能: 搜索分组与项目;</p>
  <p><Icon type="heart" /> 关注功能: 属于自己的收藏夹;</p>
  <p><Icon type="plus-circle" /> 新建项目: 在任何页面都可以快速新建项目;</p>
  <p><Icon type="question-circle" /> 使用文档: 遇到问题的时候随时可以查看文档;</p>
  <p>你还可以更换头像，便于同事在 YApi 里找到你 ~</p>
</div>);

MenuUser.propTypes={
  user: PropTypes.string,
  msg: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func
}

const ToolUser = (props)=> (
  <ul>
    <li className="toolbar-li item-search">
      <Srch groupList={props.groupList}/>
    </li>
    <Link to="/follow">
      <Tooltip placement="bottom" title={'我的关注'}>
        <li className="toolbar-li">
          <Icon className="dropdown-link" style={{ fontSize: 16 }} type="star" />
        </li>
      </Tooltip>
    </Link>
    <Link to="/add-project">
      <Tooltip placement="bottom" title={'新建项目'}>
        <li className="toolbar-li">
          <Icon className="dropdown-link" style={{ fontSize: 16 }} type="plus-circle" />
        </li>
      </Tooltip>
    </Link>
    <Tooltip placement="bottom" title={'使用文档'}>
      <li className="toolbar-li">
        <a target="_blank" href="https://ued.qunar.com/yapi/" rel="noopener noreferrer"><Icon className="dropdown-link" style={{ fontSize: 16 }} type="question-circle" /></a>
      </li>
    </Tooltip>
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
          <Avatar src={`/api/user/avatar?uid=${props.uid}`} />
          {/*<img style={{width:24,height:24}} src={`/api/user/avatar?uid=${props.uid}`} />*/}
          {/*<span className="name">{props.user}</span>*/}
          <span className="name"><Icon type="down" /></span>
        </a>
      </Dropdown>

    </li>
  </ul>
);
ToolUser.propTypes={
  user: PropTypes.string,
  msg: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func,
  groupList: PropTypes.array
};



@connect(
  (state) => {
    return{
      user: state.user.userName,
      uid: state.user.uid,
      msg: null,
      login:state.user.isLogin,
      studyTip: state.user.studyTip,
      study: state.user.study
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
    relieveLink:PropTypes.func,
    logoutActions:PropTypes.func,
    checkLoginState:PropTypes.func,
    loginTypeAction:PropTypes.func,
    changeMenuItem:PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    study: PropTypes.bool,
    studyTip: PropTypes.number
  }
  linkTo = (e) =>{
    if(e.key != '/doc'){
      this.props.changeMenuItem(e.key);
      if(!this.props.login){
        message.info('请先登录',1);
      }
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
    const { login, user, msg, uid } = this.props;
    return (
      <Header className="header-box m-header">
        <div className="content g-row">
          <Link onClick={this.relieveLink} to="/group" className="logo">
            <div   className="href">
              <span className="img">{logoSVG('32px')}</span>
              {/*<span className="logo-name">YApi</span>*/}
            </div>
          </Link>
          <Breadcrumb />
          <div className="user-toolbar">
            {login?
              <Popover
                overlayClassName="popover-index"
                content={<GuideBtns/>}
                title={tip}
                placement="bottomRight"
                visible={(this.props.studyTip === 1 && !this.props.study) ? true : false}
                >
                <ToolUser
                  user = { user }
                  msg = { msg }
                  uid = { uid }
                  relieveLink = { this.relieveLink }
                  logout = { this.logout }
                />
              </Popover>
              :""}
          </div>
        </div>
      </Header>
    )
  }
}
