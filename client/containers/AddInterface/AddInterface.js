import './AddInterface.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Mock from 'mockjs'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { Button, Tabs, message, Affix, Spin } from 'antd'
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
} from '../../reducer/modules/addInterface.js'

let projectId = ''
const success = (text, arg) => {
  arg ? message.success(text) : message.error(text)
}

@connect(
  state => {
    return {
      reqParams: state.addInterface.reqParams,
      resParams: state.addInterface.resParams,
      method: state.addInterface.method,
      url: state.addInterface.url,
      seqGroup: state.addInterface.seqGroup,
      interfaceName: state.addInterface.interfaceName,
      server_ip: state.user.server_ip,
      clipboard: state.addInterface.clipboard
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
    server_ip: PropTypes.string,
    reqParams: PropTypes.string,
    resParams: PropTypes.string,
    seqGroup: PropTypes.array,
    interfaceName: PropTypes.string,
    saveForms: PropTypes.func,
    addReqHeader: PropTypes.func,
    getReqParams: PropTypes.func,
    getResParams: PropTypes.func,
    pushInputValue: PropTypes.func,
    pushInterfaceName: PropTypes.func,
    clipboard: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: '',
      isSave: false,
      mockJson: '',
      mockURL: '',
      projectData: {},
      tagName: '添加接口',
      showMock: ''
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
      this.modifyTagName('编辑接口')
      this.setState({showMock: 'show-mock'})
    } else {
      const props = this.props
      props.pushInputValue('')
      props.pushInterfaceName('')
      props.getReqParams(JSON.stringify({
        "id": 1,
        "name": "xxx"
      }))
      props.getResParams(JSON.stringify({
        errcode: "@natural",
        "data|3-8": {
          uid: "@id",
          name: "@name",
          email: "@email"
        }
      }))
      props.addReqHeader(initData)
    }
  }

  getInterfaceId () {
    const reg = /add-interface\/edit\/(\d+)/g
    const regTwo = /add-interface\/(\d+)/g
    const url = location.href

    if ( url.match(reg) ) {
      return RegExp.$1
    } else {
      url.match(regTwo)
      return RegExp.$1
    }
  }

  modifyTagName (tagName) {
    this.setState({
      tagName
    })
  }

  verificationURL () {
    const dir = 'add-interface/edit'
    const url = location.href
    if (url.includes(dir)) {
      return true
    }
  }

  getMockURL (project_id, result) {
    const params = {id: project_id}
    axios.get('/project/get', {params: params}).
      then( data => {
        const { prd_host, basepath } = data.data.data
        const mockURL = `http://${prd_host}${basepath}${result.path}`
        this.setState({
          mockURL: mockURL,
          projectData: data.data.data
        })
      })
  }

  editState (data) {
    const props = this.props
    const { path, title, req_params_other, res_body, req_headers, project_id, method } = data
    this.setState({
      apiData: data
    })
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

  initInterfaceDataTwo (interfaceId) {
    const params = { id: interfaceId }

    axios.get('/interface/get', {params: params})
      .then(result => {
        result = result.data.data
        this.getMockURL(result.project_id, result)
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
  jumpEditUrl (_id) {
    const origin = location.origin
    const pathname = location.pathname
    location.href = `${origin}${pathname}#/add-interface/edit/${_id}`
    this.initInterfaceDataTwo(_id)
    setTimeout(() => {
      this.props.clipboard()
    }, 1000)
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
      .then(data => {
        if(data.data.errcode !== 0){
          this.setLoading()
          success(data.data.errmsg, false)
          return null;
        }
        const id = data.data.data._id
        const _id = id || interfaceId
        this.setLoading()
        success('保存成功!', true)
        this.changeState(true)
        // 初始化 mock
        this.mockData()

        if (id) {
          this.setState({showMock: 'show-mock'})
        }

        this.jumpEditUrl(_id)
      })
      .catch(error => {
        this.setLoading()
        success('程序出错，请联系管理员检查!', false)
        console.log(error)
      })
  }

  render () {
    const TabPane = Tabs.TabPane
    const { server_ip } = this.props
    const { isLoading, isSave, mockJson='', mockURL, tagName, showMock } = this.state
    let Pane = ''
    let mockGroup = ''
    if (showMock) {
      Pane = <TabPane tab="请求接口" key="3"><InterfaceTest /></TabPane>
      mockGroup = <MockUrl mockURL={mockURL} serverIp={server_ip} projectData={this.state.projectData} showMock={showMock}/>
    }
    return (
      <section className="add-interface-box">
        <div className="content">
          <Tabs type="card">
            <TabPane tab={tagName} key="1">
              <h3 className="req-title">请求部分</h3>
              <ReqMethod />
              <ReqHeader />
              <ReqParams data={this.props} />
              {mockGroup}
              <h3 className="req-title">返回部分</h3>
              <ResParams />
              <Result isSave={isSave} mockJson={mockJson} />
            </TabPane>
            {Pane}
          </Tabs>
        </div>
        <Affix offsetBottom={0} className="save-button">
          <Button type="primary" onClick={this.saveForms}>保存</Button>
        </Affix>
        <div className={`loading ${isLoading}`}>
          <div className="loading-css">
            <Spin />
          </div>
        </div>
      </section>
    )
  }
}

export default AddInterface
