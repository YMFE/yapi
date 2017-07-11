import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card } from 'antd'

import {
  fetchGroupList,
  fetchCurrGroup
} from '../../actions/group.js'

import './GroupList.scss'

@connect(
  state => ({
    groupList: state.group.groupList,
    currGroup: state.group.currGroup,
  }),
  {
    fetchGroupList,
    fetchCurrGroup
  }
)
export default class GroupList extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    groupList: PropTypes.array,
    currGroup: PropTypes.string
  }

  render () {
    const { groupList, currGroup } = this.props;

    return (
      <Card title="Groups">
        <div>{currGroup}</div>
        {
          groupList.map((group, index) => (
            <div key={index}>{group}</div>
          ))
        }
      </Card>
    )
  }
}
