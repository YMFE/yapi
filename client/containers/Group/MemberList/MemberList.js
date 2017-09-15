import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Select, Button, Modal, Row, Col, message, Popconfirm } from 'antd';
import './MemberList.scss';
import { autobind } from 'core-decorators';
import { fetchGroupMemberList, fetchGroupMsg, addMember, delMember, changeMemberRole } from '../../../reducer/modules/group.js'
import ErrMsg from '../../../components/ErrMsg/ErrMsg.js';
import UsernameAutoComplete from '../../../components/UsernameAutoComplete/UsernameAutoComplete.js';
const Option = Select.Option;

function arrayAddKey (arr) {
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
      currGroup: state.group.currGroup,
      uid: state.user.uid,
      role: state.group.role
    }
  },
  {
    fetchGroupMemberList,
    fetchGroupMsg,
    addMember,
    delMember,
    changeMemberRole
  }
)
class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      role: '',
      visible: false,
      dataSource: [],
      inputUid: 0,
      inputRole: 'dev'
    }
  }
  static propTypes = {
    currGroup: PropTypes.object,
    uid: PropTypes.number,
    fetchGroupMemberList: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    addMember: PropTypes.func,
    delMember: PropTypes.func,
    changeMemberRole: PropTypes.func,
    role: PropTypes.string
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
    this.props.fetchGroupMemberList(this.props.currGroup._id).then((res) => {
      this.setState({
        userInfo: arrayAddKey(res.payload.data.data),
        visible: false
      });
    });
  }

  // 增 - 添加成员
  @autobind
  handleOk() {
    this.props.addMember({
      id: this.props.currGroup._id,
      member_uid: this.state.inputUid,
      role: this.state.inputRole
    }).then((res) => {
      if (!res.payload.data.errcode) {
        message.success('添加成功!');
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
      const id = this.props.currGroup._id;
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
    const id = this.props.currGroup._id;
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


  componentWillReceiveProps(nextProps) {
    if(this._groupId !== this._groupId){
      return null;
    }
    if (this.props.currGroup !== nextProps.currGroup) {
      this.props.fetchGroupMemberList(nextProps.currGroup._id).then((res) => {
        this.setState({
          userInfo: arrayAddKey(res.payload.data.data)
        });
      });
      this.props.fetchGroupMsg(nextProps.currGroup._id).then((res) => {
        this.setState({
          role: res.payload.data.data.role
        });
      })
    }
  }

  componentDidMount() {
    const currGroupId = this._groupId = this.props.currGroup._id;
    this.props.fetchGroupMsg(currGroupId).then((res) => {
      this.setState({
        role: res.payload.data.data.role
      });
    })
    this.props.fetchGroupMemberList(currGroupId).then((res) => {
      this.setState({
        userInfo: arrayAddKey(res.payload.data.data)
      });
    });
  }

  @autobind
  onUserSelect(childState) {
    this.setState({
      inputUid: childState.uid
    })
  }

  render() {
    const columns = [{
      title: this.props.currGroup.group_name + ' 分组成员 ('+this.state.userInfo.length + ') 人',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => {
        return (<div className="m-user">
          <img src={location.protocol + '//' + location.host + '/api/user/avatar?uid=' + record.uid} className="m-user-img" />
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
              <Select value={ record.role+'-'+record.uid} className="select" onChange={this.changeUserRole}>
                <Option value={ 'owner-'+record.uid}>组长{record.role}</Option>
                <Option value={'dev-'+record.uid}>开发者{record.role}</Option>
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
          } else {
            return '';
          }
        }
      }
    }];
    return (
      <div className="m-panel">
        <Modal
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
              </Select>
            </Col>
          </Row>
        </Modal>
        <Table columns={columns} dataSource={this.state.userInfo} pagination={false} locale={{emptyText: <ErrMsg type="noMemberInGroup"/>}} />
      </div>
    );
  }
}

export default MemberList;
