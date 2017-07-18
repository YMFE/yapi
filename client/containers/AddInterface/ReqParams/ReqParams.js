import React, { Component } from 'react'
import { Button } from 'antd'
import ParamsList from './ParamsList.js'

class ReqParams extends Component {
  constructor(props) {
    super(props)
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

        <Button type="primary" className="req-save">添加</Button>
      </section>
    )
  }
}

export default ReqParams