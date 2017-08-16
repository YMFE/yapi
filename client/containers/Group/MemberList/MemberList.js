import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Button, Modal, Row, Col, AutoComplete, message } from 'antd';
import './MemberList.scss'
import axios from 'axios'
import { autobind } from 'core-decorators';
import { fetchGroupMemberList, fetchGroupMsg, addMember } from '../../../reducer/modules/group.js'
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
    addMember
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
    role: PropTypes.string
  }

  @autobind
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
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
        // 添加成功后重新获取分组成员列表
        this.props.fetchGroupMemberList(this.props.currGroup._id).then((res) => {
          this.setState({
            userInfo: arrayAddKey(res.payload.data.data),
            visible: false
          });
        });
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
  onSelect (userName) {
    this.state.dataSource.forEach((item) => {
      if (item.username === userName) {
        this.setState({
          inputUid: item.id
        });
      }
    });
  }

  @autobind
  changeMemberRole(e) {
    console.log(e);
  }

  @autobind
  handleSearch (value) {
    this.setState({
      userName: value
    })
    const params = { q: value}

    axios.get('/api/user/search', { params })
      .then(data => {
        const userList = []
        data = data.data.data
        if (data) {
          data.forEach( v => userList.push({
            username: v.username,
            id: v.uid
          }));
          this.setState({
            dataSource: userList
          })
        }
      })
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
      title: (this.state.role === 'owner' || this.state.role === 'admin') ? <div className="btn-container"><Button className="btn" type="primary" icon="plus" onClick={this.showModal}>添加成员</Button></div> : '',
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
              <Button type="danger" icon="minus" className="btn-danger" />
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
              <AutoComplete
                defaultValue={[]}
                dataSource={this.state.dataSource.map(i => i.username)}
                style={{ width: 350 }}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder="请输入用户名"
                size="large"
              />
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
