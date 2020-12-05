import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Button, TreeSelect} from 'antd';
const { TreeNode } = TreeSelect;
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
    category: PropTypes.array,
    defaultPid: PropTypes.string
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };
  // 生成无级树
  renderTree = (treeData) => treeData.map((item) => {
    if(item.list) {
      const value = item._id ? item._id.toString() : item._id;
      return(
        <TreeNode value={ value } title={ item.name } key={item._id}>
          {this.renderTree(item.list)}
        </TreeNode>
      )
    } else {
      return (null)
    }
  });
  render() {
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
        <FormItem {...formItemLayout} label="分类名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入分类名称!'
              }
            ],
            initialValue: this.props.catdata ? this.props.catdata.name || null : null
          })(<Input placeholder="分类名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上级分类">
          {getFieldDecorator('pid', {
              initialValue: this.props.catdata ? this.props.catdata.pid || null : null
          })(
            <TreeSelect>
              { this.renderTree(this.props.category) }
            </TreeSelect>
          )}
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
    );
  }
}

export default Form.create()(AddInterfaceForm);
