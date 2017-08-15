import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    });
  }

  

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET'
    })(
      <Select style={{ width: 75 }}>
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
      </Select>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    

    return (
      
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '清输入接口名称!'
            }]
          })(
            <Input placeholder="接口名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接口路径"
        >
          {getFieldDecorator('path', {
            rules: [{
              required: true, message: '清输入接口路径!'
            }]
          })(
            <Input addonBefore={prefixSelector} placeholder="/path" />
          )}
        </FormItem>
        <br />
        <FormItem wrapperCol={{ span: 24, offset: 8 }} >
          <Button  onClick={this.props.onCancel} style={{marginRight: "10px"}}  >取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            提交
          </Button>
        </FormItem>
          
      </Form>

    );
  }
}

export default Form.create()(AddInterfaceForm);
