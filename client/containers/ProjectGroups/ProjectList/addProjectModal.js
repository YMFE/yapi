import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Tooltip, Select, message } from 'antd';
import { addProject, fetchProjectList, delProject } from  '../../../actions/project';
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
      isAddModalShow: state.project.isAddModalShow,
      currGroup: state.group.currGroup
    }
  },
  {
    fetchProjectList,
    addProject,
    delProject
  }
)
class addProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tabelLoading: true,
      protocol: 'http:\/\/',
      projectData: []
    }
  }
  static propTypes = {
    form: PropTypes.object,
    fetchProjectList: PropTypes.func,
    addProject: PropTypes.func,
    delProject: PropTypes.func,
    projectList: PropTypes.array,
    currGroup: PropTypes.object,
    isAddModalShow: PropTypes.bool
  }
  showAddProjectModal = () => {
    this.setState({
      visible: true
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.prd_host = this.state.protocol + values.prd_host;

        // 获取当前分组id传入values
        values.group_id = this.props.currGroup._id;

        console.log('Received values of form: ', values);
        this.setState({
          visible: false,
          tabelLoading: true
        });
        this.props.addProject(values).then((res) => {
          console.log(res);
          // 添加项目成功后再次请求列表
          this.props.fetchProjectList(this.props.currGroup._id).then((res) => {
            this.setState({
              tabelLoading: false
            });
            console.log(117,res);
          });
        }).catch((err) => {
          console.log(err);
          this.setState({
            tabelLoading: false
          });
        });
        this.props.form.resetFields();
      }
    });
  }

  // 取消修改
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

  componentWillReceiveProps(nextProps){
    // 切换分组
    if (this.props.currGroup !== nextProps.currGroup) {
      this.props.fetchProjectList(nextProps.currGroup._id).then((res) => {
        if (res.payload.data.errcode) {
          message.error(res.payload.data.errmsg);
        } else {
          this.setState({
            tabelLoading: false
          });
        }
      });
    }

    // 切换项目列表
    if (this.props.projectList !== nextProps.projectList) {
      // console.log(nextProps.projectList);
      const data = nextProps.projectList.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({
        projectData: data
      });
    }
  }
  componentWillMount() {
    console.log(this.props);
  }
  render() {
    console.log(12);
    const { getFieldDecorator } = this.props.form;
    console.log(this.props);
    return (
      <Modal
        title="创建项目"
        visible={true}
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
            label="基本路径"
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
    );
  }
}

export default Form.create()(addProjectModal);
