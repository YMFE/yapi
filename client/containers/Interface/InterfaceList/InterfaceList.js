import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

class InterfaceList extends Component {
  static propTypes = {
    projectMember: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  getInterfaceId () {
    const reg = /project\/(\d+)/g
    const url = location.href
    url.match(reg)
    return RegExp.$1
  }

  render () {
    const { projectMember } = this.props
    const getInterfaceId = this.getInterfaceId()

    return (
      <div className="interface-btngroup">
        <Link to={`/add-interface/${getInterfaceId}`}><Button className="interface-btn" type="primary" icon="plus">添加接口</Button></Link>
        <Button className="interface-btn" type="primary" onClick={projectMember} icon="user">管理成员</Button>
      </div>
    )
  }
}

export default InterfaceList
