import './Home.scss'
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PropTypes from "prop-types"
import Login from '../Login/login-wrap'
import Intro from '../../components/Intro/Intro'


class Home extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    introList:PropTypes.array
  }
  render () {
    return (
      <div className="home-main">
        <div className="main-one">
          <div className="container">
            <Row>
              <Col span={24}>
                <div className="home-des">
                  <p className="title">YAPI</p>
                  <div className="detail">一个高效，易用，功能强大的api管理系统</div>
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
        { this.props.introList.map(function(intro,i){
          return (
            <div className="main-part" key={i}>
              <div className="container">
                <Intro intro={intro}/>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

Home.defaultProps={
  introList:[{
    title:"接口管理",
    des:"yapi将满足你的所有接口管理需求。不再需要 为每个项目搭建独立的接口管理平台和编写离线的接口文档",
    detail:[
      {title:"接口管理",des:"强大的接口文档"},
      {title:"接口管理",des:"强大的接口文档"},
      {title:"接口管理",des:"强大的接口文档"}
    ],
    img:"./image/demo-img.png"
  },{
    title:"接口管理",
    des:"yapi将满足你的所有接口管理需求。不再需要 为每个项目搭建独立的接口管理平台和编写离线的接口文档",
    detail:[
      {title:"接口管理",des:"强大的接口文档"},
      {title:"接口管理",des:"强大的接口文档"}
    ],
    img:"./image/demo-img.png"
  }
  ]
};

export default Home
