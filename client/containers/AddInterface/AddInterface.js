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
      reqParams: state.addInterface.reqParams
    }
  },
  {
    saveForms
  }
)

class AddInterface extends Component {
  static propTypes = {
    reqParams: PropTypes.string,
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
      })
      .catch(e => {
        console.log(e)
      })

    console.log(this.props.reqParams)
  }

  render () {
    const TabPane = Tabs.TabPane

    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tab 1" key="1">
          <section className="add-interface-box">
            <div className="content">
              <Button type="primary" className="save" onClick={this.saveForms}>保存</Button>
              <ReqMethod />
              <ReqHeader />
              <ReqParams />
              <ResParams />
              <Result />
            </div>
          </section>
        </TabPane>
        <TabPane tab="Tab 2" key="2">mock</TabPane>
        <TabPane tab="Tab 3" key="3">测试</TabPane>
      </Tabs>
    )
  }
}

export default AddInterface

    
