import React, { Component } from 'react';
import GroupList from '../../components/GroupList/GroupList.js';
import ProjectList from './ProjectList';
import { Row, Col } from 'antd';

import './ProjectGroups.scss'

export default class ProjectGroups extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
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
    )
  }
}
