import React, { PureComponent as Component } from 'react'
import GroupList from './GroupList/GroupList.js'
import ProjectList from './ProjectList/ProjectList.js'
import MemberList from './MemberList/MemberList.js'
import GroupLog from './GroupLog/GroupLog.js'
import GroupSetting from './GroupSetting/GroupSetting.js'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Tabs, Layout } from 'antd'
import { setCurrGroup } from '../../reducer/modules/group'
import './Group.scss'
const { Content, Sider } = Layout
const TabPane = Tabs.TabPane

@connect(
  state => {
    return {
      curGroupId: state.group.currGroup._id,
      curUserRole: state.user.role,
      curUserRoleInGroup: state.group.currGroup.role || state.group.role,
      currGroup: state.group.currGroup,
    }
  },
  {
    setCurrGroup,
  },
)
export default class Group extends Component {
  constructor(props) {
    super(props)

    this.state = {
      groupId: props.curGroupId || -1,
    }
  }
  static propTypes = {
    curGroupId: PropTypes.number,
    curUserRole: PropTypes.string,
    currGroup: PropTypes.object,
    curUserRoleInGroup: PropTypes.string,
    setCurrGroup: PropTypes.func,
    location: PropTypes.object,
  }

  async componentDidMount() {
    const { pathname } = this.props.location
    if (this.state.groupId === -1 && !/group\/[0-9]+/.test(pathname)) {
      let r = await axios.get('/api/group/get_mygroup')
      try {
        let group = r.data.data
        this.setState({
          groupId: group._id,
        })
        this.props.setCurrGroup(group)
      } catch (e) {
        console.error(e)
      }
    }
  }

  render() {
    let defaultGroupTab = (
      <Tabs type="card" className="m-tab tabs-large" style={{ height: '100%' }}>
        <TabPane tab="项目列表" key="1">
          <ProjectList />
        </TabPane>
        <TabPane tab="成员列表" key="2">
          <MemberList />
        </TabPane>
        {['admin', 'owner', 'guest', 'dev'].indexOf(
          this.props.curUserRoleInGroup,
        ) > -1 || this.props.curUserRole === 'admin' ? (
          <TabPane tab="分组动态" key="3">
            <GroupLog />
          </TabPane>
        ) : (
          ''
        )}
        {(this.props.curUserRole === 'admin' ||
          this.props.curUserRoleInGroup === 'owner') &&
        this.props.currGroup.type !== 'private' ? (
          <TabPane tab="分组设置" key="4">
            <GroupSetting />
          </TabPane>
        ) : null}
      </Tabs>
    )

    const GroupContent = (
      <Layout className="group-main-container">
        <Sider theme='light' className="group-main-sider" width={300}>
          <div className="logo" />
          <GroupList />
        </Sider>
        <Layout>
          <Content className="group-main-content">{defaultGroupTab}</Content>
        </Layout>
      </Layout>
    )
    return (
      <div className="projectGround">
        <Switch>
          <Redirect exact from="/group" to={'/group/' + this.state.groupId} />
          <Route path="/group/:groupId" render={() => GroupContent} />
        </Switch>
      </div>
    )
  }
}
