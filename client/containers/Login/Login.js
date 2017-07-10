import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Icon, Checkbox } from 'antd'
import './Login.scss'

class Login extends Component {
  constructor(props) {
    super(props)
  }
  
  static propTypes = {
    value: PropTypes.string,
    per: PropTypes.string,
  }

  render () {
    return (
      <acticle className="login-main">
        <span>{this.props.value}{this.props.per}</span>
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
