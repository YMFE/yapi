import React, { PureComponent as Component } from 'react'
import { Table, Card, Badge, Select, Button, Modal, Row, Col, message, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { fetchGroupMsg } from '../../../../reducer/modules/group';
import { connect } from 'react-redux';
import ErrMsg from '../../../../components/ErrMsg/ErrMsg.js';
import { fetchGroupMemberList } from '../../../../reducer/modules/group.js';
import { getProjectMsg, getProjectMemberList, getProject, addMember, delMember, changeMemberRole } from '../../../../reducer/modules/project.js';
import UsernameAutoComplete from '../../../../components/UsernameAutoComplete/UsernameAutoComplete.js';
import '../Setting.scss';

const Option = Select.Option;

const arrayAddKey = (arr) => {
  return arr.map((item, index) => {
    return {
      ...item,
      key: index
    }
  });
}

@connect(
  state => {
    return {
      projectMsg: state.project.currProject,
      uid: state.user.uid
    }
  },
  {
    fetchGroupMemberList,
    getProjectMsg,
    getProjectMemberList,
    addMember,
    delMember,
    fetchGroupMsg,
    changeMemberRole,
    getProject
  }
)
class ProjectMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupMemberList: [],
      projectMemberList: [],
      groupName: '',
      role: '',
      visible: false,
      dataSource: [],
      inputUids: [],
      inputRole: 'dev'
    }
  }
  static propTypes = {
    match: PropTypes.object,
    projectId: PropTypes.number,
    projectMsg: PropTypes.object,
    uid: PropTypes.number,
    addMember: PropTypes.func,
    delMember: PropTypes.func,
    changeMemberRole: PropTypes.func,
    getProject: PropTypes.func,
    fetchGroupMemberList: PropTypes.func,
    getProjectMsg: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    getProjectMemberList: PropTypes.func
  }
  @autobind
  showAddMemberModal() {
    this.setState({
      visible: true
    });
  }

  // 重新获取列表
  @autobind
  reFetchList() {
    this.props.getProjectMemberList(this.props.match.params.id).then((res) => {
      this.setState({
        projectMemberList: arrayAddKey(res.payload.data.data),
        visible: false
      });
    });
  }

  // 增 - 添加成员
  @autobind
  handleOk() {
    this.props.addMember({
      id: this.props.match.params.id,
      member_uids: this.state.inputUids,
      role: this.state.inputRole
    }).then((res) => {
      if (!res.payload.data.errcode) {
        const { add_members, exist_members } = res.payload.data.data;
        const addLength = add_members.length;
        const existLength = exist_members.length;
        this.setState({
          inputRole: 'dev',
          inputUids: []
        })
        message.success(`添加成功! 已成功添加 ${addLength} 人，其中 ${existLength} 人已存在`);
        this.reFetchList(); // 添加成功后重新获取分组成员列表
      }
    });
  }
  // 添加成员时 选择新增成员权限
  @autobind
  changeNewMemberRole(value) {
    this.setState({
      inputRole: value
    });
  }

  // 删 - 删除分组成员
  @autobind
  deleteConfirm(member_uid) {
    return () => {
      const id = this.props.match.params.id;
      this.props.delMember({ id, member_uid }).then((res) => {
        if (!res.payload.data.errcode) {
          message.success(res.payload.data.errmsg);
          this.reFetchList(); // 添加成功后重新获取分组成员列表
        }
      });
    }
  }

  // 改 - 修改成员权限
  @autobind
  changeUserRole(e) {
    const id = this.props.match.params.id;
    const role = e.split('-')[0];
    const member_uid = e.split('-')[1];
    this.props.changeMemberRole({ id, member_uid, role }).then((res) => {
      if (!res.payload.data.errcode) {
        message.success(res.payload.data.errmsg);
        this.reFetchList(); // 添加成功后重新获取分组成员列表
      }
    });
  }

  // 关闭模态框
  @autobind
  handleCancel() {
    this.setState({
      visible: false
    });
  }

  @autobind
  onUserSelect(uids) {
    this.setState({
      inputUids: uids
    })
  }

  async componentWillMount() {
    await this.props.getProject(this.props.match.params.id)
    const groupMemberList = await this.props.fetchGroupMemberList(this.props.projectMsg.group_id);
    const groupMsg = await this.props.fetchGroupMsg(this.props.projectMsg.group_id);
    const rojectMsg = await this.props.getProjectMsg(this.props.match.params.id);
    const projectMemberList = await this.props.getProjectMemberList(this.props.match.params.id);
    this.setState({
      groupMemberList: groupMemberList.payload.data.data,
      groupName: groupMsg.payload.data.data.group_name,
      projectMemberList: arrayAddKey(projectMemberList.payload.data.data),
      role: rojectMsg.payload.data.data.role
    })
  }

  render() {
    const columns = [{
      title: this.props.projectMsg.name + ' 项目成员 (' + this.state.projectMemberList.length + ') 人',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => {
        return (<div className="m-user">
          <img src={'/api/user/avatar?uid=' + record.uid} className="m-user-img" />
          <p className="m-user-name">{text}</p>
        </div>);
      }
    }, {
      title: (this.state.role === 'owner' || this.state.role === 'admin') ? <div className="btn-container"><Button className="btn" type="primary" icon="plus" onClick={this.showAddMemberModal}>添加成员</Button></div> : '',
      key: 'action',
      className: 'member-opration',
      render: (text, record) => {
        if (this.state.role === 'owner' || this.state.role === 'admin') {
          return (
            <div>
              <Select value={record.role + '-' + record.uid} className="select" onChange={this.changeUserRole}>
                <Option value={'owner-' + record.uid}>组长</Option>
                <Option value={'dev-' + record.uid}>开发者</Option>
                <Option value={'guest-' + record.uid}>访客</Option>
              </Select>
              <Popconfirm placement="topRight" title="你确定要删除吗? " onConfirm={this.deleteConfirm(record.uid)} okText="确定" cancelText="">
                <Button type="danger" icon="minus" className="btn-danger" />
              </Popconfirm>
            </div>
          )
        } else {
          // 非管理员可以看到权限 但无法修改
          if (record.role === 'owner') {
            return '组长';
          } else if (record.role === 'dev') {
            return '开发者';
          } else if (record.role === 'guest') {
            return '访客';
          } else {
            return '';
          }
        }
      }
    }];
    return (
      <div className="g-row">
        <div className="m-panel">
          {this.state.visible ? <Modal
            title="添加成员"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Row gutter={6} className="modal-input">
              <Col span="5"><div className="label">用户名: </div></Col>
              <Col span="15">
                <UsernameAutoComplete callbackState={this.onUserSelect} />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="5"><div className="label">权限: </div></Col>
              <Col span="15">
                <Select size="large" defaultValue="dev" className="select" onChange={this.changeNewMemberRole}>
                  <Option value="owner">组长</Option>
                  <Option value="dev">开发者</Option>
                  <Option value="guest">访客</Option>
                </Select>
              </Col>
            </Row>
          </Modal> : ""}
          <Table columns={columns} dataSource={this.state.projectMemberList} pagination={false} locale={{ emptyText: <ErrMsg type="noMemberInProject" /> }} className="setting-project-member" />
          <Card bordered={false} title={this.state.groupName + ' 分组成员 ' + '(' + this.state.groupMemberList.length + ') 人'} noHovering className="setting-group">
            {this.state.groupMemberList.length ? this.state.groupMemberList.map((item, index) => {
              return (<div key={index} className="card-item">
                <img src={location.protocol + '//' + location.host + '/api/user/avatar?uid=' + item.uid} className="item-img" />
                <p className="item-name">{item.username}{item.uid === this.props.uid ? <Badge count={'我'} style={{ backgroundColor: '#689bd0', fontSize: '13px', marginLeft: '8px', borderRadius: '4px' }} /> : null}</p>
                {item.role === 'owner' ? <p className="item-role">组长</p> : null}
                {item.role === 'dev' ? <p className="item-role">开发者</p> : null}
                {item.role === 'guest' ? <p className="item-role">访客</p> : null}
              </div>);
            }) : <ErrMsg type="noMemberInGroup" />}
          </Card>
        </div>
      </div>
    )
  }
}

export default ProjectMember;
