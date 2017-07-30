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
    const { value: { username='' } } = this.props

    return (
      <span onClick={this.closeTags}>
        {username}
        <Icon className="dynamic-delete-button" type="minus-circle-o" />
      </span>
    )
  }
}

export default ModeTags
