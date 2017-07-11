import React, { Component } from 'react'
import { Card } from 'antd'
import './GroupList.scss'

export default class GroupList extends Component {
  constructor(props) {
    super(props)
  }

  

  render () {
    return (
      <Card title="Groups">
        <div>MFE</div>
        <div>Hotel</div>
        <div>Train</div>
        <div>Flight</div>
        <div>Pay</div>
        <div>Vacation</div>
      </Card>
    )
  }
}
