import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, TreeSelect } from 'antd';
const { TreeNode } = TreeSelect;
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
  toTree = (list) => {
    const treeData = [];
    let tempList = list;
    const roots = list.filter((item) => {
      return !item.pid;
    });
    treeData.push(...roots);
    const loop = (childList) => {
      childList.forEach((item) => {
        tempList.forEach((childItem, childIndex) => {
          if(childItem.pid === item._id) {
            if(!item.list) {
              item.list = [];
            }
            item.list.push(childItem);
            tempList.splice(childIndex,1);
            if(item.list.length > 0) {
              loop(item.list);
            }
          }
        });
      });
    };
    loop(treeData);
    return treeData;
  };
  // 生成无级树
  renderTree = (treeData) => {
    return treeData.map((item) => {
      const value = item._id ? item._id.toString() : null;
      if(item.list) {
        return(
          <TreeNode value={ value } title={ item.name } key={item._id}>
            {this.renderTree(item.list)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode value={ value } title={ item.name } key={item._id}></TreeNode>
        )
      }
    })
  };
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


    return (

      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="接口分类"
        >
          {getFieldDecorator('catid', {
            initialValue: this.props.catid ? this.props.catid + '' : this.props.catdata[0]._id + ''
          })(
            <TreeSelect>
              {
                this.renderTree(this.toTree(this.props.catdata))
              }
            </TreeSelect>
            )}
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
