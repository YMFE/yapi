import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ParamsList from './ParamsList.js'
import { autobind } from 'core-decorators'
import { 
  addReqParams
} from '../../../actions/addInterface.js'

// 重新渲染页面
const getReqList = function (self) {
  const [reqList, reqParams] = [[], self.props.reqParams]
  reqParams.map((value, key) => {
    reqList.push(<ParamsList key={key} dataNum={value.id} />)
  })
  return reqList
}

@connect(
  state => {
    return {
      reqParams: state.addInterface.reqParams
    }
  },
  {
    addReqParams
  }
)

class ReqParams extends Component {
  static propTypes = {
    addReqParams: PropTypes.func,
    reqParams: PropTypes.array
  }

  constructor(props) {
    super(props)
  }

  @autobind
  addSeqParams () {
    console.log(1)
    let newSeqParams= []
    let reqParams = this.props.reqParams
    let id = reqParams[reqParams.length-1].id
    let list = {
      id: ++id,
      paramsName: '',
      describe: ''
    }
    reqParams.push(list)
    newSeqParams.push(...reqParams)
    console.log(newSeqParams)
    this.props.addReqParams(newSeqParams)
  }

  render () {
    return (
      <section>
        <div className="req-params">
          <strong className="req-h3">请求参数 :</strong>
          <ul>
            { getReqList(this) }
          </ul>
        </div>

        <Button type="primary" className="req-save" onClick={this.addSeqParams}>添加</Button>
      </section>
    )
  }
}

export default ReqParams