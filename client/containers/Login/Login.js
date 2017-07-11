<<<<<<< HEAD
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, Icon, Checkbox } from 'antd'
import './Login.scss'
=======
import './Login.scss';
import React, { Component } from 'react';
import { Form, Button, Input, Icon, Checkbox } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const FormItem = Form.Item;
>>>>>>> 68828ebd3b3ac60015757711625048cef4b44165

@connect(
  () => ({
    per: '测试数据',
  })
)
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form;

<<<<<<< HEAD
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
=======
    // 获取全部组件的值
    // console.log(form.getFieldsValue());
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名!' }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>
      </Form>
    );
>>>>>>> 68828ebd3b3ac60015757711625048cef4b44165
  }
}

const LoginWrap = Form.create()(Login);

export default LoginWrap;
