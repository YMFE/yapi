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
const HomeGuest = (props) => (
  <div>
    <div className="main-one">
      <div className="container">
        <Row>
          <Col span={24}>
            <div className="home-des">
              <p className="title">YAPI</p>
              <div className="detail">一个高效，易用，可部署的Api管理系统</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8} className="main-one-left">
            <Login/>
          </Col>
          <Col span={16} className="main-one-right">
            <div className="img-container">
              <img src="./image/demo-img.png"/>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part">
      <div className="container">
        <OverPack
          playScale="0.3"
        >
          <TweenOne
            key="feat-motion-one"
            animation={oneAnim}
            component="h3"
          >
            <span>特性</span>
          </TweenOne>
          <Row key="feat-motion-row">
            <QueueAnim
              delay = {200}
              interval ={100}
              type = "bottom"
              ease = 'easeOutQuad'
              animConfig ={{ opacity:[1,0],y: '+=30' }}
              key="feat-motion-queue"
            >
              <Col span={8} className="feat-wrapper" key="feat-wrapper-1">
                <div className="feat-img">
                  <Icon type="api" />
                </div>
                <p className="feat-title">
                  接口管理
                </p>
              </Col>
              <Col span={8} className="feat-wrapper" key="feat-wrapper-2">
                <div className="feat-img">
                  <Icon type="link" />
                </div>
                <p className="feat-title">
                  支持Mock
                </p>
              </Col>
              <Col span={8} className="feat-wrapper" key="feat-wrapper-3">
                <div className="feat-img">
                  <Icon type="team" />
                </div>
                <p className="feat-title">
                  团队协作
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
                <p className="des">一个高效，易用，功能强大的api管理系统</p>
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
