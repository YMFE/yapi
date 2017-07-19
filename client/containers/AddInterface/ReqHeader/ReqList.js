import React, { Component } from 'react'
import { Select, Input } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { 
  reqTagValue,
  reqHeaderValue,
  deleteReqHeader
} from '../../../actions/addInterface.js'

@connect(
  state => {
    return {
      seqGroup: state.addInterface.seqGroup,
      tagValue: state.addInterface.tagValue,
      headerValue: state.addInterface.headerValue,
      reqTagValue: state.addInterface.reqTagValue,
      reqHeaderValue: state.addInterface.reqHeaderValue
    }
  },
  {
    reqTagValue,
    reqHeaderValue,
    deleteReqHeader
  }
)

class ReqList extends Component {
  static propTypes = {
    headerValue: PropTypes.string,
    seqGroup: PropTypes.array,
    tagValue: PropTypes.string,
    reqTagValue: PropTypes.func,
    reqHeaderValue: PropTypes.func,
    deleteReqHeader: PropTypes.func,
    dataNum: PropTypes.number
  }

  constructor(props) {
    super(props)
  }

  handleChange (value) {
    this.props.reqTagValue(value)
  }

  handleBlur (e) {
    const value = e.target.value
    this.props.reqHeaderValue(value)
  }

  @autobind
  deleteReqHeader (e) {
    let newSeqGroup = []
    let seqGroup = this.props.seqGroup
    let dataNum = e.target.getAttribute('data-num')
    seqGroup.map(value => {
      if (+dataNum !== value.id) {
        newSeqGroup.push(value)
      }
    })
    this.props.deleteReqHeader(newSeqGroup)
  }

  render () {
    const Option = Select.Option
    const handleChange = this.handleChange.bind(this)
    const handleBlur = this.handleBlur.bind(this)
    const dataNum = this.props.dataNum

    return (
      <li>
        <em className="title">头部标签 {this.props.tagValue} {this.props.headerValue}</em>
        <Select defaultValue="HTTP" style={{ width: 220 }} onChange={handleChange} size="large">
          <Option value="HTTP">Accept</Option>
          <Option value="Accept-Charset">Accept-Charset</Option>
          <Option value="Accept-Encoding">Accept-Encoding</Option>
          <Option value="Accept-Language">Accept-Language</Option>
          <Option value="Accept-Ranges">Accept-Ranges</Option>
        </Select>
        <em className="title">头部内容</em>
        <Input placeholder="Basic usage" className="req-content" size="large" onBlur={handleBlur} />
        <span className="close" onClick={this.deleteReqHeader} data-num={dataNum}>×</span>
      </li>
    )
  }
}

export default ReqList
