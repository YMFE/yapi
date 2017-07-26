import './AddInterface.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Mock from 'mockjs'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { Button, Tabs, message } from 'antd'
import ReqMethod from './ReqMethod/ReqMethod.js'
import ReqHeader from './ReqHeader/ReqHeader.js'
import ReqParams from './ReqParams/ReqParams.js'
import ResParams from './ResParams/ResParams.js'
import Result from './Result/Result.js'
import MockUrl from './MockUrl/MockUrl.js'
import InterfaceTest from './InterfaceTest/InterfaceTest.js'
import {
  saveForms,
  getResParams,
  getReqParams,
  addReqHeader,
  pushInputValue,
  pushInterfaceName,
  fetchInterfaceProject,
  pushInterfaceMethod
} from '../../actions/addInterface.js'

let projectId = ''
const success = () => {
  message.success('保存成功!')
}

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
    pushInterfaceName,
    fetchInterfaceProject,
    pushInterfaceMethod
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
      isLoading: '',
      isSave: false,
      mockJson: '',
      mockURL: ''
    }
  }

  componentDidMount () {
    const ifTrue = this.verificationURL()
    const initData = [{
      id: 0,
      name: '',
      value: ''
    }]
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
      props.addReqHeader(initData)
    }
  }

  getInterfaceId () {
    const reg = /AddInterface\/edit\/(\d+)/g
    const regTwo = /AddInterface\/(\d+)/g
    const url = location.href
    if ( url.match(reg) ) {
      return RegExp.$1
    } else {
      url.match(regTwo)
      return RegExp.$1
    }
  }

  verificationURL () {
    const dir = 'AddInterface/edit'
    const url = location.href
    if (url.includes(dir)) {
      return true
    }
  }

  getMockURL (project_id, result) {
    const params = {id: project_id}
    axios.get('/project/get', {params: params}).
      then( data => {
        const { protocol, prd_host, basepath } = data.data.data
        const mockURL = `${protocol}://${prd_host}${basepath}${result.path}`
        this.setState({
          mockURL: mockURL
        })
      })
  }

  editState (data) {
    const props = this.props
    const { path, title, req_params_other, res_body, req_headers, project_id, method } = data

    props.pushInputValue(path)
    props.pushInterfaceMethod(method)
    props.pushInterfaceName(title)
    props.getReqParams(req_params_other)
    props.getResParams(res_body)
    props.addReqHeader(req_headers)
    props.fetchInterfaceProject(project_id)
    projectId = project_id
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
        // 初始化 mock
        this.mockData()

        this.getMockURL(projectId, result)
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

  changeState (ifTrue) {
    this.setState({
      isSave: ifTrue
    })
  }

  @autobind
  mockData () { // mock 数据
    let resParams = ''
    let json = ''

    if(this.props.resParams){
      resParams = JSON.parse(this.props.resParams)
      json = JSON.stringify(Mock.mock(resParams), null, 2)
    }
    this.setState({
      mockJson: json
    })
  }

  @autobind
  saveForms () {
    let postURL = undefined
    const { interfaceName, url, seqGroup, reqParams, resParams, method } = this.props
    const ifTrue = this.verificationURL()
    const interfaceId = this.getInterfaceId()
    const params = {
      title: interfaceName,
      path: url,
      method: method,
      req_headers: seqGroup,
      project_id: interfaceId,
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
        success()
        this.changeState(true)
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const TabPane = Tabs.TabPane
    const { isLoading, isSave, mockJson='', mockURL } = this.state

    return (
      <section className="add-interface-box">
        <div className="content">
          <Tabs defaultActiveKey="1">
            <TabPane tab="接口详情" key="1">
              <Button type="primary" className="save" onClick={this.saveForms}>保存</Button>
              <Button className="mock" onClick={this.mockData}>Mock</Button>
              <ReqMethod />
              <ReqHeader />
              <ReqParams data={this.props} />
              <ResParams />
              <Result isSave={isSave} mockJson={mockJson} />
              <MockUrl mockURL={mockURL} />
            </TabPane>
            {
            // <TabPane tab="Mock" key="2">mock</TabPane>
            }
            <TabPane tab="请求接口" key="3">
              <InterfaceTest />
            </TabPane>
          </Tabs>
        </div>
        <div className={`loading ${isLoading}`}></div>
      </section>
    )
  }
}

export default AddInterface
