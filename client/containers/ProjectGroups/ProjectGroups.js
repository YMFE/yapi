import React, { Component } from 'react';
import GroupList from './GroupList/GroupList.js';
import ProjectList from './ProjectList/ProjectList.js';
import Subnav from '../../components/Subnav/Subnav.js';
import { Row, Col } from 'antd';

import './ProjectGroups.scss'

export default class ProjectGroups extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Subnav data={[{
          name: '项目广场',
          path: '/test'
        }, {
          name: '我的关注',
          path: '/test'
        }]}/>
        <div className="g-doc">
          <Row gutter={16}>
            <Col span={6}>
              <GroupList></GroupList>
            </Col>
            <Col span={18}>
              <ProjectList/>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
