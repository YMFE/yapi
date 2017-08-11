import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom';
import { Subnav } from '../../components/index'
import { Interface } from './Interface/Interface.js'

export default class GroupList extends Component {

  static propTypes = {
    match: PropTypes.object
  }

  state = {
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render () {
    const { match } = this.props;
    return (
      <div>
        <Subnav
          default={'接口'}
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
          <Redirect exact from='/project/:id' to={`/project/${match.params.id}/interface`} />
          <Route path="/project/:id/activity" component={null} />
          <Route path="/project/:id/interface" component={Interface} />
          <Route path="/project/:id/setting" component={null} />
        </Switch>
      </div>
    )
  }
}
