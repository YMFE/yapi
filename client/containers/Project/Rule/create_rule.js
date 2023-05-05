// import './createrule.scss';
import React from 'react'
import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import PropTypes from 'prop-types'
import ruleEditor from 'client/components/AceEditor/mockEditor'

const FormItem = Form.Item
const { TextArea } = Input

class CreateRules extends  React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.projectId
    this.state = {
      mock_script: props.ruleItem.mock_script
    }
  }
  static propTypes = {
    form: PropTypes.object,
    projectId: PropTypes.string,
    onCancel: PropTypes.func,
    getList: PropTypes.func,
    ruleItem: PropTypes.object,
    isEdit: PropTypes.bool
  };

  componentDidMount() {
    const _this = this
    ruleEditor({
      container: 'mock-script',
      data: _this.state.mock_script,
      onChange: function(d) {
        _this.setState({
          mock_script: d.text
        })
      }
    })
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    let params = {}
    this.props.form.validateFields(async (err, values) => {
      if (!err) {

        params.title = values.title
        params.desc = values.desc
        params.project_id = this.projectId
        params.mock_script = this.state.mock_script

        //编辑的时候传_id
        if (this.props.isEdit == 1) {
          params.id = this.props.ruleItem._id
        }

        let result = await axios.post(this.props.isEdit == 0 ? '/api/rule/add' : '/api/rule/up', params)

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
    const { ruleItem } = this.props
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
      <div className="create-rule">      
        <Form className="create-rule-form" layout="horizontal" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('title', {
              initialValue: ruleItem.title,
              rules: [{ required: true, message: '名称不能为空' }]
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('desc', {
              initialValue: ruleItem.desc
            })(<TextArea rows={2} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="规则"
          >
            <div id="mock-script" style={{ minHeight: 300, minWidth: 200 }} />
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
export default Form.create()(CreateRules)