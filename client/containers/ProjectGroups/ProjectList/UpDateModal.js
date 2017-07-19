import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Tooltip, Select, message } from 'antd';
import { updateProject, fetchProjectList, delProject, changeUpdateModal, changeTableLoading } from  '../../../actions/project';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

import './ProjectList.scss'

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
        let assignValue = Object.assign(projectList[handleUpdateIndex], values);
        assignValue.prd_host = this.state.protocol + assignValue.prd_host;

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

  render() {
    const { getFieldDecorator } = this.props.form;
    // const that = this;
    const { isUpdateModalShow, projectList, handleUpdateIndex } = this.props;
    let initFormValues = {};
    // 如果列表存在且用户点击修改按钮时，设置表单默认值
    if (projectList.length !== 0 && handleUpdateIndex !== -1 ) {
      console.log(projectList[handleUpdateIndex]);
      const { name, basepath, desc } = projectList[handleUpdateIndex];
      initFormValues = { name, basepath, desc };
      initFormValues.prd_host = projectList[handleUpdateIndex].prd_host.split('\/\/')[1];
      initFormValues.prd_protocol = projectList[handleUpdateIndex].prd_host.split('\/\/')[0] + '\/\/';
    }
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
                required: true, message: '请输入项目线上域名!'
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
              initialValue: initFormValues.desc,
              rules: [{
                required: true, message: '请输入描述!'
              }]
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UpDateModal);
