import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Button } from 'antd'
import { autobind } from 'core-decorators';

import {
  fetchGroupList,
  setCurrGroup,
  addGroup
} from '../../../actions/group.js'

import './GroupList.scss'

@connect(
  state => ({
    groupList: state.group.groupList,
    currGroup: state.group.currGroup
  }),
  {
    fetchGroupList,
    setCurrGroup,
    addGroup
  }
)
export default class GroupList extends Component {

  static propTypes = {
    groupList: PropTypes.array,
    currGroup: PropTypes.object,
    addGroup: PropTypes.func,
    fetchGroupList: PropTypes.func,
    setCurrGroup: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchGroupList().then(() => {
      const currGroup = this.props.groupList[0] || { group_name: '' };
      this.props.setCurrGroup(currGroup)
    });
  }

  @autobind
  addGroup() {
    this.props.addGroup('group');
  }

  render () {
    const { groupList, currGroup } = this.props;

    return (
      <Card title="Groups">
        <Button type="primary" onClick={this.addGroup}>添加分组</Button>
        <div>{currGroup.group_name}</div>
        {
          groupList.map((group, index) => (
            <div key={index}>{group.group_name}</div>
          ))
        }
      </Card>
    )
  }
}
