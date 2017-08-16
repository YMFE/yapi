import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Button, Modal, Row, Col, message, Popconfirm } from 'antd';
import './MemberList.scss';
import { autobind } from 'core-decorators';
import { fetchGroupMemberList, fetchGroupMsg, addMember, delMember } from '../../../reducer/modules/group.js'
import UsernameAutoComplete from '../../../components/UsernameAutoComplete/UsernameAutoComplete.js';
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
      currGroup: state.group.currGroup,
      uid: state.user.uid,
      role: state.group.role
    }
  },
  {
    fetchGroupMemberList,
    fetchGroupMsg,
    addMember,
    delMember
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
    role: PropTypes.string
  }

  @autobind
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  @autobind
  showAddMemberModal() {
    this.setState({
      visible: true
    });
  }

  @autobind
  reFetchList() {
    this.props.fetchGroupMemberList(this.props.currGroup._id).then((res) => {
      this.setState({
        userInfo: arrayAddKey(res.payload.data.data),
        visible: false
      });
    });
  }

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

  @autobind
  handleOk() {
    console.log(this.props.currGroup._id, this.state.inputUid);
    this.props.addMember({
      id: this.props.currGroup._id,
      member_uid: this.state.inputUid
    }).then((res) => {
      console.log(res);
      if (!res.payload.data.errcode) {
        message.success('添加成功!');
        this.reFetchList(); // 添加成功后重新获取分组成员列表
      }
    });
  }

  @autobind
  handleCancel() {
    // 取消模态框的时候重置模态框中的值
    this.setState({
      visible: false
    });
  }

  @autobind
  changeMemberRole(value) {
    return () => {
      console.log(this.props.currGroup._id, value);
    }
  }

  componentWillReceiveProps(nextProps) {
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
    const currGroupId = this.props.currGroup._id;
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
    console.log(childState);
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
              <Select defaultValue={record.role} className="select" onChange={this.handleChange}>
                <Option value="owner">组长</Option>
                <Option value="dev">开发者</Option>
              </Select>
              <Popconfirm placement="topRight" title="你确定要删除吗? " onConfirm={this.deleteConfirm(record.uid)} okText="确定" cancelText="">
                <Button type="danger" icon="minus" className="btn-danger" />
              </Popconfirm>
            </div>
          )
        } else {
          return '';
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
              <Select size="large" defaultValue="dev" className="select" onChange={this.changeMemberRole}>
                <Option value="owner">组长</Option>
                <Option value="dev">开发者</Option>
              </Select>
            </Col>
          </Row>
        </Modal>
        <Table columns={columns} dataSource={this.state.userInfo} pagination={false} />
      </div>
    );
  }
}

export default MemberList;
