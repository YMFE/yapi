import React, { Component } from 'react'
import { Tag } from 'antd'
// import PropTypes from 'prop-types'

class ModeTags extends Component {
  // static propTypes = {
  //   closeProjectMember: PropTypes.func,
  // }

  constructor(props) {
    super(props)
  }

  closeTags () {

  }

  render() {
    // const { userName } = this.props

    return (
      <Tag closable onClose={this.closeTags}>小花</Tag>
    )
  }
}

export default ModeTags
