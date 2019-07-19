import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button,Select } from 'antd';

import constants from '../../../../constants/variable.js'
import { handleApiPath, nameLengthLimit } from '../../../../common.js'
const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catid: PropTypes.number,
    catdata: PropTypes.array
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values, () => {
          this.props.form.resetFields();
        });

      }
    });
  }

    handlePath = (e) => {
    let val = e.target.value
    this.props.form.setFieldsValue({
      path: handleApiPath(val)
    })
  }
  reinit = data => {
    let initialValue=[this.props.catdata[0]._id + ''];
    let reinitdata = (data,parentPath) => {

      return data.map(item => {
          let node = {
            value: item._id ,
            label: item.name,
            path:[item._id]
          };
        node.path.unshift(...parentPath);
        if (item.children) {
          node.children = reinitdata(item.children,node.path);
        }
          if(item._id===this.props.catid){
            initialValue=node.path;
          }

          return node;
        }
      )
    }
    let redata=reinitdata(data,[]);
    //console.log(initialValue);

    return {redata,initialValue};
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET'
    })(
      <Select style={{ width: 75 }}>
        {HTTP_METHOD_KEYS.map(item => {
          return <Option key={item} value={item}>{item}</Option>
        })}
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

    const ret=this.reinit(this.props.catdata);

    return (

      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="接口分类"
        >
          {getFieldDecorator('catids', {
            initialValue: ret.initialValue
          })(<Cascader options={ret.redata} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('title', {
            rules: nameLengthLimit('接口')
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
              required: true, message: '请输入接口路径!'
            }]
          })(
            <Input onBlur={this.handlePath} addonBefore={prefixSelector} placeholder="/path" />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="注"
        >
          <span style={{ color: "#929292" }}>详细的接口数据可以在编辑页面中添加</span>
        </FormItem>
        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >取消</Button>
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
