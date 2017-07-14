import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Button } from 'antd'
import { autobind } from 'core-decorators';

import {
  fetchGroupList,
  fetchCurrGroup,
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
    fetchCurrGroup,
    addGroup
  }
)
export default class GroupList extends Component {

  static propTypes = {
    groupList: PropTypes.array,
    currGroup: PropTypes.string,
    addGroup: PropTypes.func,
    fetchGroupList: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchGroupList();
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
        <div>{currGroup}</div>
        {
          groupList.map((group, index) => (
            <div key={index}>{group.group_name}</div>
          ))
        }
      </Card>
    )
  }
}
