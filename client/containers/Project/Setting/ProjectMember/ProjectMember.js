import React, { Component } from 'react'
import { Card } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchGroupMemberList } from '../../../../reducer/modules/group.js';
import '../Setting.scss';

@connect(
  state => {
    return {
      projectMsg: state.project.projectMsg
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
      groupMemberList: []
    }
  }
  static propTypes = {
    projectMsg: PropTypes.object,
    fetchGroupMemberList: PropTypes.func
  }
  async componentWillMount() {
    const groupMemberList = await this.props.fetchGroupMemberList(this.props.projectMsg.group_id);
    console.log(groupMemberList);
    this.setState({
      groupMemberList: groupMemberList.payload.data.data
    })
  }

  render () {
    console.log(this.state);
    return (
      <div className="m-panel">
        <Card title="分组">
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    )
  }
}

export default ProjectMember;
