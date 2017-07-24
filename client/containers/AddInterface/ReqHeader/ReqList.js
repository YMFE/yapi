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
    seqGroup: PropTypes.array,
    reqTagValue: PropTypes.func,
    reqHeaderValue: PropTypes.func,
    deleteReqHeader: PropTypes.func,
    _id: PropTypes.number,
    dataNum: PropTypes.number,
    value: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  @autobind
  handleChange (value) {
    const dir = 'AddInterface/edit'
    const url = location.href
    if (url.includes(dir)) {
      const { seqGroup, value: { id } } = this.props
      seqGroup[id].name = value
    } else {
      const { seqGroup, dataNum } = this.props
      seqGroup[dataNum].name = value
    }
  }

  @autobind
  handleBlur (e) {
    const value = e.target.value
    const { seqGroup, value: { id } } = this.props
    seqGroup[id].value = value
  }

  @autobind
  deleteReqHeader () {
    let newSeqGroup = []
    let seqGroup = this.props.seqGroup
    let id = this.props.value.id
    console.log(this.props)
    seqGroup.map(value => {
      if (+id !== value.id) {
        newSeqGroup.push(value)
      }
    })
    this.props.deleteReqHeader(newSeqGroup)
  }

  render () {
    const propsValue = this.props.value
    const Option = Select.Option
    const value = propsValue.value
    const name = propsValue.name || 'Accept'

    return (
      <li>
        <em className="title">头部标签</em>
        <Select defaultValue={name} style={{ width: 220 }} onChange={this.handleChange} size="large">
          <Option value="Accept">Accept</Option>
          <Option value="Accept-Charset">Accept-Charset</Option>
          <Option value="Accept-Encoding">Accept-Encoding</Option>
          <Option value="Accept-Language">Accept-Language</Option>
          <Option value="Accept-Ranges">Accept-Ranges</Option>
        </Select>
        <em className="title">头部内容</em>
        <Input defaultValue={value} placeholder="Basic usage" className="req-content" size="large" onBlur={this.handleBlur} />
        <span className="close" onClick={this.deleteReqHeader}>×</span>
      </li>
    )
  }
}

export default ReqList
