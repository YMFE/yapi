import React, { Component } from 'react'
import { Button } from 'antd'
import ReqList from './ReqList.js'

class ReqHeader extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <section>
        <div className="req-header">
          <strong className="req-h3">请求头部 :</strong>
          <ul>
            <ReqList />
          </ul>
        </div>
        <Button type="primary" className="req-save">添加</Button>
      </section>
    )
  }
}

export default ReqHeader