import React, { Component } from 'react'
import { Select, Input } from 'antd'

class ParamsList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const Option = Select.Option

    return (
      <li>
        <Select defaultValue="选填" style={{ width: 'auto' }} onChange={this.handleChange} size="large" className="required">
          <Option value="必填">必填</Option>
          <Option value="选填">选填</Option>
        </Select>   
        <em className="title">参数名称</em>
        <Input placeholder="参数名称" className="name" size="large" />
        <em className="title">参数说明</em>
        <Input placeholder="参数说明" className="name" size="large" />
        <span className="close">×</span>
      </li>
    )
  }
}

export default ParamsList