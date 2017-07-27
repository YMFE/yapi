import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

class ModeTags extends Component {
  static propTypes = {
    value: PropTypes.object,
    _id: PropTypes.number,
    closeMember: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  @autobind
  closeTags () {
    const { closeMember, value: { _id } } = this.props
    closeMember(_id)
  }

  render() {
    const { value: { username='', _id } } = this.props
    console.log(this.props, _id, username)
    return (
      <span onClick={this.closeTags}>
        {username}
        <Icon className="dynamic-delete-button" type="minus-circle-o" />
      </span>
    )
  }
}

export default ModeTags
