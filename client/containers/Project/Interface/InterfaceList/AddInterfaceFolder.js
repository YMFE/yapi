import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
class AddInterfaceFolder extends Component {
  static propTypes = {
    dirdata: PropTypes.object,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    catid: PropTypes.number,
    parentid: PropTypes.string,
    onCancel: PropTypes.func,
    catdata: PropTypes.object
  };
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if(this.props.dirdata && this.props.dirdata._id) {
        values = Object.assign({
          id: this.props.dirdata._id
        }, this.props.dirdata, values)
      } else {
        values = Object.assign(values, {
          catid: this.props.catid,
          parent_id: this.props.parentid,
          record_type: 2
        })
      }
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="目录名">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入目录名称!'
              }
            ],
            initialValue: this.props.dirdata && this.props.dirdata.title ? this.props.dirdata.title|| null : null
          })(<Input placeholder="目录名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('desc', {
            initialValue: this.props.catdata ? this.props.catdata.desc || null : null
          })(<Input placeholder="备注" />)}
        </FormItem>

        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }}>
          <Button onClick={this.props.onCancel} style={{ marginRight: '10px' }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(AddInterfaceFolder)
