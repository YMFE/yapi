// import { React, Component } from '../../base.js'
import '../../styles/Login/Login.scss'
import React, { Component } from 'react'
import { Button, Input, Icon, Checkbox } from 'antd'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class Login extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <acticle className="login-main">
        <section className="login-box">
          <div className="content">
            <Input
              size="large"
              placeholder="Username"
              prefix={<Icon type="user" style={{ fontSize: 16 }} />} />

            <Input
              size="large"
              type="password"
              placeholder="Password"
              prefix={<Icon type="lock" style={{ fontSize: 16 }} />} />

            <div className="login">
              <Checkbox>记住密码</Checkbox>
              <Button type="primary">登录</Button>              
            </div>
          </div>
        </section>
      </acticle>
    )
  }
}

export default Login
