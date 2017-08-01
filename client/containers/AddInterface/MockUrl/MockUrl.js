import '../AddInterface.scss'
import React, { Component } from 'react'
import { message } from 'antd'
import Clipboard from 'clipboard'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  addInterfaceClipboard
} from '../../../actions/addInterface.js'

const success = () => {
  message.success('复制成功!')
}

@connect(
  () => {
    return {}
  },
  {
    addInterfaceClipboard
  }
)

class MockUrl extends Component {
  static propTypes = {
    mockURL: PropTypes.string,
    serverIp: PropTypes.string,
    mockData: PropTypes.string,
    showMock: PropTypes.string,
    projectData: PropTypes.object,
    addInterfaceClipboard: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.props.addInterfaceClipboard(this.clipboard)
    setTimeout(this.clipboard, 500)
  }

  clipboard () {
    document.querySelector('#clipboard-button').innerHTML = '<button id="mock-clipboard">复制</button>'
    const btn = document.querySelector('#mock-clipboard')
    const txt = document.querySelector('#mock-p').innerHTML
    
    new Clipboard(btn, {
      text: () => txt,
      target () {
        success()
      }
    })
  }

  render () {
    const { serverIp, showMock } = this.props

    return (
      <section className={`mock-url-box ${showMock}`}>
        <span className="title">mock地址 : </span>
        <p id="mock-p">{this.props.mockURL}</p>
        <span id="clipboard-button"></span>
        <div className="host"><label>请配置host:</label> { serverIp }&nbsp;{this.props.projectData.prd_host} </div>
      </section>
    )
  }
}

export default MockUrl
