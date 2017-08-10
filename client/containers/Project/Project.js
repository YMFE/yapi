import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom';

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
        我是项目页喔
        <Switch>
          <Route path="/project/:id/activity" component={null} />
          <Route path="/project/:id/interface" component={null} />
          <Route path="/project/:id/setting" component={null} />
        </Switch>
      </div>
    )
  }
}
