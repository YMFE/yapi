import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import ParamsList from './ParamsList.js'
import { addResParams } from '../../../actions/addInterface.js'

@connect(
  state => {
    return {
      resParams: state.addInterface.resParams
    }
  },
  {
    addResParams
  }
)

class ResParams extends Component {
  static propTypes = {
    resParams: PropTypes.array,
    addResParams: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  @autobind
  addResParams () {
    let newResParams = []
    let resParams = this.props.resParams
    let id = resParams[resParams.length-1].id    
    let list = {
      id: ++id,
      tag: '',
      content: ''
    }
    resParams.push(list)
    newResParams.push(...resParams)
    this.props.addResParams(newResParams)
  }

  render () {
    return (
      <section>
        <div className="res-params">
          <strong className="res-h3">返回参数 :</strong>
          <ul>
            <ParamsList />
          </ul>
        </div>

        <Button type="primary" className="res-save" onClick={this.addResParams}>添加</Button>
      </section>
    )
  }
}

export default ResParams