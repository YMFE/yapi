import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import wangEditor from 'wangeditor'
import { getReqParams } from '../../../actions/addInterface.js'

@connect(
  state => {
    return {
      reqParams: state.addInterface.reqParams
    }
  },
  {
    getReqParams
  }
)

class ReqParams extends Component {
  static propTypes = {
    reqParams: PropTypes.string,
    getReqParams: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    const reg = /(<p>)|(<\/p>)|&nbsp;|(<br>)|\s+/g
    const E = wangEditor
    const editor = new E('#req-cover')
    editor.customConfig.menus = []
    editor.customConfig.onchange = html => {
      html = html.replace(reg, '')
      this.props.getReqParams(html)
    }
    editor.create()
  }
  
  render () {
    return (
      <section>
        <div className="req-params">
          <strong className="req-h3">请求参数 :</strong>
          <div id="req-cover"></div>
        </div>
      </section>
    )
  }
}

export default ReqParams
