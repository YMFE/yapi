import React, { PureComponent as Component } from 'react';
import GroupList from './GroupList/GroupList.js';
import ProjectList from './ProjectList/ProjectList.js';
import MemberList from './MemberList/MemberList.js';
import GroupLog from './GroupLog/GroupLog.js';
import GroupSetting from './GroupSetting/GroupSetting.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Tabs, Layout } from 'antd';
const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
import { fetchNewsData } from '../../reducer/modules/news.js';
import './Group.scss';
@connect(
  state => {
    return {
      curGroupId: state.group.currGroup._id,
      curUserRole: state.user.role,
      curUserRoleInGroup: state.group.currGroup.role || state.group.role,
      currGroup: state.group.currGroup
    };
  },
  {
    fetchNewsData: fetchNewsData
  }
)
export default class Group extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    fetchNewsData: PropTypes.func,
    curGroupId: PropTypes.number,
    curUserRole: PropTypes.string,
    currGroup: PropTypes.object,
    curUserRoleInGroup: PropTypes.string
  };
  // onTabClick=(key)=> {
  //   // if (key == 3) {
  //   //   this.props.fetchNewsData(this.props.curGroupId, "group", 1, 10)
  //   // }
  // }
  render() {
    const GroupContent = (
      <Layout style={{ minHeight: 'calc(100vh - 100px)', marginLeft: '24px', marginTop: '24px' }}>
        <Sider style={{ height: '100%' }} width={300}>
          <div className="logo" />
          <GroupList />
        </Sider>
        <Layout>
          <Content
            style={{
              height: '100%',
              margin: '0 24px 0 16px',
              overflow: 'initial',
              backgroundColor: '#fff'
            }}
          >
            <Tabs type="card" className="m-tab tabs-large" style={{ height: '100%' }}>
              <TabPane tab="项目列表" key="1">
                <ProjectList />
              </TabPane>
              {this.props.currGroup.type === 'public' ? (
                <TabPane tab="成员列表" key="2">
                  <MemberList />
                </TabPane>
              ) : null}
              {['admin', 'owner', 'guest', 'dev'].indexOf(this.props.curUserRoleInGroup) > -1 ||
              this.props.curUserRole === 'admin' ? (
                <TabPane tab="分组动态" key="3">
                  <GroupLog />
                </TabPane>
              ) : (
                ''
              )}
              {(this.props.curUserRole === 'admin' || this.props.curUserRoleInGroup === 'owner') &&
              this.props.currGroup.type !== 'private' ? (
                <TabPane tab="分组设置" key="4">
                  <GroupSetting />
                </TabPane>
              ) : null}
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <div className="projectGround">
        <Switch>
          <Redirect exact from="/group" to="/group/0" />
          <Route path="/group/:groupId" render={() => GroupContent} />
        </Switch>
      </div>
    );
  }
}
