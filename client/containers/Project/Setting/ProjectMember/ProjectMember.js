import React, { Component } from 'react'
import { Card, Badge } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchGroupMemberList } from '../../../../reducer/modules/group.js';
import '../Setting.scss';

@connect(
  state => {
    return {
      projectMsg: state.project.projectMsg,
      uid: state.user.uid
    }
  },
  {
    fetchGroupMemberList
  }
)
class ProjectMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupMemberList: [],
      groupName: ''
    }
  }
  static propTypes = {
    projectMsg: PropTypes.object,
    uid: PropTypes.number,
    fetchGroupMemberList: PropTypes.func
  }
  async componentWillMount() {
    const groupMemberList = await this.props.fetchGroupMemberList(this.props.projectMsg.group_id);
    console.log(groupMemberList);
    this.setState({
      groupMemberList: groupMemberList.payload.data.data,
      groupName: this.props.projectMsg.group_name
    })
  }

  render () {
    console.log(this.props);
    return (
      <div className="m-panel">
        <Card title={this.state.groupName + ' 分组成员 ' + '(' + this.state.groupMemberList.length + ')'} noHovering className="setting-group">
          {this.state.groupMemberList.map((item, index) => {
            console.log(this.props.uid);
            console.log(item);
            return (<div key={index} className="card-item">
              <img src={location.protocol + '//' + location.host + '/api/user/avatar?uid=' + item.uid} className="item-img" />
              <p className="item-name">{item.username}</p>
              {item.uid === this.props.uid ? <Badge count={'我'} style={{ backgroundColor: '#689bd0', marginLeft: '8px', borderRadius: '4px' }} /> : null}
              {item.role === 'owner' ? <p className="item-role">组长</p> : null}
              {item.role === 'dev' ? <p className="item-role">开发者</p> : null}
            </div>);
          })}
        </Card>
      </div>
    )
  }
}

export default ProjectMember;
