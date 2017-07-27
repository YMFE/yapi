import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import ReqList from './ReqList.js'
import { 
  addReqHeader
} from '../../../actions/addInterface.js'

// 重新渲染页面
const getReqList = function (self) {
  const [reqList, seqGroup] = [[], self.props.seqGroup]
  seqGroup.map((value, key) => {
    reqList.push(<ReqList key={key} value={value} dataNum={value.id} />)
  })
  return reqList
}

@connect(
  state => {
    return {
      seqGroup: state.addInterface.seqGroup
    }
  },
  {
    addReqHeader
  }
)

class ReqHeader extends Component {
  static propTypes = {
    seqGroup: PropTypes.array,
    addReqHeader: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  @autobind
  addSeqGroup () {
    let newSeqGroup = []
    let seqGroup = this.props.seqGroup
    let id = seqGroup[seqGroup.length-1].id    
    let list = {
      id: ++id,
      value: '',
      name: ''
    }
    seqGroup.push(list)
    newSeqGroup.push(...seqGroup)
    this.props.addReqHeader(newSeqGroup)
  }

  render () {
    return (
      <section>
        <div className="req-header">
          <ul>
            { getReqList(this) }
          </ul>
        </div>
        <Button type="primary" className="req-save" onClick={this.addSeqGroup}>添加</Button>
      </section>
    )
  }
}

export default ReqHeader
