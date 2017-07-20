import './Home.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'antd'
import PropTypes from "prop-types"
import Login from '../Login/LoginWrap'
import Intro from '../../components/Intro/Intro'
import Footer from "../../components/Footer/Footer";

const HomeGuest = (props) => (
  <div>
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
    { props.introList.map(function(intro,i){
      return (
        <div className="main-part" key={i}>
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
  })
)

class Home extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    introList: PropTypes.array,
    login : PropTypes.bool
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
                    <Link to="/ProjectGroups" onClick={this.toStart}>开始</Link>
                  </Button>
                </div>
              </div>
            </div>
          )
          : <HomeGuest introList={this.props.introList}/>}
        <Footer/>
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
