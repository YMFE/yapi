import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { addProject, fetchProjectList, delProject, changeUpdateModal } from  '../../../reducer/modules/project';
import ProjectCard from '../../../components/ProjectCard/ProjectCard.js';
import ErrMsg from '../../../components/ErrMsg/ErrMsg.js';
import { autobind } from 'core-decorators';
import { setBreadcrumb } from  '../../../reducer/modules/user';

import './ProjectList.scss'

@connect(
  state => {
    return {
      projectList: state.project.projectList,
      userInfo: state.project.userInfo,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup,
      currPage: state.project.currPage
    }
  },
  {
    fetchProjectList,
    addProject,
    delProject,
    changeUpdateModal,
    setBreadcrumb
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
    projectList: PropTypes.array,
    userInfo: PropTypes.object,
    tableLoading: PropTypes.bool,
    currGroup: PropTypes.object,
    setBreadcrumb: PropTypes.func,
    currPage: PropTypes.number
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

  // 获取 ProjectCard 组件的关注事件回调，收到后更新数据
  @autobind
  receiveRes() {
    this.props.fetchProjectList(this.props.currGroup._id, this.props.currPage);
  }

  componentWillReceiveProps(nextProps) {
    this.props.setBreadcrumb([{name: '分组: ' + (nextProps.currGroup.group_name || '')}]);

    // 切换分组
    if (this.props.currGroup !== nextProps.currGroup) {
      if (nextProps.currGroup._id) {
        this.props.fetchProjectList(nextProps.currGroup._id, this.props.currPage)
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
    const projectData = this.state.projectData;
    return (
      <div className="m-panel card-panel card-panel-s">
        <Row gutter={16}>
          {projectData.length ? projectData.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <ProjectCard projectData={item} callbackResult={this.receiveRes} />
              </Col>);
          }) : <ErrMsg type="noProject"/>}
        </Row>
      </div>
    );
  }
}

export default ProjectList;
