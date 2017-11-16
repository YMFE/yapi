import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Input, Icon, message } from 'antd';
import { loginActions } from  '../../reducer/modules/user';
import { withRouter } from 'react-router'
const FormItem = Form.Item;
import './Login.scss'
// import Qsso from  '../../components/Qsso/Qsso.js'

const formItemStyle = {
  marginBottom: '.16rem'
}

const changeHeight = {
  height: '.42rem'
}

@connect(
  state => {
    return {
      loginData: state.user
    }
  },
  {
    loginActions
  }
)
@withRouter
class Login extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    loginActions: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.loginActions(values).then((res) => {
          if (res.payload.data.errcode == 0) {
            this.props.history.replace('/group');
            message.success('登录成功! ');
          }
        });
      }
    });
  }

  componentDidMount() {
    //Qsso.attach('qsso-login','/api/user/login_by_token')
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>

        {/* 用户名 (Email) */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('email', {
            rules: [{
              required: true,
              message: '请输入正确的email!',
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }]
          })(
            <Input style={changeHeight} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email" />
          )}
        </FormItem>

        {/* 密码 */}
        <FormItem style={formItemStyle}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input style={changeHeight} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>


        {/* 登录按钮 */}
        <FormItem style={formItemStyle}>
          <Button style={changeHeight} type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>

        
        {/* <div className="qsso-breakline">
          <span className="qsso-breakword">或</span>
        </div>
        <Button style={changeHeight} id="qsso-login" type="primary" className="login-form-button" size="large" ghost>QSSO登录</Button> */}
      </Form>

    )
  }
}
const LoginForm = Form.create()(Login);
export default LoginForm;
