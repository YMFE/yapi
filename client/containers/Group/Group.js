import React, { Component } from 'react';
import GroupList from './GroupList/GroupList.js';
import ProjectList from './ProjectList/ProjectList.js';
import MemberList from './MemberList/MemberList.js';
// import Subnav from '../../components/Subnav/Subnav.js';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Tabs, Layout } from 'antd';
const { Content, Footer, Sider } = Layout;
const TabPane = Tabs.TabPane;

import './Group.scss'

export default class Group extends Component {
  constructor(props) {
    super(props)
  }

  render () {

    const GroupContent = (
      <Layout>
        <Sider style={{ height: 'auto'}} width={300}>
          <div className="logo" />
          <GroupList></GroupList>
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Tabs type="card" className="m-tab">
              <TabPane tab="项目列表" key="1"><ProjectList/></TabPane>
              <TabPane tab="成员列表" key="2"><MemberList/></TabPane>
            </Tabs>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
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
