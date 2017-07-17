import React, { Component } from 'react'
import PropTypes from 'prop-types'

class InterfaceList extends Component {
  static propTypes = {
    projectMember: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  render () {
    const { projectMember } = this.props

    return (
      <ul className="interface-list">
        <li className="active">个人资料</li>
        <li onClick={projectMember}>用户管理</li>
      </ul>
    )
  }
}

export default InterfaceList