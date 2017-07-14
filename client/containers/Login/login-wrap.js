import './login.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import LoginForm from './login';
import RegForm from './reg';
const TabPane = Tabs.TabPane;


class LoginWrap extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    form: PropTypes.object,
    loginWrapActiveKey:PropTypes.string
  }

  render() {
    const { loginWrapActiveKey } = this.props;
    return (
      <Tabs defaultActiveKey={loginWrapActiveKey} className="login-form">
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

export default connect(
  state =>({
    loginWrapActiveKey: state.login.loginWrapActiveKey
  })
)(LoginWrap)
