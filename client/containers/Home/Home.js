import '../../styles/Home/home.scss'
import React, { Component } from 'react'
import { Button, Input, Icon, Checkbox } from 'antd'
import Header from '../../components/Header/Header.js'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <acticle>
        <Header />

        <h3>YAPI</h3>

        <div className="home-box">
          <Input
            size="large"
            placeholder="Username"
            prefix={<Icon type="user" style={{ fontSize: 14 }} />} />

          <Input
            size="large"
            type="password"
            placeholder="Password"
            prefix={<Icon type="lock" style={{ fontSize: 14 }} />} />

          <Button type="primary">登录</Button>
        </div>

        <Checkbox>记住密码</Checkbox>
      </acticle>
    )
  }
}

export default Home