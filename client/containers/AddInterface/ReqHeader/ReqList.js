import React, { Component } from 'react'
import { Select, Input, Icon } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { 
  reqTagValue,
  reqHeaderValue,
  deleteReqHeader,
  addReqHeader
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
    deleteReqHeader,
    addReqHeader
  }
)

class ReqList extends Component {
  static propTypes = {
    seqGroup: PropTypes.array,
    reqTagValue: PropTypes.func,
    reqHeaderValue: PropTypes.func,
    deleteReqHeader: PropTypes.func,
    addReqHeader: PropTypes.func,
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
    const newObject = []

    if (url.includes(dir)) {
      const { seqGroup, value: { id } } = this.props
      seqGroup.forEach(v => {
        if (id == v.id) {
          v.name = value
        }
      })
      seqGroup.forEach(v => {
        const {id, name, value} = v
        newObject.push({id, name, value})
      })
      this.props.addReqHeader( newObject )
    } else {
      const { seqGroup, dataNum } = this.props
      seqGroup.forEach(v => {
        if (dataNum == v.id) {
          v.name = value
        }
      })
      seqGroup.forEach(v => {
        const {id, name, value} = v
        newObject.push({id, name, value})
      })      
      this.props.addReqHeader(newObject)
    }
  }

  @autobind
  handleBlur (e) {
    const value = e.target.value
    const { seqGroup, value: { id } } = this.props
    const newObject = []
    seqGroup.forEach(v => {
      if (id == v.id) {
        v.value = value
      }
    })    
    seqGroup.forEach(v => {
      const {id, name, value} = v
      newObject.push({id, name, value})
    })
    this.props.addReqHeader(newObject)
  }

  @autobind
  deleteReqHeader () {
    let newSeqGroup = []
    let seqGroup = this.props.seqGroup
    let id = this.props.value.id

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
    const value = propsValue.value || ''
    const name = propsValue.name || ''

    const headers = ["Accept","Accept-Charset","Accept-Encoding","Accept-Language","Accept-Datetime","Authorization","Cache-Control","Connection","Cookie","Content-Disposition","Content-Length","Content-MD5","Content-Type","Date","Expect","From","Host","If-Match","If-Modified-Since","If-None-Match","If-Range","If-Unmodified-Since","Max-Forwards","Origin","Pragma","Proxy-Authorization","Range","Referer","TE","User-Agent","Upgrade","Via","Warning","X-Requested-With","DNT","X-Forwarded-For","X-Forwarded-Host","X-Forwarded-Proto","Front-End-Https","X-Http-Method-Override","X-ATT-DeviceId","X-Wap-Profile","Proxy-Connection","X-UIDH","X-Csrf-Token"]
    const headersOptions = headers.map( (item, index) => {
      return <Option key={index} value={item}>{item}</Option>
    } )

    return (
      <li>
        <em className="title">头部标签 : </em>
        <Select value={name} style={{ width: 220 }} onChange={this.handleChange} size="large">
          <Option value="">选择请求头</Option>
          {headersOptions}
        </Select>
        <em className="title">头部内容 : </em>
        <Input value={value} placeholder="Basic usage" className="req-content" size="large" onInput={this.handleBlur} />
        <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={this.deleteReqHeader} />
      </li>
    )
  }
}

export default ReqList
