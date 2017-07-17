import './Home.scss'
import React, { Component } from 'react'
import Login from '../Login/login-wrap'


class Home extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="home-main">
        <div className="main-one">
          <div className="home-des">
            <p className="title">YAPI</p>
            <div className="detail">一个高效，易用，功能强大的api管理系统</div>
          </div>
          <Login/>
        </div>
      </div>
    )
  }
}

export default Home
