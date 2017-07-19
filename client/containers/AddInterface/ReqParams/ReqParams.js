import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ParamsList from './ParamsList.js'
import { autobind } from 'core-decorators'
import { 
  addReqParams
} from '../../../actions/addInterface.js'

@connect(
  state => {
    return {
      seqParams: state.addInterface.seqParams
    }
  },
  {
    addReqParams
  }
)

class ReqParams extends Component {
  static propTypes = {
    addReqParams: PropTypes.func,
    seqParams: PropTypes.array
  }

  constructor(props) {
    super(props)
  }

  @autobind
  addSeqParams () {
    let newSeqParams= []
    let seqParams = this.props.seqParams
    let id = seqParams[seqParams.length-1].id
    let list = {
      id: ++id,
      paramsName: '',
      describe: ''
    }
    seqParams.push(list)
    newSeqParams.push(...seqParams)
    // this.props.addReqParams(newSeqParams)
  }

  render () {
    return (
      <section>
        <div className="req-params">
          <strong className="req-h3">请求参数 :</strong>
          <ul>
            <ParamsList />
          </ul>
        </div>

        <Button type="primary" className="req-save" onClick={this.addSeqParams}>添加</Button>
      </section>
    )
  }
}

export default ReqParams