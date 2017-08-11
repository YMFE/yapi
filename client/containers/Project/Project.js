import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom';
import { Subnav } from '../../components/index'
import { getProject } from  '../../reducer/modules/project';
import Interface from './Interface/Interface.js'
import { Activity } from './Activity/Activity.js'
import { Setting } from './Setting/Setting.js'


@connect(
  state => {
    return {
      curProject: state.project.curProject
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
    getProject: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getProject(this.props.match.params.id)
  }

  render () {
    const { match } = this.props;
    return (
      <div>
        <Subnav
          default={'动态'}
          data={[{
            name: '接口',
            path: `/project/${match.params.id}/interface`
          }, {
            name: '设置',
            path: `/project/${match.params.id}/setting`
          }, {
            name: '动态',
            path: `/project/${match.params.id}/activity`
          }]}/>
        <Switch>
          <Redirect exact from="/project/:id" to={`/project/${match.params.id}/activity`}/>
          <Route path="/project/:id/activity" component={Activity} />
          <Route path="/project/:id/interface" component={Interface} />
          <Route path="/project/:id/setting" component={Setting} />
        </Switch>
      </div>
    )
  }
}
