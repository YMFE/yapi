import React, { Component } from 'react';
import GroupList from './GroupList/GroupList.js';
import ProjectList from './ProjectList/ProjectList.js';
import MemberList from './MemberList/MemberList.js';
// import Subnav from '../../components/Subnav/Subnav.js';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Row, Col, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import './Group.scss'

export default class Group extends Component {
  constructor(props) {
    super(props)
  }

  render () {

    const GroupContent = (
      <div className="g-row">
        <Row gutter={16}>
          <Col span={6}>
            <GroupList></GroupList>
          </Col>
          <Col span={18}>
            <Tabs type="card" className="m-tab">
              <TabPane tab="项目列表" key="1"><ProjectList/></TabPane>
              <TabPane tab="成员列表" key="2"><MemberList/></TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
    return (
      <div className='projectGround'>
        {/*<Subnav
          default={'项目广场'}
          data={[{
            name: '项目广场',
            path: '/group'
          }, {
            name: '我的关注',
            path: '/follow'
          }]}/>*/}
        <Switch>
          <Redirect exact from='/group' to='/group/0' />
          <Route path="/group/:groupId" render={() => GroupContent} />
        </Switch>
      </div>
    )
  }
}
