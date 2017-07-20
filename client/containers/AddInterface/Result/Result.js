import React, { Component } from 'react'
import { Tabs } from 'antd'

class Result extends Component {
  constructor(props) {
    super(props)
  }

  callback () {

  }

  render () {
    const TabPane = Tabs.TabPane

    return (
      <div className="result">
        <strong className="res-h3">返回示例 :</strong>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="成功结果" key="1">
            <textarea></textarea>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Result