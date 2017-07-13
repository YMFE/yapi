import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Input, Icon, Checkbox } from 'antd';
import { loginActions } from  '../../actions/login';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
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

  handleChange = (value) => {
    if (cookies.get(value)) {
      this.props.form.setFieldsValue({
        password: cookies.get(value)
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const that = this;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入email!' }],
            initialValue: 'test',
            onChange(e) {
              that.handleChange(e.target.value);
            }
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email" />
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
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true
        })(
          <Checkbox>记住密码</Checkbox>
        )}
        <span>忘记密码</span>
      </Form>
    )
  }
}
const LoginForm = Form.create()(Login);
export default LoginForm;
