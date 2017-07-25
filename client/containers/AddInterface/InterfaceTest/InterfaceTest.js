import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Button } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';

import {
} from '../../../actions/group.js'

import './InterfaceTest.scss'

// @connect(
//   state => ({
//   }),
//   {
//   }
// )
export default class InterfaceTest extends Component {

  static propTypes = {
  }

  state = {
    res: {}
  }

  constructor(props) {
    super(props)
  }

  @autobind
  testInterface() {
    crossRequest({
      url: 'http://petstore.swagger.io/v2/swagger.json',
      method: 'GET',
      data: {
        a:1
      },
      success: (res, header) => {
        this.setState({res})
        console.log(header)
      }
    })
  }


  render () {

    return (
      <div>
        <Button onClick={this.testInterface}>发送跨域请求</Button>
        <div>
          {this.state.res.toString()}
        </div>
      </div>
    )
  }
}
