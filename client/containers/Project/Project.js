import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, matchPath } from 'react-router-dom';
import { Subnav } from '../../components/index';
import { fetchGroupMsg } from '../../reducer/modules/group';
import { setBreadcrumb } from '../../reducer/modules/user';
import { getProject } from '../../reducer/modules/project';
import Interface from './Interface/Interface.js'
import Activity from './Activity/Activity.js'
import Setting from './Setting/Setting.js'
import ProjectMember from './Setting/ProjectMember/ProjectMember.js';
import ProjectData from './Setting/ProjectData/ProjectData.js';

@connect(
  state => {
    return {
      curProject: state.project.currProject
    }
  },
  {
    getProject,
    fetchGroupMsg,
    setBreadcrumb
  }
)

export default class Project extends Component {

  static propTypes = {
    match: PropTypes.object,
    curProject: PropTypes.object,
    getProject: PropTypes.func,
    location: PropTypes.object,
    fetchGroupMsg: PropTypes.func,
    setBreadcrumb: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      currGroup: {}
    }
  }

  async componentWillMount() {
    await this.props.getProject(this.props.match.params.id);
    const groupMsg = await this.props.fetchGroupMsg(this.props.curProject.group_id);
    this.setState({
      currGroup: groupMsg.payload.data.data
    })
    this.props.setBreadcrumb([{
      name: groupMsg.payload.data.data.group_name,
      href: '/group/' + groupMsg.payload.data.data._id
    }, {
      name: this.props.curProject.name
    }]);
  }

  render() {
    const { match, location } = this.props;
    let routers = {
      activity: { name: '动态', path: "/project/:id/activity" },
      interface: { name: '接口', path: "/project/:id/interface/:action" },
      setting: { name: '设置', path: "/project/:id/setting" },
      members: { name: '成员管理', path: "/project/:id/members" },
      data: { name: '数据管理', path: "/project/:id/data" }
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

    let subnavData = [{
      name: routers.interface.name,
      path: `/project/${match.params.id}/interface/api`
    }, {
      name: routers.activity.name,
      path: `/project/${match.params.id}/activity`
    }, {
      name: routers.data.name,
      path: `/project/${match.params.id}/data`
    }, {
      name: routers.members.name,
      path: `/project/${match.params.id}/members`
    }, {
      name: routers.setting.name,
      path: `/project/${match.params.id}/setting`
    }];
    if(this.state.currGroup.type === 'private'){
      subnavData = subnavData.filter(item=>{
        return item.name != '成员管理'
      })
    }

    return (
      <div>
        <Subnav
          default={defaultName}
          data={subnavData} />
        <Switch>
          <Redirect exact from="/project/:id" to={`/project/${match.params.id}/interface/api`} />
          <Route path={routers.activity.path} component={Activity} />
          <Route path={routers.interface.path} component={Interface} />
          <Route path={routers.setting.path} component={Setting} />
          {this.state.currGroup.type !== 'private' ?
            <Route path={routers.members.path} component={ProjectMember} />
            : null
          }

          <Route path={routers.data.path} component={ProjectData} />
        </Switch>
      </div>
    )
  }
}
