import './Home.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Icon } from 'antd'
import PropTypes from "prop-types"
import Login from '../Login/LoginWrap'
import Intro from '../../components/Intro/Intro'
import { changeMenuItem } from '../../actions/menu'
import { OverPack } from 'rc-scroll-anim'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim';


const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
const imgAnim = { y: '+=50', opacity: 0, type: 'from', ease: 'easeOutQuad', duration: '1500'};
const style = {
  // 'height':'100%',
  // 'height':'7rem',
  'width':'100%',
  'background': 'url(./image/bg-img.jpg) no-repeat',
  'backgroundSize':'100% 100%'
}
const HomeGuest = (props) => (
  <div>
    <div className="main-one" style = {style}>
      <div style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.2))"}}>
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
    des:"yapi将满足你的所有接口管理需求。不再需要 为每个项目搭建独立的接口管理平台和编写离线的接口文档",
    detail:[
      {title:"接口管理",des:"强大的接口文档",iconType:"smile-o"},
      {title:"接口管理",des:"强大的接口文档",iconType:"smile-o"},
      {title:"接口管理",des:"强大的接口文档",iconType:"smile-o"}
    ],
    img:"./image/demo-img.png"
  },{
    title:"接口管理",
    des:"yapi将满足你的所有接口管理需求。不再需要 为每个项目搭建独立的接口管理平台和编写离线的接口文档",
    detail:[
      {title:"接口管理",des:"强大的接口文档",iconType:"smile-o"},
      {title:"接口管理",des:"强大的接口文档",iconType:"smile-o"}
    ],
    img:"./image/demo-img.png"
  }
  ]
};

export default Home
