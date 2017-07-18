import React, { Component } from 'react'
import { Button } from 'antd'
import ParamsList from './ParamsList.js'

class ResParams extends Component {
  constructor(props) {
    super(props)
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

        <Button type="primary" className="res-save">添加</Button>
      </section>
    )
  }
}

export default ResParams