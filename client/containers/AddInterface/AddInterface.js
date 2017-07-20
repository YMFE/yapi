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
      methode: state.addInterface.method
    }
  },
  {
    saveForms
  }
)

class AddInterface extends Component {
  static propTypes = {
    reqParams: PropTypes.string,
    methode: PropTypes.string,
    saveForms: PropTypes.func
  }

  constructor (props) {
    super(props)
  }

  @autobind
  saveForms () {
    // const config = {
    //   url: '/interface/add',
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   params: {
    //     method: 'POST',
    //     project_id: 8,
    //     req_headers: [],
    //     req_params_type: 'json',
    //     req_params: this.props.reqParams
    //   }
    // }
    const params = {
      url: '/interface/add',
      method: 'POST',
      params: {
        method: 'POST',
        project_id: 558,
        req_headers: [],
        req_params_type: 'json',
        req_params: this.props.reqParams,
        title: '接口文档1'
      }
    }

    axios.post('/interface/add', params)
      .then(data => {
        console.log(data)
        console.log(this.props.methode)
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

    
