import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

@connect(
  state => {
    return {
      resParams: state.addInterface.resParams,
      reqParams: state.addInterface.reqParams
    }
  }
)

class Result extends Component {
  static propTypes = {
    resParams: PropTypes.string,
    reqParams: PropTypes.string,
    isSave: PropTypes.bool,
    mockJson: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  render () { 
    const { mockJson } = this.props

    return (
      <div className="result">
        <Card title="Mock 结果" style={{ width: 500 }}>
          <pre>{mockJson}</pre>
        </Card>
      </div>
    )
  }
}

export default Result
