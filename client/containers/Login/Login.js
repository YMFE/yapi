import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Input, Icon } from 'antd';
import { loginActions } from  '../../actions/login';
const FormItem = Form.Item;
@connect(
  state => {
    return {
      loginData: state.login
    }
  },
  {
    loginActions
  }
)

class Login extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    form: PropTypes.object,
    loginActions: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.loginActions(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        {/* 用户名 (Email) */}
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入email!' }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email" />
          )}
        </FormItem>

        {/* 密码 */}
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>


        {/* 登录按钮 */}
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>

      </Form>
    )
  }
}
const LoginForm = Form.create()(Login);
export default LoginForm;
