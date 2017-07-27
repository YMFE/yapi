import './index.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import LeftMenu from './LeftMenu.js'
import List from './List.js'
import PropTypes from 'prop-types'
import Profile from './Profile.js'
import { Row, Col } from 'antd';

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
      <div className="g-doc">
        <Row gutter={16} className="user-box">
          <Col span={6}>
            <LeftMenu  />
          </Col>
          <Col span={18}>
            <Route path={this.props.match.path + '/list'} component={List} />
            <Route path={this.props.match.path + '/profile/:uid'} component={Profile} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default User
