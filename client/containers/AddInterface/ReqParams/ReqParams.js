import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import wangEditor from 'wangeditor'
import { getReqParams } from '../../../actions/addInterface.js'

const editor = new wangEditor('#req-cover')

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

  initParams () {
    const { reqParams } = this.props
    if (reqParams) {
      editor.txt.html(reqParams)
    }
  }

  componentDidMount () {
    const reg = /(<p>)|(<\/p>)|&nbsp;|(<br>)|\s+/g
    let json = ''
    editor.customConfig.menus = []
    editor.customConfig.onchange = html => {
      json = html.replace(reg, '')
      this.props.getReqParams(json)
    }
    setTimeout(() => {
      this.initParams()
    }, 500)
    editor.create()
  }
  
  render () {
    return (
      <section className="req-params-box">
        <div className="req-params">
          <strong className="req-h3">请求参数 :</strong>
          <div id="req-cover"></div>
        </div>
      </section>
    )
  }
}

export default ReqParams
