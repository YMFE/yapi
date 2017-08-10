import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom';
import { Subnav } from '../../components/index'

export default class GroupList extends Component {

  static propTypes = {
    children: PropTypes.element
  }

  state = {
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render () {
    return (
      <div>
        <Subnav
          default={'接口'}
          data={[{
            name: '接口',
            path: '/project/:id/activity'
          }, {
            name: '设置',
            path: '/project/:id/setting'
          }, {
            name: '动态',
            path: '/project/:id/activity'
          }]}/>
        <Switch>
          <Redirect exact from='/project/:id' to='/project/:id/interface' />
          <Route path="/project/:id/activity" component={null} />
          <Route path="/project/:id/interface" component={null} />
          <Route path="/project/:id/setting" component={null} />
        </Switch>
      </div>
    )
  }
}
