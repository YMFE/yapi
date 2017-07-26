import React, { Component } from 'react'
import { Tabs } from 'antd'
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
    const TabPane = Tabs.TabPane
    const { mockJson } = this.props
    console.log('mockJson', typeof mockJson, mockJson)
    return (
      <div className="result">
        <Tabs defaultActiveKey="1">
          <TabPane tab="成功结果" key="1">
            <pre>{mockJson}</pre>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Result
