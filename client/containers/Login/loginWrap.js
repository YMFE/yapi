import './Login.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import LoginForm from './login';
import RegForm from './reg';
const TabPane = Tabs.TabPane;

class LoginWrap extends Component {
  static propTypes = {
    form: PropTypes.object
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" className="login-form">
        <TabPane tab="登录" key="1">
          <LoginForm/>
        </TabPane>
        <TabPane tab="注册" key="2">
          <RegForm/>
        </TabPane>
      </Tabs>
    );
  }
}

export default LoginWrap;
