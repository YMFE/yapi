import './Header.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu, Dropdown, message, Tooltip, Avatar, Popover, Tag } from 'antd'
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

const tipFollow = (<div className="title-container">
  <h3 className="title"><Icon type="star" /> 关注</h3>
  <p>这里是你的专属收藏夹，便于你找到自己的项目</p>
</div>);
const tipAdd = (<div className="title-container">
  <h3 className="title"><Icon type="plus-circle" /> 新建项目</h3>
  <p>在任何页面都可以快速新建项目</p>
</div>);
const tipDoc = (<div className="title-container">
  <h3 className="title">使用文档 <Tag color="orange">推荐!</Tag></h3>
  <p>初次使用 YApi，强烈建议你阅读 <a target="_blank" href="https://yapi.ymfe.org/" rel="noopener noreferrer">使用文档</a> ，我们为你提供了通俗易懂的快速入门教程，更有详细的使用说明，欢迎阅读！ </p>
</div>);

MenuUser.propTypes={
  user: PropTypes.string,
  msg: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func
}

const ToolUser = (props)=> {
  return (
    <ul>
      <li className="toolbar-li item-search">
        <Srch groupList={props.groupList}/>
      </li>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns/>}
        title={tipFollow}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 1 && !props.study}
        >
        <Tooltip placement="bottom" title={'我的关注'}>
          <li className="toolbar-li">
            <Link to="/follow">
              <Icon className="dropdown-link" style={{ fontSize: 16  }} type="star" />
            </Link>
          </li>
        </Tooltip>
      </Popover>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns/>}
        title={tipAdd}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 2 && !props.study}
        >
        <Tooltip placement="bottom" title={'新建项目'}>
          <li className="toolbar-li">
            <Link to="/add-project">
              <Icon className="dropdown-link" style={{ fontSize: 16 }} type="plus-circle" />
            </Link>
          </li>
        </Tooltip>
      </Popover>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns isLast={true}/>}
        title={tipDoc}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 3 && !props.study}
        >
        <Tooltip placement="bottom" title={'使用文档'}>
          <li className="toolbar-li">
            <a target="_blank" href="https://yapi.ymfe.org/" rel="noopener noreferrer"><Icon className="dropdown-link" style={{ fontSize: 16 }} type="question-circle" /></a>
          </li>
        </Tooltip>
      </Popover>
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
  )
};
ToolUser.propTypes={
  user: PropTypes.string,
  msg: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func,
  groupList: PropTypes.array,
  studyTip: PropTypes.number,
  study: PropTypes.bool
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
    const { login, user, msg, uid, studyTip, study } = this.props;
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
          <div className="user-toolbar" style={{ position: 'relative', zIndex: this.props.studyTip > 0 ? 3 : 1}}>
            {login?
              <ToolUser
                {...{studyTip, study, user, msg, uid}}
                relieveLink={ this.relieveLink }
                logout={ this.logout }
              />
              :""}
          </div>
        </div>
      </Header>
    )
  }
}
