import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Button } from 'antd';
import './MemberList.scss'
import { autobind } from 'core-decorators';
import { fetchGroupMemberList } from '../../../reducer/modules/group.js'
const Option = Select.Option;

@connect(
  state => {
    return {
      currGroup: state.group.currGroup,
      uid: state.user.uid
    }
  },
  {
    fetchGroupMemberList
  }
)
class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      operable: false
    }
  }
  static propTypes = {
    currGroup: PropTypes.object,
    uid: PropTypes.number,
    fetchGroupMemberList: PropTypes.func
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
    }
  }

  componentDidMount() {
    this.props.fetchGroupMemberList(this.props.currGroup._id).then((res) => {
      this.setState({
        userInfo: res.payload.data.data
      });
    });
  }

  render() {
    console.log(this.props);
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
      render: (text, record) => (
        <div>
          <Select defaultValue={record.role} className="select" onChange={this.handleChange}>
            <Option value="owner">组长</Option>
            <Option value="dev">开发者</Option>
          </Select>
          <Button type="danger" icon="minus" className="btn-danger" />
        </div>
      )
    }];
    return (
      <div className="m-panel">
        <Table columns={columns} dataSource={this.state.userInfo} pagination={false} />
      </div>
    );
  }
}

export default MemberList;
