import React, { Component } from 'react'

class InterfaceList extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <ul className="interface-list">
        <li className="active">添加接口</li>
        <li>管理项目成员</li>
      </ul>
    )
  }
}

export default InterfaceList