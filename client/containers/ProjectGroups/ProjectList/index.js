import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, Icon, Tooltip, Select } from 'antd';
import { addProject } from  '../../../actions/project';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

import './ProjectList.scss'

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age'
}, {
  title: 'Action',
  key: 'action',
  render: () => (
    <span>
      <a href="#">修改</a>
      <span className="ant-divider" />
      <a href="#">删除</a>
    </span>
  )
}];

const data = [{
  key: '1',
  age: 32
}, {
  key: '2',
  age: 42
}, {
  key: '3',
  age: 32
}];

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

@connect(
  state => {
    return {
      loginData: state.login
    }
  },
  {
    addProject
  }
)
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      protocol: 'http:\/\/'
    }
  }
  static propTypes = {
    form: PropTypes.object,
    addProject: PropTypes.func
  }
  addProject = () => {
    this.setState({
      visible: true
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.prd_host = this.state.protocol + values.prd_host;
        console.log('Received values of form: ', values);
        this.setState({
          visible: false
        });
        this.props.addProject(values);
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
  }

  // 修改线上域名的协议类型 (http/https)
  protocolChange = (value) => {
    this.setState({
      protocol: value
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="创建项目"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>

            <FormItem
              {...formItemLayout}
              label="项目名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入项目名称!'
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  线上域名&nbsp;
                  <Tooltip title="将根据配置的线上域名访问mock数据">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('prd_host', {
                rules: [{
                  required: true, message: '请输入项目线上域名!'
                }]
              })(
                <Input addonBefore={(
                  <Select defaultValue="http://" onChange={this.protocolChange}>
                    <Option value="http://">{'http:\/\/'}</Option>
                    <Option value="https://">{'https:\/\/'}</Option>
                  </Select>)} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="URL"
            >
              {getFieldDecorator('basepath', {
                rules: [{
                  required: true, message: '请输入项目基本路径!'
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {getFieldDecorator('desc', {
                rules: [{
                  required: true, message: '请输入描述!'
                }]
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Table
          columns={columns}
          dataSource={data}
          title={() => <Button type="primary" onClick={this.addProject}>创建项目</Button>}
        />

      </div>
    );
  }
}

export default Form.create()(ProjectList);
