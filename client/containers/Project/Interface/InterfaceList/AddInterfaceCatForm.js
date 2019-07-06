import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, TreeSelect, Button, InputNumber } from 'antd';
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
    catlist: PropTypes.array
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

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

    const currentId = this.props.catdata ? this.props.catdata._id + '' || 0 + '' : 0 + ''
    const temp = [...this.props.catlist];
    temp.forEach(f => {
      f.children = temp.filter(g => g.parent_id == f._id);
      f.children.forEach(x => {
        x.value = x._id + '';
        x.title = x.name;
        x.selectable = (x._id + '') != currentId
      });
    });
    const treeData = temp.filter(f => f.parent_id == 0);
    treeData.forEach(x => {
      x.value = x._id + '';
      x.title = x.name;
      x.selectable = (x._id + '') != currentId
    });

    treeData.splice(0, 0, {
      _id: 0,
      value: 0 + '',
      title: '空',
      selectable: (0 + '') != currentId
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="父级分类">
          {getFieldDecorator('parent_id', {
            initialValue: this.props.catdata ? this.props.catdata.parent_id + '' || null : 0 + ''
          })(
            <TreeSelect treeData={treeData}>
            </TreeSelect>
          )}
        </FormItem>
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
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('desc', {
            initialValue: this.props.catdata ? this.props.catdata.desc || null : null
          })(<Input placeholder="备注" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="排序">
          {getFieldDecorator('index', {
            initialValue: this.props.catdata ? this.props.catdata.index + '' || null : null
          })(<InputNumber placeholder="排序（从小到大）" />)}
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
