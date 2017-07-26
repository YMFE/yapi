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
    mockURL: PropTypes.string
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
    console.log('txt', txt)
    new Clipboard(btn, {
      text: () => txt,
      target () {
        success()
      }
    })
  }

  render () {
    return (
      <section className="mock-url-box">
        <p id="mock-p">{this.props.mockURL}</p>
        <Button type="primary" id="mock-clipboard">复制</Button>
      </section>
    )
  }
}

export default MockUrl