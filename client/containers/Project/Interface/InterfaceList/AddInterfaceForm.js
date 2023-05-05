import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, message } from 'antd'
import constants from '../../../../constants/variable.js'
import { handleApiPath, nameLengthLimit } from '../../../../common.js'
const HTTP_METHOD = constants.HTTP_METHOD
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD)

const FormItem = Form.Item
const Option = Select.Option
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const interface_type = [
  {
    name: 'http',
    label: 0,
  },
  {
    name: 'dubbo',
    label: 1,
  },
]
class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catid: PropTypes.number,
    parentid: PropTypes.string,
    catdata: PropTypes.array,
    interface_type: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.state = {
      api_type: 'http',
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values = Object.assign(values, {
          parent_id: this.props.parentid,
          record_type: 0,
        })
        if (values['r_facade'] && !this.checkPackage(values['r_facade'])) {
          message.error('接口请包括完整包名')
          return false
        }
        this.props.onSubmit(values, () => {
          this.props.form.resetFields()
        })
      }
    })
  }

  handleChange = value => {
    this.setState({
      api_type: value,
    })
  }

  handlePath = e => {
    let val = e.target.value
    this.props.form.setFieldsValue({
      path: handleApiPath(val),
    })
  }

  checkPackage = facade => {
    let hasPackage = facade.match(/\./gi) ? facade.match(/\./gi).length : 0
    if (hasPackage < 2) {
      return false
    }
    return true
  }

  handleFacade = e => {
    let val = e.target.value
    if (this.checkPackage(val)) {
      return true
    }
    message.error('接口请包括完整包名')
    return false
  }
  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET',
    })(
      <Select style={{ width: 75 }}>
        {HTTP_METHOD_KEYS.map(item => {
          return (
            <Option key={item} value={item}>
              {item}
            </Option>
          )
        })}
      </Select>,
    )
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="接口分类">
          {getFieldDecorator('catid', {
            initialValue: this.props.catid
              ? this.props.catid + ''
              : this.props.catdata[0]._id + '',
          })(
            <Select>
              {this.props.catdata.map(item => {
                return (
                  <Option key={item._id} value={item._id + ''}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="接口名称">
          {getFieldDecorator('title', {
            rules: nameLengthLimit('接口'),
          })(<Input placeholder="接口名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="接口类型">
          {getFieldDecorator('interface_type', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: 'http',
          })(
            <Select onChange={this.handleChange}>
              {interface_type.map(item => {
                return (
                  <Option key={item.label} value={item.name + ''}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>,
          )}
        </FormItem>
        {this.state.api_type === 'http' ? (
          <FormItem {...formItemLayout} label="接口路径">
            {getFieldDecorator('path', {
              rules: [
                {
                  required: true,
                  message: '请输入接口路径!',
                },
              ],
            })(
              <Input
                onBlur={this.handlePath}
                addonBefore={prefixSelector}
                placeholder="/path"
              />,
            )}
          </FormItem>
        ) : (
          ''
        )}
        {this.state.api_type === 'dubbo' ? (
          <FormItem {...formItemLayout} label="接口">
            {getFieldDecorator('r_facade', {
              rules: [
                {
                  required: true,
                  message: '请输入接口!',
                },
              ],
            })(
              <Input
                onBlur={this.handleFacade}
                placeholder="请输入包括包名的完整接口"
              />,
            )}
          </FormItem>
        ) : (
          ''
        )}
        {this.state.api_type === 'dubbo' ? (
          <FormItem {...formItemLayout} label="方法">
            {getFieldDecorator('r_method', {
              rules: [
                {
                  required: true,
                  message: '请输入方法!',
                },
              ],
            })(<Input placeholder="方法" />)}
          </FormItem>
        ) : (
          ''
        )}

        <FormItem {...formItemLayout} label="注">
          <span style={{ color: '#929292' }}>
            详细的接口数据可以在编辑页面中添加
          </span>
        </FormItem>

        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }}>
          <Button onClick={this.props.onCancel} style={{ marginRight: '10px' }}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(AddInterfaceForm)
