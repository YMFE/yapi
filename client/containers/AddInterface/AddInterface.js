import './AddInterface.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { Button, Tabs } from 'antd'
import ReqMethod from './ReqMethod/ReqMethod.js'
import ReqHeader from './ReqHeader/ReqHeader.js'
import ReqParams from './ReqParams/ReqParams.js'
import ResParams from './ResParams/ResParams.js'
import Result from './Result/Result.js'
import { saveForms } from '../../actions/addInterface.js'

@connect(
  state => {
    return {
      reqParams: state.addInterface.reqParams,
      resParams: state.addInterface.resParams,
      method: state.addInterface.method,
      url: state.addInterface.url,
      interfaceName: state.addInterface.interfaceName
    }
  },
  {
    saveForms
  }
)

class AddInterface extends Component {
  static propTypes = {
    reqParams: PropTypes.string,
    resParams: PropTypes.string,
    method: PropTypes.string,
    url: PropTypes.string,
    interfaceName: PropTypes.string,
    saveForms: PropTypes.func
  }

  constructor (props) {
    super(props)
  }

  @autobind
  saveForms () {
    const { interfaceName, url, reqParams, resParams } = this.props
    const params = {
      title: interfaceName,
      path: url,
      method: 'POST',
      project_id: 558,
      req_params_type: 'json',
      req_params_other: reqParams,
      res_body_type: 'json',
      res_body: resParams
    }

    axios.post('/interface/add', params)
      .then(data => {
        console.log('data', data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const TabPane = Tabs.TabPane

    return (
      <section className="add-interface-box">
        <div className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="接口详情" key="1">
              <Button type="primary" className="save" onClick={this.saveForms}>保存</Button>
              <ReqMethod />
              <ReqHeader />
              <ReqParams />
              <ResParams />
              <Result />
            </TabPane>
            <TabPane tab="Mock" key="2">mock</TabPane>
            <TabPane tab="测试" key="3">测试</TabPane>
          </Tabs>
        </div>
      </section>
    )
  }
}

export default AddInterface

    
