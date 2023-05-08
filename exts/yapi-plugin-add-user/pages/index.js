import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Form, Button, Input, Icon, Row, Layout, Switch, message } from 'antd'
const FormItem = Form.Item
import { setBreadcrumb } from 'client/reducer/modules/user'

import './index.scss'

// layout
const formItemStyle = {
  marginBottom: '.16rem',
}

const changeHeight = {
  height: '.42rem',
}

const formItemLayout = {
  labelCol: {
    xs: { span: 18 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

@connect(null, {
  setBreadcrumb,
})
@Form.create()
export default class AddUser extends Component {
  static propTypes = {
    form: PropTypes.object,
    setBreadcrumb: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      send_email: false,
      is_random: false,
    }
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: '添加用户' }])
  }

  handleSubmit = e => {
    e.preventDefault()
    const form = this.props.form
    form.validateFieldsAndScroll((err, val) => {
      if (!err) {
        let values = Object.assign({}, val, {
          send_email: this.state.send_email,
          is_random: this.state.is_random,
        })
        axios.post('/api/plugin/fine/user/add', values).then(result => {
          if (
            result.data &&
            result.data.errcode &&
            result.data.errcode !== 40011
          ) {
            message.error(result.data.errmsg)
          } else {
            this.props.form.resetFields()
            message.success('用户添加成功')
          }
        })
      }
    })
  }

  onChange = v => {
    this.setState({
      send_email: v,
    })
  }

  onChangeRandom = v => {
    this.setState({
      is_random: v,
      send_email: v ? true : this.state.send_email,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="g-doc">
        <Layout
          className="fine-add-user"
          style={{ minHeight: 'calc(100vh - 156px)' }}
        >
          <Row>
            <h2>添加用户</h2>
          </Row>
          <Row>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} style={formItemStyle} label="邮箱">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '请输入email!',
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/,
                    },
                  ],
                })(
                  <Input
                    style={changeHeight}
                    prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
                    placeholder="邮箱"
                  />,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否发送邮件通知">
                {getFieldDecorator(
                  'send_email',
                  {},
                )(
                  <Switch
                    checked={this.state.send_email}
                    disabled={this.state.is_random}
                    onChange={this.onChange}
                    checkedChildren="开"
                    unCheckedChildren="关"
                  />,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否使用随机密码">
                {getFieldDecorator(
                  'is_random',
                  {},
                )(
                  <span>
                    <Switch
                      checked={this.state.is_random}
                      onChange={this.onChangeRandom}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                    <span style={{ marginLeft: '10px' }}>
                      密码默认为123456，开启后生成随机密码且不能关闭邮箱通知
                    </span>
                  </span>,
                )}
              </FormItem>

              <FormItem
                style={{ ...formItemStyle, width: '1rem', margin: 'auto' }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  添加用户
                </Button>
              </FormItem>
            </Form>
          </Row>
        </Layout>
      </div>
    )
  }
}
