import './index.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
// import LeftMenu from './LeftMenu.js'
import List from './List.js'
import PropTypes from 'prop-types'
import Profile from './Profile.js'
import { Row } from 'antd';
import Subnav from '../../components/Subnav/Subnav.js';
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
        <Subnav
          default={'我的关注'}
          data={[{
            name: '项目广场',
            path: '/group'
          }, {
            name: '我的关注',
            path: '/follow'
          }]}/>
        <div className="g-doc">
          <Row gutter={16} className="user-box">
            <Route path={this.props.match.path + '/list'} component={List} />
            <Route path={this.props.match.path + '/profile/:uid'} component={Profile} />
          </Row>
        </div>
      </div>
    )
  }
}

export default User
