import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catdata: PropTypes.object,
    isSubCat: PropTypes.bool
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.isSubCat){
          values.parent_id = this.props.catdata._id
        }
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    let {name,desc} =this.props.catdata||{}
   
    //如果是添加子分类就把name清空
    let fName =name || null
    if(this.props.isSubCat){
      name =null
    }
    const { getFieldDecorator, getFieldsError } = this.props.form;
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
        {this.props.isSubCat && <FormItem {...formItemLayout} label="所属分类">
          {getFieldDecorator('fname', {
            rules: [
              {
                required: true,
                message: '请输入父分类名称!'
              }
            ],
            initialValue:fName||null
          })(<Input placeholder="分类名称"  disabled/>)}
        </FormItem>
        }

        <FormItem {...formItemLayout} label={!this.props.isSubCat?'分类名':'子分类名'}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入分类名称!'
              }
            ],
            initialValue: name ? name: null
          })(<Input placeholder="分类名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('desc', {
            initialValue: desc || null 
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
    );
  }
}

export default Form.create()(AddInterfaceForm);
