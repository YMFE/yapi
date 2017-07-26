import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class InterfaceList extends Component {
  static propTypes = {
    projectMember: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  getInterfaceId () {
    const reg = /Interface\/(\d+)/g
    const url = location.href
    url.match(reg)
    return RegExp.$1
  }

  render () {
    const { projectMember } = this.props
    const getInterfaceId = this.getInterfaceId()

    return (
      <ul className="interface-list">
        <li><Link to={`/AddInterface/${getInterfaceId}`}>添加接口</Link></li>
        <li onClick={projectMember}>管理项目成员</li>
      </ul>
    )
  }
}

export default InterfaceList
