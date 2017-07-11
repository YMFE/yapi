import React, { Component } from 'react'
import GroupList from '../../components/GroupList/GroupList.js'

import './ProjectGroups.scss'

export default class ProjectGroups extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div>
        <div className="groups-left">
          <GroupList></GroupList>
        </div>
      </div>
    )
  }
}
