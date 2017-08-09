import './Home.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Icon } from 'antd'
import PropTypes from "prop-types"
import Login from '../Login/LoginWrap'
import Intro from '../../components/Intro/Intro'
import { changeMenuItem } from '../../reducer/modules/menu'
import { OverPack } from 'rc-scroll-anim'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim';


const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
const imgAnim = { y: '+=50', opacity: 0, type: 'from', ease: 'easeOutQuad', duration: '1500'};
const style = {
  'width':'100%',
  // 'background-image': 'linear-gradient(to right, #0063B3 0%, #2395F1 96%)',
  'background-color': '#333',
  'backgroundSize':'100% 100%'
}
const HomeGuest = (props) => (
  <div>
    <div className="main-one" style = {style}>
      <div>
        <div className="container">
          <Row>
            <Col span={24}>
              <div className="home-des">
                <p className="title">YAPI</p>
                <div className="detail">高效、易用、可部署的API管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8} className="main-one-left">
              <Login/>
            </Col>
            <Col span={16} className="main-one-right">
              <OverPack>
                <TweenOne
                  key="feat-motion-one"
                  animation={imgAnim}
                  className="img-container"
                >
                  <img src="./image/demo-img.png"/>
                </TweenOne>
              </OverPack>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div className="feat-part">
      <div className="container">
        <OverPack
          playScale={[0.2,0.1]}
        >
          <TweenOne
            key="feat-motion-one"
            animation={oneAnim}
            component="p"
          >
            <span>特性</span>
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
              <Col span={6} className="feat-wrapper" key="feat-wrapper-1">
                <div className="feat-img">
                  <Icon type="api" />
                </div>
                <p className="feat-title">
                  接口管理
                </p>
              </Col>
              <Col span={6} className="feat-wrapper" key="feat-wrapper-2">
                <div className="feat-img">
                  <Icon type="link" />
                </div>
                <p className="feat-title">
                  支持Mock
                </p>
              </Col>
              <Col span={6} className="feat-wrapper" key="feat-wrapper-3">
                <div className="feat-img">
                  <Icon type="team" />
                </div>
                <p className="feat-title">
                  团队协作
                </p>
              </Col>
              <Col span={6} className="feat-wrapper" key="feat-wrapper-4">
                <div className="feat-img">
                  <Icon type="desktop" />
                </div>
                <p className="feat-title">
                  可部署
                </p>
              </Col>
            </QueueAnim>
          </Row>
        </OverPack>
      </div>
    </div>
    { props.introList.map(function(intro,i){
      return (
        <div className="main-part" key={i} id={`main-part-${i}`}>
          <div className="container">
            <Intro intro={intro}/>
          </div>
        </div>
      )
    })}
  </div>
);
HomeGuest.propTypes ={
  introList: PropTypes.array
}

@connect(
  state => ({
    login: state.login.isLogin
  }),
  {
    changeMenuItem
  }
)

class Home extends Component {
  constructor(props) {
    super(props)
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

Home.defaultProps={
  introList:[{
    title:"接口管理",
    des:"满足你的所有接口管理需求。不再需要为每个项目搭建独立的接口管理平台和编写离线的接口文档，其权限管理和项目日志让协作开发不再痛苦。",
    detail:[
      {title:"团队协作",des:"多成员协作，掌握项目进度",iconType:"team"},
      {title:"权限管理",des:"设置每个成员的操作权限",iconType:"usergroup-add"},
      {title:"项目日志",des:"推送项目情况，掌握更新动态",iconType:"schedule"}
    ],
    img:"./image/demo-img.png"
  },{
    title:"接口测试",
    des:"一键即可得到返回结果。根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据。",
    detail:[
      {title:"编辑接口",des:"团队开发时任何人都可以在权限许可下创建、修改接口",iconType:"tags-o"},
      {title:"mock请求",des:"创建者可以自由构造需要的数据，支持复杂的生成逻辑",iconType:"fork"}
    ],
    img:"./image/demo-img.png"
  }
  ]
};

export default Home
