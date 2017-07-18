import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Select, Input } from 'antd'
import { 
  pushInputVal
} from '../../../actions/addInterFace.js'

@connect(
  () => {
    return {
      // reqInputVal: state.Interface.interfaceData
      reqInputVal: ''
    }
  },
  {
    pushInputVal
  }
)

class ReqMethod extends Component {
  static propTypes = {
    pushInputVal: PropTypes.func,
    reqInputVal: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  handleChange (value) {
    console.log(`selected ${value}`)
  }

  getInputVal (e) {
    const inputVal = e.target.value
    this.props.pushInputVal(inputVal)
  }

  render () {
    const { Option } = Select
    const getInputVal = this.getInputVal.bind(this)
    return (
      <table>
        <tbody>
          <tr>
            <th>协议 :</th>
            <td>
              <span className="h3">请求协议 {this.props.reqInputVal}</span>
              <Select defaultValue="HTTP" style={{ width: 220}} onChange={this.handleChange} size="large">
                <Option value="HTTP">HTTP</Option>
                <Option value="HTTPS">HTTPS</Option>
              </Select>
              <span className="h3">请求方式</span>
              <Select defaultValue="POST" style={{ width: 220 }} onChange={this.handleChange} size="large">
                <Option value="POST">POST</Option>
                <Option value="GET">GET</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <th>URL :</th>
            <td><Input placeholder="Basic usage" className="url" size="large" onBlur={getInputVal} /></td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default ReqMethod