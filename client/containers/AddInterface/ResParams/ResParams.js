import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import wangEditor from 'wangeditor'
import { getResParams } from '../../../actions/addInterface.js'

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

  componentDidMount () {
    const reg = /(<p>)|(<\/p>)|&nbsp;|(<br>)|\s+/g
    const E = wangEditor
    const editor = new E('#res-cover')
    editor.customConfig.menus = []
    editor.customConfig.onchange = html => {
      html = html.replace(reg, '')
      this.props.getResParams(html)
    }
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
