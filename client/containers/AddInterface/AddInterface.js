import './AddInterface.scss'
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Button } from 'antd'
import ReqMethod from './ReqMethod/ReqMethod.js'
import ReqHeader from './ReqHeader/ReqHeader.js'
import ReqParams from './ReqParams/ReqParams.js'
import ResParams from './ResParams/ResParams.js'
import Result from './Result/Result.js'

class AddInterface extends Component {
  // static propTypes = {

  // }

  constructor (props) {
    super(props)
  }

  saveForms () {
    console.log(this)
  }

  render () {
    const saveForms = this.saveForms.bind(this)
    return (
      <section className="add-interface-box">
        <div className="content">
          <Button type="primary" className="save" onClick={saveForms}>保存</Button>
          <ReqMethod />
          <ReqHeader />
          <ReqParams />
          <ResParams />
          <Result />
        </div>
      </section>
    )
  }
}

export default AddInterface

    
