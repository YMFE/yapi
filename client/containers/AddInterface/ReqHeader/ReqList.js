import React, { Component } from 'react'
import { Select, Input } from 'antd'

class ReqList extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    const Option = Select.Option

    return (
      <li>
        <em className="title">头部标签</em>
        <Select defaultValue="HTTP" style={{ width: 220 }} onChange={this.handleChange} size="large">
          <Option value="HTTP">Accept</Option>
          <Option value="Accept-Charset">Accept-Charset</Option>
          <Option value="Accept-Encoding">Accept-Encoding</Option>
          <Option value="Accept-Language">Accept-Language</Option>
          <Option value="Accept-Ranges">Accept-Ranges</Option>
        </Select>
        <em className="title">头部内容</em>
        <Input placeholder="Basic usage" className="req-content" size="large" />
        <span className="close">×</span>
      </li>
    )
  }
}

export default ReqList
