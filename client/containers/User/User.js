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
@connect(state=>{
  return {
    curUid: state.user.uid,
    userType: state.user.type,
    role: state.user.role
  }
},{

})
class User extends Component {
  static propTypes = {
    match: PropTypes.object,
    curUid: PropTypes.number,
    userType: PropTypes.string,
    role: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  render () {
    let navData = [{
      name: '用户资料',
      path: `/user/profile/${this.props.curUid}`
    }];
    if(this.props.role === "admin"){
      navData.push({
        name: '用户管理',
        path: '/user/list'
      })
    }

    return (
      <div>
        <Subnav
          default={'个人资料'}
          data={navData}/>
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
