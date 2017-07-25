import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import wangEditor from 'wangeditor'
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
      console.log(html)
      html = html.match(/{.*}/g)[0]
      html = html.replace(reg, '')
      console.log(html)
      this.props.getResParams(html)
    }
    setTimeout(() => {
      this.initResParams()
    }, 400)
    editor.create()
  }

  render () {
    return (
      <section>
        <div className="res-params">
          <strong className="res-h3">返回参数 :</strong>
          <div id="res-cover"></div>
        </div>
      </section>
    )
  }
}

export default ResParams
