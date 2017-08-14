import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message, Row, Col } from 'antd';
import { addProject, fetchProjectList, delProject, changeUpdateModal, changeTableLoading } from  '../../../reducer/modules/project';
import ProjectCard from '../../../components/ProjectCard/ProjectCard.js';
// import variable from '../../../constants/variable';
import { autobind } from 'core-decorators';

import './ProjectList.scss'

// 确认删除项目 handleDelete, currGroup._id, fetchProjectList
// const deleteConfirm = (id, props) => {
//   const { delProject, currGroup, fetchProjectList } = props;
//   const handle = () => {
//     delProject(id).then((res) => {
//       if (res.payload.data.errcode == 0) {
//         message.success('删除成功!')
//         fetchProjectList(currGroup._id).then(() => {
//         });
//       } else {
//         message.error(res.payload.data.errmsg);
//       }
//     });
//   }
//   return handle;
// };

// const getColumns = (data, props) => {
//   const { changeUpdateModal, userInfo } = props;
//   return [{
//     title: '项目名称',
//     dataIndex: 'name',
//     key: 'name',
//     render: (text, record) => {
//       return <Link to={`/project/${record._id}`}>{text}</Link>
//     }
//   },{
//     title: 'Mock基本URL',
//     key: 'domain',
//     render: (item) => {
//       return 'http://'+ item.prd_host + item.basepath;
//     }
//
//   }, {
//     title: '创建人',
//     dataIndex: 'owner',
//     key: 'owner',
//     render: (text, record, index) => {
//       // data是projectList的列表值
//       // 根据序号找到对应项的uid，根据uid获取对应项目的创建人
//       return <span>{userInfo[data[index].uid] ? userInfo[data[index].uid].username : ''}</span>;
//     }
//   }, {
//     title: '创建时间',
//     dataIndex: 'add_time',
//     key: 'add_time',
//     render: time => <span>{common.formatTime(time)}</span>
//   }, {
//     title: '操作',
//     key: 'action',
//     render: (text, record, index) => {
//       const id = record._id;
//       return (
//         <span>
//           <a onClick={() => changeUpdateModal(true, index)}>修改</a>
//           <span className="ant-divider" />
//           <Popconfirm title="你确定要删除项目吗?" onConfirm={deleteConfirm(id, props)} okText="确定" cancelText="取消">
//             <a href="#">删除</a>
//           </Popconfirm>
//         </span>
//       )}
//   }];
// }

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
    const projectData = this.state.projectData;
    return (
      <div className="m-panel">
        <Row gutter={16}>
          {projectData.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <ProjectCard projectData={item} />
              </Col>);
          })}
        </Row>
      </div>
    );
  }
}

export default ProjectList;
