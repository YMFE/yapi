import './createTemplate.scss'
import React from 'react'
import { MOCK_SOURCE } from '../../../constants/variable.js'
import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import PropTypes from 'prop-types'
const jSchema = require('@leeonfield/json-schema-editor-visual')
const ResBodySchema = jSchema({ lang: 'zh_CN', mock: MOCK_SOURCE })

const FormItem = Form.Item
const { TextArea } = Input

class CreateTemplate extends  React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.projectId
    this.state = {
      res_schema: ''
    }
  }
  static propTypes = {
    form: PropTypes.object,
    projectId: PropTypes.string,
    onCancel: PropTypes.func,
    getList: PropTypes.func,
    templateItem: PropTypes.object,
    isEdit: PropTypes.number
  };
  handleSubmit = async (e) => {
    e.preventDefault()
    let params = {}
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        params.title = values.title
        params.desc = values.desc
        params.res_schema = this.state.res_schema
        params.project_id = this.projectId
        //编辑的时候传_id
        if (this.props.isEdit == 1) {
          params.id = this.props.templateItem._id
        }
        let result = await axios.post(this.props.isEdit == 0 ? '/api/interface_template/add' : '/api/interface_template/up', params)
        if(result.data.errcode === 0) {
          this.props.onCancel()
          this.props.getList()
          return message.success(result.data.errmsg)
        } else {
          return message.error(result.data.errmsg)
        }
      }
    })
  }
  handleJsonText = (d) => {
    this.setState({ res_schema: d})
  }
  render() {
    const { templateItem } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { 
          span: 4,
          offset: 0
        }
      },
      wrapperCol: {
        xs: {
          span: 19,
          offset: 0
        }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          offset: 4
        }
      }
    }
    return (
      <div className="create-template">      
        <Form className="create-template-form" layout="horizontal" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="模版名称"
          >
            {getFieldDecorator('title', {
              initialValue: templateItem.title,
              rules: [{ required: true, message: '名称不能为空' }]
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="模版内容"
          >
            {getFieldDecorator('res_schema', {
              initialValue: templateItem.res_schema
            })(<div>
              <ResBodySchema
                onChange={this.handleJsonText}
                data={templateItem.res_schema}
              />
            </div>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('desc', {
              initialValue: templateItem.desc,
              rules: [{ required: true, message: '描述信息不能为空' }]
            })(<TextArea type="textarea" />)}
          </FormItem>
          <FormItem
            {...tailFormItemLayout}
          >
            <Button className="form-btn" onClick={this.props.onCancel}>取消</Button>
            <Button className="ant-btn-primary" htmlType="submit">保存</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Form.create()(CreateTemplate)