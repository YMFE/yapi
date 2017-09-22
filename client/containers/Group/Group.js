import React, { Component } from 'react';
import GroupList from './GroupList/GroupList.js';
import ProjectList from './ProjectList/ProjectList.js';
import MemberList from './MemberList/MemberList.js';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Tabs, Layout } from 'antd';
const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

import './Group.scss';

export default class Group extends Component {
  constructor(props) {
    super(props)
  }

  render () {

    const GroupContent = (
      <Layout style={{minHeight: 'calc(100vh - 100px)', marginLeft: '24px', marginTop: '24px'}}>
        <Sider style={{ height: '100%', overflowY: 'scroll'}} width={300}>
          <div className="logo" />
          <GroupList></GroupList>
        </Sider>
        <Layout>
          <Content style={{ height: '100%', margin: '0 24px 0 16px', overflow: 'initial',backgroundColor: '#fff'}}>
            <Tabs type="card" className="m-tab" style={{height: '100%'}}>
              <TabPane tab="项目列表" key="1"><ProjectList/></TabPane>
              <TabPane tab="成员列表" key="2"><MemberList/></TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    )
    return (
      <div className="projectGround">
        <Switch>
          <Redirect exact from="/group" to="/group/0" />
          <Route path="/group/:groupId" render={() => GroupContent} />
        </Switch>
      </div>
    )
  }
}
