import React, { PureComponent as Component } from 'react'
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import ProjectMessage from './ProjectMessage/ProjectMessage.js';
import ProjectEnv from './ProjectEnv/ProjectEnv.js';
const TabPane = Tabs.TabPane;

import './Setting.scss';

class Setting extends Component {
  static propTypes = {
    match: PropTypes.object
  }
  render () {
    const id = this.props.match.params.id;
    return (
      <div className="g-row">
        <Tabs type="card" className="has-affix-footer">
          <TabPane tab="项目配置" key="1">
            <ProjectMessage projectId={+id}/>
          </TabPane>
          <TabPane tab="环境配置" key="2">
            <ProjectEnv projectId={+id} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Setting;
