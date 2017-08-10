import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class GroupList extends Component {

  static propTypes = {
    children: PropTypes.element
  }

  state = {
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render () {
    return (
      <div>
        我是项目页喔
        {this.props.children}
      </div>
    )
  }
}
