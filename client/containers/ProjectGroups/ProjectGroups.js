import React, { Component } from 'react'
import GroupList from '../../components/GroupList/GroupList.js'

export default class ProjectGroups extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div>
        <GroupList></GroupList>
      </div>
    )
  }
}
