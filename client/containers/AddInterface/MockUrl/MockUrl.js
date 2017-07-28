import '../AddInterface.scss'
import React, { Component } from 'react'
import { Button, message } from 'antd'
import Clipboard from 'clipboard'
import PropTypes from 'prop-types'

const success = () => {
  message.success('复制成功!')
}

class MockUrl extends Component {
  static propTypes = {
    mockURL: PropTypes.string,
    serverIp: PropTypes.string,
    mockData: PropTypes.string,
    projectData: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    setTimeout(this.clipboard, 500)
  }

  clipboard () {
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
    console.log(this.props)
    const { serverIp } = this.props
    return (
      <section className="mock-url-box">
        <span className="title">mock地址 : </span>
        <p id="mock-p">{this.props.mockURL}</p>
        <Button type="primary" id="mock-clipboard">复制</Button>
        <div className="host"><label>请配置host:</label> {this.props.projectData.prd_host} { serverIp }</div>
      </section>
    )
  }
}

export default MockUrl