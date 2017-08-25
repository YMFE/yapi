import React, { Component } from 'react'
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
const TabPane = Tabs.TabPane;
import ProjectMessage from './ProjectMessage/ProjectMessage.js';
import ProjectMember from './ProjectMember/ProjectMember.js';
import './Setting.scss';

class Setting extends Component {
  static propTypes = {
    match: PropTypes.object
  }
  render () {
    const id = this.props.match.params.id;
    return (
      <div className="g-row">
        <Tabs type="card" className="m-tab">
          <TabPane tab="项目信息" key="1"><ProjectMessage projectId={+id}/></TabPane>
          <TabPane tab="成员列表" key="2"><ProjectMember projectId={+id}/></TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Setting;
