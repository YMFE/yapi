import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import wangEditor from 'wangeditor'
import { Card } from 'antd'
import { getResParams } from '../../../actions/addInterface.js'

const editor = new wangEditor('#res-cover')

@connect(
  state => {
    return {
      resParams: state.addInterface.resParams
    }
  },
  {
    getResParams
  }
)

class ResParams extends Component {
  static propTypes = {
    resParams: PropTypes.string,
    getResParams: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  initResParams () {
    const { resParams } = this.props
    if (resParams) {
      editor.txt.html(resParams)
    }
  }

  componentDidMount () {
    const reg = /(<p>)|(<\/p>)|&nbsp;|(<br>)|\s+|<div>|<\/div>/g
    editor.customConfig.menus = []
    editor.customConfig.onchange = html => {
      html = html.replace(reg, '')
      this.props.getResParams(html)
    }
    setTimeout(() => {
      this.initResParams()
    }, 400)
    editor.create()
  }

  render () {
    return (
      <section className="res-params-box">
        <Card title="返回 Mock" style={{ width: 500 }}>
          <div id="res-cover"></div>
        </Card>
      </section>
    )
  }
}

export default ResParams
