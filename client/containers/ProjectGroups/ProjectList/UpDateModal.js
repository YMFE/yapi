import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Tooltip, Select, message, Button } from 'antd';
import { updateProject, fetchProjectList, delProject, changeUpdateModal, changeTableLoading } from  '../../../actions/project';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

import './ProjectList.scss'

// layout
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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
};
let uuid = 0;

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      isUpdateModalShow: state.project.isUpdateModalShow,
      handleUpdateIndex: state.project.handleUpdateIndex,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup
    }
  },
  {
    fetchProjectList,
    updateProject,
    delProject,
    changeUpdateModal,
    changeTableLoading
  }
)
class UpDateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocol: 'http:\/\/'
    }
  }
  static propTypes = {
    form: PropTypes.object,
    fetchProjectList: PropTypes.func,
    updateProject: PropTypes.func,
    delProject: PropTypes.func,
    changeUpdateModal: PropTypes.func,
    changeTableLoading: PropTypes.func,
    projectList: PropTypes.array,
    currGroup: PropTypes.object,
    isUpdateModalShow: PropTypes.bool,
    handleUpdateIndex: PropTypes.number
  }

  // 修改线上域名的协议类型 (http/https)
  protocolChange = (value) => {
    this.setState({
      protocol: value
    })
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.changeUpdateModal(false, -1);
  }

  handleOk = (e) => {
    e.preventDefault();
    const { form, updateProject, changeUpdateModal, currGroup, projectList, handleUpdateIndex, fetchProjectList, changeTableLoading } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        let assignValue = Object.assign(projectList[handleUpdateIndex], values);
        assignValue.prd_host = this.state.protocol + assignValue.prd_host;
        assignValue.env = assignValue.envs.map((item) => {
          console.log(assignValue);
          const arr = assignValue['envs-'+item].split(',');
          if (arr.length === 2) {
            return {
              host: arr[0],
              name: arr[1]
            }
          }
        });
        console.log(assignValue);

        changeTableLoading(true);
        updateProject(assignValue).then((res) => {
          if (res.payload.data.errcode == 0) {
            changeUpdateModal(false, -1);
            message.success('修改成功! ');
            fetchProjectList(currGroup._id).then((res) => {
              console.log(res);
              changeTableLoading(false);
            });
          } else {
            changeTableLoading(false);
            message.error(res.payload.data.errmsg);
          }
        }).catch((err) => {
          console.log(err);
          changeTableLoading(false);
        });
        form.resetFields();
      }
    });
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const envs = form.getFieldValue('envs');
    // We need at least one passenger
    if (envs.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      envs: envs.filter(key => key !== k)
    });
  }

  add = () => {
    uuid++;
    const { form } = this.props;
    // can use data-binding to get
    const envs = form.getFieldValue('envs');
    const nextKeys = envs.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      envs: nextKeys
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // const that = this;
    const { isUpdateModalShow, projectList, handleUpdateIndex } = this.props;
    let initFormValues = {};
    let envMessage = [];
    // 如果列表存在且用户点击修改按钮时，设置表单默认值
    if (projectList.length !== 0 && handleUpdateIndex !== -1 ) {
      // console.log(projectList[handleUpdateIndex]);
      const { name, basepath, desc, env } = projectList[handleUpdateIndex];
      initFormValues = { name, basepath, desc, env };
      if (env) {
        envMessage = env.map((item) => {
          return item.host + ',' + item.name;
        })
      }
      initFormValues.prd_host = projectList[handleUpdateIndex].prd_host.split('\/\/')[1];
      initFormValues.prd_protocol = projectList[handleUpdateIndex].prd_host.split('\/\/')[0] + '\/\/';
    }

    getFieldDecorator('envs', { initialValue: envMessage });
    const envs = getFieldValue('envs');
    const formItems = envs.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? (
            <span>环境配置&nbsp;
              <Tooltip title="依次输入环境域名(host)与环境名称，以英文逗号分隔">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>) : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`envs-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: envMessage.length !== 0 ? k : '',
            rules: [{
              required: false,
              whitespace: true,
              message: "请输入环境配置，放弃配置请清空输入框"
            }]
          })(
            <Input placeholder="请输入环境配置" style={{ width: '60%', marginRight: 8 }} />
          )}
          {envs.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={envs.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <Modal
        title="修改项目"
        visible={isUpdateModalShow}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>

          <FormItem
            {...formItemLayout}
            label="项目名称"
          >
            {getFieldDecorator('name', {
              initialValue: initFormValues.name,
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
              initialValue: initFormValues.prd_host,
              rules: [{
                required: true, message: '格式错误!',
                pattern: /.+\w$/
              }]
            })(
              <Input addonBefore={(
                <Select defaultValue={initFormValues.prd_protocol} onChange={this.protocolChange}>
                  <Option value="http://">{'http:\/\/'}</Option>
                  <Option value="https://">{'https:\/\/'}</Option>
                </Select>)} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="基本路径"
          >
            {getFieldDecorator('basepath', {
              initialValue: initFormValues.basepath,
              rules: [{
                required: true, message: '基本路径应以\'\/\'开头，以\'\/\'结尾! ',
                pattern: /^\/.+\/$/
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
              initialValue: initFormValues.desc,
              rules: [{
                required: true, message: '请输入描述!'
              }]
            })(
              <TextArea rows={4} />
            )}
          </FormItem>

          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加环境配置
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UpDateModal);
