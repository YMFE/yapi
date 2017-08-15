import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Button } from 'antd';
import './MemberList.scss'
import { autobind } from 'core-decorators';
import { fetchGroupMemberList, fetchGroupMsg } from '../../../reducer/modules/group.js'
const Option = Select.Option;

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
    fetchGroupMsg
  }
)
class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      role: ''
    }
  }
  static propTypes = {
    currGroup: PropTypes.object,
    uid: PropTypes.number,
    fetchGroupMemberList: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    role: PropTypes.string
  }

  @autobind
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currGroup !== nextProps.currGroup) {
      this.props.fetchGroupMemberList(nextProps.currGroup._id).then((res) => {
        this.setState({
          userInfo: res.payload.data.data
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
        userInfo: res.payload.data.data
      });
    });
  }

  render() {
    console.log(this.state);
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
        <Table columns={columns} dataSource={this.state.userInfo} pagination={false} />
      </div>
    );
  }
}

export default MemberList;
