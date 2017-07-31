import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input, Icon, Tooltip, Select, Popconfirm, message } from 'antd';
import { addProject, fetchProjectList, delProject, changeUpdateModal, changeTableLoading } from  '../../../actions/project';
import UpDateModal from './UpDateModal';
import { Link } from 'react-router-dom'
import variable from '../../../constants/variable';
import common from '../../../common';
import { autobind } from 'core-decorators';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

import './ProjectList.scss'

// 确认删除项目 handleDelete, currGroup._id, fetchProjectList
const deleteConfirm = (id, props) => {
  const { delProject, currGroup, fetchProjectList } = props;
  const handle = () => {
    delProject(id).then((res) => {
      if (res.payload.data.errcode == 0) {
        message.success('删除成功!')
        fetchProjectList(currGroup._id).then(() => {
        });
      } else {
        message.error(res.payload.data.errmsg);
      }
    });
  }
  return handle;
};

const getColumns = (data, props) => {
  const { changeUpdateModal, userInfo } = props;
  return [{
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      return <Link to={`/project/${record._id}`}>{text}</Link>
    }
  },{
    title: 'Mock基本URL',
    key: 'domain',
    render: (item) => {
      return 'http://'+ item.prd_host + item.basepath;
    }

  }, {
    title: '创建人',
    dataIndex: 'owner',
    key: 'owner',
    render: (text, record, index) => {
      // data是projectList的列表值
      // 根据序号找到对应项的uid，根据uid获取对应项目的创建人
      return <span>{userInfo[data[index].uid] ? userInfo[data[index].uid].username : ''}</span>;
    }
  }, {
    title: '创建时间',
    dataIndex: 'add_time',
    key: 'add_time',
    render: time => <span>{common.formatTime(time)}</span>
  }, {
    title: '操作',
    key: 'action',
    render: (text, record, index) => {
      const id = record._id;
      return (
        <span>
          <a onClick={() => changeUpdateModal(true, index)}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="你确定要删除项目吗?" onConfirm={deleteConfirm(id, props)} okText="确定" cancelText="取消">
            <a href="#">删除</a>
          </Popconfirm>
        </span>
      )}
  }];
}

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
      userInfo: state.project.userInfo,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup,
      total: state.project.total,
      currPage: state.project.currPage
    }
  },
  {
    fetchProjectList,
    addProject,
    delProject,
    changeUpdateModal,
    changeTableLoading
  }
)
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      protocol: 'http:\/\/',
      projectData: []
    }
  }
  static propTypes = {
    form: PropTypes.object,
    fetchProjectList: PropTypes.func,
    addProject: PropTypes.func,
    delProject: PropTypes.func,
    changeUpdateModal: PropTypes.func,
    changeTableLoading: PropTypes.func,
    projectList: PropTypes.array,
    userInfo: PropTypes.object,
    tableLoading: PropTypes.bool,
    currGroup: PropTypes.object,
    total: PropTypes.number,
    currPage: PropTypes.number
  }

  // 显示模态框 - 创建项目
  @autobind
  showAddProjectModal() {
    this.setState({
      visible: true
    });
  }

  // 确认添加项目
  @autobind
  handleOk(e) {
    const { form, currGroup, changeTableLoading, addProject, fetchProjectList } = this.props;
    const that = this;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        values.protocol = this.state.protocol.split(':')[0];
        // 获取当前分组id传入values
        values.group_id = currGroup._id;

        changeTableLoading(true);
        addProject(values).then((res) => {
          // 添加项目成功后再次请求列表
          if (res.payload.data.errcode == 0) {
            that.setState({
              visible: false
            });
            form.resetFields();
            message.success('创建成功! ');
            fetchProjectList(currGroup._id, this.props.currPage).then(() => {
              changeTableLoading(false);
            });
          } else {
            changeTableLoading(false);
            message.error(res.payload.data.errmsg);
          }
        }).catch(() => {
          changeTableLoading(false);
        });
      }
    });
  }

  // 取消修改
  @autobind
  handleCancel() {
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
  }

  // 修改线上域名的协议类型 (http/https)
  @autobind
  protocolChange(value) {
    this.setState({
      protocol: value
    })
  }

  // 分页逻辑
  @autobind
  paginationChange(pageNum) {
    this.props.fetchProjectList(this.props.currGroup._id, pageNum).then((res) => {
      if (res.payload.data.errcode) {
        message.error(res.payload.data.errmsg);
      } else {
        this.props.changeTableLoading(false);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // 切换分组
    if (this.props.currGroup !== nextProps.currGroup) {
      if (nextProps.currGroup._id) {
        this.props.fetchProjectList(nextProps.currGroup._id, this.props.currPage).then((res) => {
          if (res.payload.data.errcode) {
            message.error(res.payload.data.errmsg);
          } else {
            this.props.changeTableLoading(false);
          }
        });
      } else {
        // 无分组的时候停止loading状态
        this.props.changeTableLoading(false);
      }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="m-container">
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
                  required: true,
                  message: '请输入项目线上域名!'
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
                  required: true, message: '请输入项目基本路径'
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
        <UpDateModal/>
        <Button className="m-btn" icon="plus" type="primary"
          onClick={this.showAddProjectModal}
          disabled={this.props.currGroup._id ? false : true}>创建项目</Button>
        <Table
          className="m-table"
          bordered={true}
          loading={this.props.tableLoading}
          columns={getColumns(this.state.projectData, this.props)}
          dataSource={this.state.projectData}
          pagination={{
            total: this.props.total * variable.PAGE_LIMIT,
            defaultPageSize: variable.PAGE_LIMIT,
            onChange: this.paginationChange
          }}
        />

      </div>
    );
  }
}

export default Form.create()(ProjectList);
