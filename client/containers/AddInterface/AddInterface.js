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
import { 
  saveForms,
  getResParams,
  getReqParams,
  addReqHeader,
  pushInputValue,
  pushInterfaceName
} from '../../actions/addInterface.js'

@connect(
  state => {
    return {
      reqParams: state.addInterface.reqParams,
      resParams: state.addInterface.resParams,
      method: state.addInterface.method,
      url: state.addInterface.url,
      seqGroup: state.addInterface.seqGroup,
      interfaceName: state.addInterface.interfaceName
    }
  },
  {
    saveForms,
    getReqParams,
    getResParams,
    addReqHeader,
    pushInputValue,
    pushInterfaceName
  }
)

class AddInterface extends Component {
  static propTypes = {
    url: PropTypes.string,
    method: PropTypes.string,
    reqParams: PropTypes.string,
    resParams: PropTypes.string,
    seqGroup: PropTypes.array,
    interfaceName: PropTypes.string,
    saveForms: PropTypes.func,
    addReqHeader: PropTypes.func,
    getReqParams: PropTypes.func,
    getResParams: PropTypes.func,
    pushInputValue: PropTypes.func,
    pushInterfaceName: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: ''
    }
  }

  componentDidMount () {
    const ifTrue = this.verificationURL()
    let interfaceId = undefined
    if (ifTrue) {
      interfaceId = this.getInterfaceId()
      this.initInterfaceData(interfaceId)
    } else {
      const props = this.props
      props.pushInputValue('')
      props.pushInterfaceName('')
      props.getReqParams('')
      props.getResParams('')
      props.addReqHeader([
        {
          id: 0,
          name: '',
          value: ''
        }
      ])
    }
  }

  getInterfaceId () {
    const value = location.hash.match(/\d+/g)
    return value ? value[0] : ''
  }

  verificationURL () {
    const dir = 'AddInterface/edit'
    const url = location.href
    if (url.includes(dir)) {
      return true
    }
  }

  editState (data) {
    const props = this.props
    const { path, title, req_params_other, res_body, req_headers} = data
    props.pushInputValue(path)
    props.pushInterfaceName(title)
    props.getReqParams(req_params_other)
    props.getResParams(res_body)
    props.addReqHeader(req_headers)
  }

  initInterfaceData (interfaceId) {
    const params = { id: interfaceId }

    axios.get('/interface/get', {params: params})
      .then(result => {
        result = result.data.data
        result.req_headers.map((value, key) => {
          value.id = key
          return value
        })
        this.editState(result)
      })
      .catch(e => {
        console.log(e)
      })
  }

  setLoading (boolean) {
    this.setState({
      isLoading: boolean ? 'is-loading' : ''
    })
  }

  routerPage () {
    const origin = location.origin
    const pathname = location.pathname
    location.href = `${origin}${pathname}#/interface`
  }

  @autobind
  saveForms () {
    let postURL = undefined
    const { interfaceName, url, seqGroup, reqParams, resParams } = this.props
    const ifTrue = this.verificationURL()
    const interfaceId = this.getInterfaceId()
    const params = {
      title: interfaceName,
      path: url,
      method: 'POST',
      req_headers: seqGroup,
      project_id: 558,
      req_params_type: 'json',
      req_params_other: reqParams,
      res_body_type: 'json',
      res_body: resParams
    }

    if (ifTrue) {
      params.id = interfaceId
      postURL = '/interface/up'
    } else {
      postURL = '/interface/add'
    }

    this.setLoading(true)

    axios.post(postURL, params)
      .then(() => {
        this.setLoading()
        this.routerPage()
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const TabPane = Tabs.TabPane
    const isLoading = this.state.isLoading

    return (
      <section className="add-interface-box">
        <div className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="接口详情" key="1">
              <Button type="primary" className="save" onClick={this.saveForms}>保存</Button>
              <ReqMethod />
              <ReqHeader />
              <ReqParams data={this.props} />
              <ResParams />
              <Result />
            </TabPane>
            <TabPane tab="Mock" key="2">mock</TabPane>
            <TabPane tab="测试" key="3">测试</TabPane>
          </Tabs>
        </div>
        <div className={`loading ${isLoading}`}></div>
      </section>
    )
  }
}

export default AddInterface

    
