import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Select, Input } from 'antd'
import { autobind } from 'core-decorators'
import { 
  pushInputValue,
  pushInterfaceName,
  pushInterfaceMethod
} from '../../../actions/addInterface.js'

@connect(
  state => {
    return {
      method: state.addInterface.method,
      url: state.addInterface.url,
      interfaceName: state.addInterface.interfaceName
    }
  },
  {
    pushInputValue,
    pushInterfaceName,
    pushInterfaceMethod
  }
)

class ReqMethod extends Component {
  static propTypes = {
    pushInputValue: PropTypes.func,
    pushInterfaceName: PropTypes.func,
    pushInterfaceMethod: PropTypes.func,
    url: PropTypes.string,
    method: PropTypes.string,
    interfaceName: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  @autobind
  handleChange (value) {
    this.props.pushInterfaceMethod(value)
  }

  @autobind
  getInputVal (e) {
    const url = e.target.value
    this.props.pushInputValue(url)
  }

  @autobind
  getInterfaceValue (e) {
    const name = e.target.value
    this.props.pushInterfaceName(name)
  }

  render () {
    const { Option } = Select
    const { url, interfaceName, method } = this.props

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <span className="h3">请求方式 : </span>
              <Select value={method} style={{ width: 180 }} onChange={this.handleChange} size="large">
                <Option value="">选择请求方式</Option>
                <Option value="POST">POST</Option>
                <Option value="GET">GET</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td>
              <span className="h3">URL : </span>
              <Input 
                placeholder="填写 URL" 
                className="url" 
                size="large" 
                onInput={this.getInputVal} 
                value={url}
              />
            </td>
          </tr>
          <tr>
            <td>
              <span className="h3">名称 : </span>
              <Input 
                placeholder="接口名称" 
                className="url" 
                size="large"
                value={interfaceName}
                onInput={this.getInterfaceValue} 
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default ReqMethod
