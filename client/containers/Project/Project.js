import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';
import { Subnav } from '../../components/index'
import { getProject } from '../../reducer/modules/project';
import Interface from './Interface/Interface.js'
import Activity from './Activity/Activity.js'
import Setting from './Setting/Setting.js'


@connect(
  state => {
    return {
      curProject: state.project.currProject
    }
  },
  {
    getProject
  }
)

export default class Project extends Component {

  static propTypes = {
    match: PropTypes.object,
    curProject: PropTypes.object,
    getProject: PropTypes.func,
    location: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getProject(this.props.match.params.id)
  }

  render() {
    const { match, location } = this.props;
    const routers = {
      activity: { name: '动态', path: "/project/:id/activity" },
      interface: { name: '接口', path: "/project/:id/interface/:action" },
      setting: { name: '设置', path: "/project/:id/setting" }
    }

    let key, defaultName;
    for (key in routers) {
      if (matchPath(location.pathname, {
        path: routers[key].path
      }) !== null) {
        defaultName = routers[key].name;
        break;
      }
    }

    return (
      <div>
        <Subnav
          default={defaultName}
          data={[{
            name: routers.interface.name,
            path: `/project/${match.params.id}/interface/api`
          }, {
            name: routers.setting.name,
            path: `/project/${match.params.id}/setting`
          }, {
            name: routers.activity.name,
            path: `/project/${match.params.id}/activity`
          }]} />
        <Switch>
          <Redirect exact from="/project/:id" to={`/project/${match.params.id}/interface/api`} />
          <Route path={routers.activity.path} component={Activity} />
          <Route path={routers.interface.path} component={Interface} />
          <Route path={routers.setting.path} component={Setting} />
        </Switch>
      </div>
    )
  }
}
