import './index.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import LeftMenu from './LeftMenu.js'
import List from './List.js'
import PropTypes from 'prop-types'
import Profile from './Profile.js'

@connect()
class User extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    console.log(this.props.match)
  }

  render () {
    
    
    return (
      <div>
        <section className="user-box">
         
          <LeftMenu  />
          <Route path={this.props.match.path + '/list'} component={List} />
          <Route path={this.props.match.path + '/profile/:uid'} component={Profile} />
        </section>
      </div>
    )   
  }
}

export default User