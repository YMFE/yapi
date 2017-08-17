import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Icon } from 'antd';
import { addProject, fetchProjectList, delProject, changeUpdateModal } from  '../../../reducer/modules/project';
import ProjectCard from '../../../components/ProjectCard/ProjectCard.js';
// import variable from '../../../constants/variable';
import { autobind } from 'core-decorators';

import './ProjectList.scss'

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
    changeUpdateModal
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
    total: PropTypes.number,
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

  // // 分页逻辑 取消分页
  // @autobind
  // paginationChange(pageNum) {
  //   this.props.fetchProjectList(this.props.currGroup._id, pageNum).then((res) => {
  //     if (res.payload.data.errcode) {
  //       message.error(res.payload.data.errmsg);
  //     } else {
  //       this.props.changeTableLoading(false);
  //     }
  //   });
  // }

  componentWillReceiveProps(nextProps) {
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
      <div className="m-panel">
        <Row gutter={16}>
          {projectData.length ? projectData.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <ProjectCard projectData={item} />
              </Col>);
          }) : (<div className="empty-tip">
            <p><Icon type="frown-o" /> 该分组还没有项目呢</p>
            <p>请点击右上角 “<Icon type="plus-circle" />” 按钮新建项目</p>
          </div>)}
        </Row>
      </div>
    );
  }
}

export default ProjectList;
