import './Home.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Icon, Card } from 'antd';
import PropTypes from "prop-types";
import { logoSVG } from '../../common.js';

// import Intro from '../../components/Intro/Intro'
import { changeMenuItem } from '../../reducer/modules/menu'
import { OverPack } from 'rc-scroll-anim'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim';

const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };

const HomeGuest = () => (
  <div className="g-body">
    <div className="m-bg">
      <div className="m-bg-mask m-bg-mask0"></div>
      <div className="m-bg-mask m-bg-mask1"></div>
      <div className="m-bg-mask m-bg-mask2"></div>
      <div className="m-bg-mask m-bg-mask3"></div>
    </div>
    <div className="main-one">
      <div className="container">
        <Row>
          <Col span={24}>
            <div className="home-heander">
              <a href="#" className="item">YAPI</a>
              <a target="_blank" href="/doc/index.html" className="item">使用文档</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={9}>
            <div className="home-des">
              <div className="logo">
                {logoSVG('72px')}
                <span className="name">YAPI</span>
              </div>
              <div className="detail">高效、易用、可部署的API管理平台<br/><span className="desc">旨在为开发、产品、测试人员提供更优雅的接口管理服务</span></div>
              <div className="btn-group">
                <Link to="/login"><Button type="primary" className="btn-home btn-login">登录 / 注册</Button></Link>
                <Button className="btn-home btn-qsso" id="qsso-login">QSSO 登录</Button>
              </div>
            </div>
          </Col>
          <Col span={15}>
            <div className="img-container">
              <img className="img" src="./image/demo-img.jpg"/>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part section-feature">
      <div className="container home-section">
        <OverPack
          playScale={[0.2,0.1]}
        >
          <TweenOne
            key="feat-motion-one"
            animation={oneAnim}
          >
            <h3 className="title">为API开发者设计的管理平台</h3>
            <span className="desc">YApi让接口开发更简单高效，让接口的管理更具可读性、可维护性，让团队协作更合理。</span>
          </TweenOne>
          <Row key="feat-motion-row">
            <QueueAnim
              delay = {200}
              interval ={200}
              leaveReverse={true}
              ease = 'easeOutQuad'
              animConfig ={{ opacity:[1,0],y: '+=30' }}
              key="feat-motion-queue"
            >
              <Col span={8} className="section-item" key="feat-wrapper-1">
                <Icon type="api" className="img" />
                <h4 className="title">项目接口管理</h4>
                <span className="desc">提供基本的项目分组，项目管理，接口管理功能</span>
              </Col>
              <Col span={8} className="section-item" key="feat-wrapper-2">
                <Icon type="code-o" className="img" />
                <h4 className="title">可部署</h4>
                <span className="desc">用户只需在项目配置线上域名和接口基本路径，通过将线上域名指到我们的YApi平台服务器，就可使用mockServer服务</span>
              </Col>
              <Col span={8} className="section-item" key="feat-wrapper-3">
                <Icon type="team" className="img" />
                <h4 className="title">用户管理</h4>
                <span className="desc">提供基本的用户注册登录管理等功能，集成了去哪儿QSSO登录</span>
              </Col>
            </QueueAnim>
          </Row>
        </OverPack>
      </div>
    </div>
    <div className="feat-part m-mock m-skew home-section">
      <div className="m-skew-bg">
        <div className="m-bg-mask m-bg-mask0"></div>
        <div className="m-bg-mask m-bg-mask1"></div>
        <div className="m-bg-mask m-bg-mask2"></div>
      </div>
      <div className="container skew-container">
        <h3 className="title">功能强大的 Mock 服务</h3>
        <span className="desc">你想要的 Mock 服务都在这里</span>
        <Row className="row-card">
          <Col span={12} className="section-card">
            <Card title="Mock 规则">
              <p>通过学习一些简单的 Mock 模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼: 所有的数据都可以实时随机生成。</p>
              <p>通过学习一些简单的 Mock 模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼: 所有的数据都可以实时随机生成。</p>
              <p>通过学习一些简单的 Mock 模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼: 所有的数据都可以实时随机生成。</p>
            </Card>
          </Col>
          <Col span={12} className="section-card mock-after">
            <Card title="生成的 Mock 数据">
              <p>生成的 Mock 数据可以在线使用(配置Hosts后直接访问接口)，也可以下载到本地使用。</p>
              <p>生成的 Mock 数据可以在线使用(配置Hosts后直接访问接口)，也可以下载到本地使用。</p>
              <p>生成的 Mock 数据可以在线使用(配置Hosts后直接访问接口)，也可以下载到本地使用。</p>
              <p>生成的 Mock 数据可以在线使用(配置Hosts后直接访问接口)，也可以下载到本地使用。</p>
              <p>生成的 Mock 数据可以在线使用(配置Hosts后直接访问接口)，也可以下载到本地使用。</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
    <div className="home-section section-manage">
      <div className="container">
        <Row className="row-card">
          <Col span={7} className="section-card">
            <Card>
              <div className="section-block block-first">
                <h4>超级管理员(* N)</h4>
                <p className="item"> - 创建分组</p>
                <p className="item"> - 分配组长</p>
                <p className="item"> - 管理所有成员信息</p>
              </div>
              <div className="section-block block-second">
                <h4>组长(* N)</h4>
                <p className="item"> - 创建项目</p>
                <p className="item"> - 管理分组或项目的信息</p>
                <p className="item"> - 管理开发者与成员</p>
              </div>
              <div className="section-block block-third">
                <h4>开发者(* N) / 成员(* N)</h4>
                <p className="item"> - 不允许创建分组或项目</p>
                <p className="item"> - 不允许修改分组或项目信息</p>
              </div>
            </Card>
          </Col>
          <Col span={17} className="section-card manage-word">
            <Icon type="team" className="icon" />
            <h3 className="title">扁平化管理模式</h3>
            <p className="desc">接口管理的逻辑较为复杂，操作频率高，层层审批将严重拖慢生产效率，因此传统的金字塔管理模式并不适用。</p>
            <p className="desc">YAPI 将扁平化管理模式的思想引入到产品的权限管理中，超级管理员拥有最高的权限，并将权限分配给若干组长，超级管理员只需管理组长即可，实际上管理YAPI各大分组与项目的是“组长”。组长对分组或项目负责，一般由BU负责人/项目负责人担任。</p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);
HomeGuest.propTypes ={
  introList: PropTypes.array
}

@connect(
  state => ({
    login: state.user.isLogin
  }),
  {
    changeMenuItem
  }
)

class Home extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    if(window.QSSO) window.QSSO.attach('qsso-login','/api/user/login_by_token')
  }
  static propTypes = {
    introList: PropTypes.array,
    login : PropTypes.bool,
    changeMenuItem : PropTypes.func
  }
  toStart = () =>{
    this.props.changeMenuItem('/group');
  }
  render () {
    const { login } = this.props;
    return (
      <div className="home-main">
        {login?
          (
            <div className="user-home">
              <div className="user-des">
                <p className="title">YAPI</p>
                <p className="des">一个高效，易用，可部署的Api管理系统</p>
                <div className="btn">
                  <Button type="primary" size="large">
                    <Link to="/group" onClick={this.toStart}>开始</Link>
                  </Button>
                </div>
              </div>
            </div>
          )
          : <HomeGuest introList={this.props.introList}/>}
      </div>
    )
  }
}

// Home.defaultProps={
//   introList:[{
//     title:"接口管理",
//     des:"满足你的所有接口管理需求。不再需要为每个项目搭建独立的接口管理平台和编写离线的接口文档，其权限管理和项目日志让协作开发不再痛苦。",
//     detail:[
//       {title:"团队协作",des:"多成员协作，掌握项目进度",iconType:"team"},
//       {title:"权限管理",des:"设置每个成员的操作权限",iconType:"usergroup-add"},
//       {title:"项目日志",des:"推送项目情况，掌握更新动态",iconType:"schedule"}
//     ],
//     img:"./image/demo-img.jpg"
//   },{
//     title:"接口测试",
//     des:"一键即可得到返回结果。根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据。",
//     detail:[
//       {title:"编辑接口",des:"团队开发时任何人都可以在权限许可下创建、修改接口",iconType:"tags-o"},
//       {title:"mock请求",des:"创建者可以自由构造需要的数据，支持复杂的生成逻辑",iconType:"fork"}
//     ],
//     img:"./image/demo-img.jpg"
//   }
//   ]
// };

export default Home
