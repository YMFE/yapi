import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Button, Tooltip, Spin, notification } from 'antd'
import { Link } from 'react-router-dom'
import {
  addProject,
  fetchProjectList,
  delProject,
  changeUpdateModal,
} from '../../../reducer/modules/project'
import ProjectCard from '../../../components/ProjectCard/ProjectCard.js'
import ErrMsg from '../../../components/ErrMsg/ErrMsg.js'
import { setBreadcrumb } from '../../../reducer/modules/user'

import './ProjectList.scss'
const html = (
  <div>
    您没有权限,请切换到 <strong style={{ fontSize: '16px' }}>成员列表</strong>{' '}
    查看并联系该分组组长或管理员
  </div>
)
@connect(
  state => {
    return {
      projectList: state.project.projectList,
      userInfo: state.project.userInfo,
      tableLoading: state.project.tableLoading,
      currGroup: state.group.currGroup,
      currPage: state.project.currPage,
    }
  },
  {
    fetchProjectList,
    addProject,
    delProject,
    changeUpdateModal,
    setBreadcrumb,
  },
)
class ProjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      protocol: 'http://',
      projectData: [],
      groupLoading: true,
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
    currPage: PropTypes.number,
    studyTip: PropTypes.number,
    study: PropTypes.bool,
  }

  // 获取 ProjectCard 组件的关注事件回调，收到后更新数据

  receiveRes = () => {
    this.props.fetchProjectList(this.props.currGroup._id, this.props.currPage)
  }

  componentDidUpdate(prevProps) {
    let curGroupName = this.props.currGroup.group_name
    this.props.setBreadcrumb([{ name: '' + (curGroupName || '') }])

    // 切换分组
    if (
      prevProps.currGroup !== this.props.currGroup &&
      this.props.currGroup._id
    ) {
      this.setState({
        projectData: [],
        groupLoading: true,
      })
      this.props.fetchProjectList(this.props.currGroup._id, prevProps.currPage)
      document.title = curGroupName ? `分组 · ${curGroupName}` : ''
    }

    // 切换项目列表
    if (prevProps.projectList !== this.props.projectList) {
      const data = this.props.projectList.map((item, index) => {
        item.key = index
        return item
      })
      this.setState({
        projectData: data,
        groupLoading: false,
      })
    }
  }

  openNotificationWithIcon = type => {
    notification[type]({
      message: '无权限操作提示',
      description: html,
      duration: 8,
    })
  }

  render() {
    let projectData = this.state.projectData
    let noFollow = []
    let followProject = []
    for (var i in projectData) {
      if (projectData[i].follow) {
        followProject.push(projectData[i])
      } else {
        noFollow.push(projectData[i])
      }
    }
    followProject = followProject.sort((a, b) => {
      return b.up_time - a.up_time
    })
    noFollow = noFollow.sort((a, b) => {
      return b.up_time - a.up_time
    })
    projectData = [...followProject, ...noFollow]

    const isShow = /(admin)|(owner)|(dev)/.test(this.props.currGroup.role)

    const Follow = () => {
      return followProject.length ? (
        <Row>
          <h3 className="owner-type">我的关注</h3>
          {followProject.map((item, index) => {
            return (
              <Col md={12} lg={8} xl={6} xxl={4} key={index}>
                <ProjectCard
                  projectData={item}
                  callbackResult={this.receiveRes}
                />
              </Col>
            )
          })}
        </Row>
      ) : null
    }
    const NoFollow = () => {
      return noFollow.length ? (
        <Row style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}>
          <h3 className="owner-type">我的项目</h3>
          {noFollow.map((item, index) => {
            return (
              <Col xs={8} lg={6} xxl={4} key={index}>
                <ProjectCard
                  projectData={item}
                  callbackResult={this.receiveRes}
                  isShow={isShow}
                />
              </Col>
            )
          })}
        </Row>
      ) : null
    }

    const OwnerSpace = () => {
      return projectData.length ? (
        <div>
          <NoFollow />
          <Follow />
        </div>
      ) : (
        <ErrMsg type="noProject" />
      )
    }

    return (
      <div
        style={{ paddingTop: '24px' }}
        className="m-panel card-panel card-panel-s project-list"
      >
        <Row className="project-list-header">
          <Col span={16} style={{ textAlign: 'left' }}>
            {this.props.currGroup.group_name} 分组共 ({projectData.length})
            个项目
          </Col>
          <Col span={8}>
            {isShow ? (
              <Link to="/add-project">
                <Button type="primary">添加项目</Button>
              </Link>
            ) : (
              <Tooltip>
                <Button
                  type="primary"
                  onClick={() => this.openNotificationWithIcon('warning')}
                >
                  添加项目
                </Button>
              </Tooltip>
            )}
          </Col>
        </Row>
        {!this.state.groupLoading ? (
          <Row>
            {this.props.currGroup.type === 'private' ? (
              <OwnerSpace />
            ) : projectData.length ? (
              projectData.map((item, index) => {
                return (
                  <Col xs={8} lg={6} xxl={4} key={index}>
                    <ProjectCard
                      projectData={item}
                      callbackResult={this.receiveRes}
                      isShow={isShow}
                    />
                  </Col>
                )
              })
            ) : (
              <ErrMsg type="noProject" />
            )}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '200px' }}>
            <Spin spinning={this.state.groupLoading} />
          </div>
        )}
      </div>
    )
  }
}

export default ProjectList
