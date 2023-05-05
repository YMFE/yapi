import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, matchPath } from 'react-router-dom'
import { Subnav } from '../../components/index'
import { fetchGroupMsg } from '../../reducer/modules/group'
import { setBreadcrumb } from '../../reducer/modules/user'
import { getProject } from '../../reducer/modules/project'
import Interface from './Interface/Interface.js'
import Activity from './Activity/Activity.js'
import Setting from './Setting/Setting.js'
import InterfaceTemplate from './InterfaceTemplate/InterfaceTemplate.js'
import Rule from './Rule/rule.js'
import ProjectMember from './Setting/ProjectMember/ProjectMember.js'
import ProjectData from './Setting/ProjectData/ProjectData.js'
import { Spin } from 'antd'
const plugin = require('client/plugin.js')
@connect(
  state => {
    return {
      curProject: state.project.currProject,
      currGroup: state.group.currGroup,
    }
  },
  {
    getProject,
    fetchGroupMsg,
    setBreadcrumb,
  },
)
export default class Project extends Component {
  static propTypes = {
    match: PropTypes.object,
    curProject: PropTypes.object,
    getProject: PropTypes.func,
    location: PropTypes.object,
    fetchGroupMsg: PropTypes.func,
    setBreadcrumb: PropTypes.func,
    history: PropTypes.object,
    currGroup: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  async UNSAFE_componentWillMount() {
    await this.props
      .getProject(this.props.match.params.id)
      .then()
      .catch(() => {
        this.props.history.push('/group/')
      })
    if (this.props.curProject.group_id) {
      await this.props.fetchGroupMsg(this.props.curProject.group_id)
    }

    this.props.setBreadcrumb([
      {
        name: this.props.currGroup.group_name,
        href: '/group/' + this.props.currGroup._id,
      },
      {
        name: this.props.curProject.name,
      },
    ])
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const currProjectId = this.props.match.params.id
    const nextProjectId = nextProps.match.params.id
    if (currProjectId !== nextProjectId) {
      await this.props.getProject(nextProjectId)
      await this.props.fetchGroupMsg(this.props.curProject.group_id)
      this.props.setBreadcrumb([
        {
          name: this.props.currGroup.group_name,
          href: '/group/' + this.props.currGroup._id,
        },
        {
          name: this.props.curProject.name,
        },
      ])
      document.title = this.props.curProject.name
        ? `项目 · ${this.props.curProject.name}`
        : '项目'
    }
  }

  render() {
    const { match, location } = this.props
    let routers = {
      interface: {
        name: 'API',
        path: '/project/:id/interface/:action',
        component: Interface,
      },
      interface_template: {
        name: '接口模板',
        path: '/project/:id/template',
        component: InterfaceTemplate,
      },
      rule: { name: '规则函数', path: '/project/:id/rule', component: Rule },
      data: {
        name: '数据管理',
        path: '/project/:id/data',
        component: ProjectData,
      },
      members: {
        name: '成员管理',
        path: '/project/:id/members',
        component: ProjectMember,
      },
      activity: {
        name: '操作记录',
        path: '/project/:id/activity',
        component: Activity,
      },
      setting: {
        name: '设置',
        path: '/project/:id/setting',
        component: Setting,
      },
    }

    // 将插件代码插入二级导航栏中
    plugin.emitHook('sub_nav', routers)
    let key, defaultName
    for (key in routers) {
      if (
        matchPath(location.pathname, {
          path: routers[key].path,
        }) !== null
      ) {
        defaultName = routers[key].name
        break
      }
    }

    let subnavData = []
    Object.keys(routers).forEach(key => {
      let item = routers[key]
      let value = {}
      if (key === 'interface') {
        value = {
          name: item.name,
          path: `/project/${match.params.id}/interface/api`,
        }
      } else {
        value = {
          name: item.name,
          path: item.path.replace(/:id/gi, match.params.id),
        }
      }
      if (key === 'wiki') {
        subnavData.unshift(value)
      } else {
        subnavData.push(value)
      }
    })

    if (Object.keys(this.props.curProject).length === 0) {
      return (
        <Spin
          size="large"
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )
    }

    return (
      <div>
        <Subnav default={defaultName} data={subnavData} />
        <Switch>
          <Redirect
            exact
            from="/project/:id"
            to={`/project/${match.params.id}/interface/api`}
          />
          {Object.keys(routers).map(key => {
            let item = routers[key]
            return (
              <Route path={item.path} component={item.component} key={key} />
            )
          })}
        </Switch>
      </div>
    )
  }
}
