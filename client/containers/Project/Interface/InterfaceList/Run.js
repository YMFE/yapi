import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, Select, Card, Alert, Spin, Icon, message, Collapse, Radio } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';
import { withRouter } from 'react-router';
// import axios from 'axios';
import URL from 'url';

// import {
// } from '../../../reducer/modules/group.js'

import './Run.scss'

const { TextArea } = Input;
const InputGroup = Input.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(
  state => ({
    currInterface: state.inter.curdata,
    currProject: state.project.currProject
    // reqBody: state.addInterface.reqBody,
    // method: state.addInterface.method,
    // url: state.addInterface.url,
    // seqGroup: state.addInterface.seqGroup,
    // interfaceName: state.addInterface.interfaceName,
  })
)
@withRouter
export default class Run extends Component {

  static propTypes = {
    match: PropTypes.object,
    currProject: PropTypes.object,
    currInterface: PropTypes.object,
    reqBody: PropTypes.string,
    // method: PropTypes.string,
    // url: PropTypes.string,
    interfaceName: PropTypes.string
    // seqGroup: PropTypes.array,
  }

  state = {
    res: '',
    method: 'GET',
    domains: [],
    pathname: '',
    query: [],
    bodyForm: [],
    headers: [],
    currDomain: '',
    bodyType: '',
    bodyOther: ''
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.getInterfaceState()
  }

  componentWillReceiveProps(nextProps) {
    this.getInterfaceState(nextProps)
  }

  @autobind
  getInterfaceState(nextProps) {
    const props = nextProps || this.props;
    const { currInterface, currProject } = props;
    console.log('currInterface', currInterface)
    console.log('currProject', currProject)
    const {
      method,
      path: url,
      req_headers = [],
      req_body_type,
      req_query = [],
      req_params = [],
      req_body_other = '',
      req_body_form = []
    } = currInterface;
    const { prd_host, basepath, protocol, env } = currProject;
    const pathname = (basepath + url).replace(/\/+/g, '/');

    const domains = {prd: protocol + '://' + prd_host};
    env.forEach(item => {
      domains[item.name] = item.domain;
    })

    const pathParam = [];
    req_params.forEach(item => {
      pathParam.push({key: item.name, value: item.value})
    })

    const query = [];
    req_query.forEach(item => {
      query.push({key: item.name, value: item.value})
    })

    const bodyForm = [];
    req_body_form.forEach(item => {
      bodyForm.push({key: item.name, value: item.value, type: 'text'})
    })

    const bodyOther = req_body_other;

    const headers = []
    let contentTypeIndex = -1;
    req_headers.forEach((headerItem, index) => {
      if (headerItem.name) {
        // TODO 'Content-Type' 排除大小写不同格式影响
        if (headerItem.name === 'Content-Type'){
          contentTypeIndex = index;
          headerItem.value = headerItem.value || 'application/x-www-form-urlencoded';
        }
        headers.push({name: headerItem.name, value: headerItem.value});
      }
    })
    if (contentTypeIndex === -1) {
      headers.push({name: 'Content-Type', value: 'application/x-www-form-urlencoded'});
    }

    this.setState({
      method,
      domains,
      pathname,
      query,
      bodyForm,
      headers,
      bodyOther,
      currDomain: domains.prd,
      bodyType: req_body_type || 'form',
      loading: false
    });
  }

  @autobind
  reqRealInterface() {
    const { headers, bodyForm, bodyOther, currDomain, method, pathname, query, bodyType } = this.state;
    const urlObj = URL.parse(currDomain);

    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname,
      query: this.getQueryObj(query)
    });

    this.setState({ loading: true })

    crossRequest({
      url: href,
      method,
      headers: this.getHeadersObj(headers),
      data: bodyType === 'form' ? this.arrToObj(bodyForm) : bodyOther,
      files: bodyType === 'form' ? this.getFiles(bodyForm) : {},
      success: (res) => {
        try {
          res = JSON.parse(res)
        } catch (e) {
          null
        }
        this.setState({res})
        this.setState({ loading: false })
      },
      error: (err) => {
        this.setState({res: err || '请求失败'})
        this.setState({ loading: false })
      }
    })
  }

  @autobind
  changeDomain(value) {
    this.setState({ currDomain: value });
  }

  @autobind
  selectDomain(value) {
    this.setState({ currDomain: value });
  }

  @autobind
  changeHeader(e, index, isName) {
    const headers = JSON.parse(JSON.stringify(this.state.headers));
    const v = e.target.value;
    if (isName) {
      headers[index].name = v;
    } else {
      headers[index].value = v;
    }
    this.setState({ headers });
  }
  @autobind
  addHeader() {
    const { headers } = this.state;
    this.setState({headers: headers.concat([{name: '', value: ''}])})
  }
  @autobind
  deleteHeader(index) {
    const { headers } = this.state;
    this.setState({headers: headers.filter((item, i) => +index !== +i)});
  }
  @autobind
  setContentType(type) {
    const headersObj = this.getHeadersObj(this.state.headers);
    headersObj['Content-Type'] = type;
    this.setState({headers: this.objToArr(headersObj, 'name')})
  }

  @autobind
  changeQuery(e, index, isKey) {
    const query = JSON.parse(JSON.stringify(this.state.query));
    const v = e.target.value;
    if (isKey) {
      query[index].key = v;
    } else {
      query[index].value = v;
    }
    this.setState({ query });
  }
  @autobind
  addQuery() {
    const { query } = this.state;
    this.setState({query: query.concat([{key: '', value: ''}])})
  }
  @autobind
  deleteQuery(index) {
    const { query } = this.state;
    this.setState({query: query.filter((item, i) => +index !== +i)});
  }

  @autobind
  changeBody(e, index, type) {
    const bodyForm = JSON.parse(JSON.stringify(this.state.bodyForm));
    switch (type) {
      case 'key':
        bodyForm[index].key = e.target.value
        break;
      case 'type':
        bodyForm[index].type = e
        break;
      case 'value':
        if (bodyForm[index].type === 'file') {
          bodyForm[index].value = e.target.id
        } else {
          bodyForm[index].value = e.target.value
        }
        break;
      default:
        break;
    }
    if (type === 'type' && e === 'file') {
      this.setContentType('multipart/form-data')
    }
    this.setState({ bodyForm });
  }
  @autobind
  addBody() {
    const { bodyForm } = this.state;
    this.setState({bodyForm: bodyForm.concat([{key: '', value: '', type: 'text'}])})
  }
  @autobind
  deleteBody(index) {
    const { bodyForm } = this.state;
    this.setState({bodyForm: bodyForm.filter((item, i) => +index !== +i)});
  }

  @autobind
  changeMethod(value) {
    this.setState({ method: value });
  }

  @autobind
  changePath(e) {
    const path = e.target.value;
    const urlObj = URL.parse(path, true);
    this.setState({
      query: this.objToArr(urlObj.query),
      pathname: urlObj.pathname
    })
  }

  @autobind
  changeBodyType(value) {
    this.setState({bodyType: value})
  }

  hasCrossRequestPlugin() {
    const dom = document.getElementById('y-request');
    return dom.getAttribute('key') === 'yapi';
  }

  objToArr(obj, key, value) {
    const keyName = key || 'key';
    const valueName = value || 'value';
    const arr = []
    Object.keys(obj).forEach((_key) => {
      if (_key) {
        arr.push({[keyName]: _key, [valueName]: obj[_key]});
      }
    })
    return arr;
  }
  arrToObj(arr) {
    const obj = {};
    arr.forEach(item => {
      if (item.key && item.type !== 'file') {
        obj[item.key] = item.value || '';
      }
    })
    return obj;
  }
  getFiles(bodyForm) {
    const files = {};
    bodyForm.forEach(item => {
      if (item.key && item.type === 'file') {
        files[item.key] = item.value
      }
    })
    return files;
  }
  getQueryObj(query) {
    const queryObj = {};
    query.forEach(item => {
      if (item.key) {
        queryObj[item.key] = item.value || '';
      }
    })
    return queryObj;
  }
  getHeadersObj(headers) {
    const headersObj = {};
    headers.forEach(item => {
      if (item.name && item.value) {
        headersObj[item.name] = item.value;
      }
    })
    return headersObj;
  }

  @autobind
  fileChange(e, index) {
    console.log(e)
    console.log(index)
  }

  render () {

    const { method, domains, pathname, query, headers, bodyForm, bodyOther, currDomain, bodyType } = this.state;
    const hasPlugin = this.hasCrossRequestPlugin();
    const search = decodeURIComponent(URL.format({query: this.getQueryObj(query)}));

    return (
      <div className="interface-test">
        <div  className="has-plugin">
          {
            hasPlugin ? '' : (
              <Alert
                message={
                  <div>
                    温馨提示：当前正在使用接口测试服务，请安装我们为您免费提供的&nbsp;
                    <a
                      target="blank"
                      href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
                    >测试增强插件 [点击获取]！</a>
                  </div>
                }
                type="warning"
              />
            )
          }
        </div>

        <Card title="请求部分" noHovering className="req-part">
          <div className="url">
            <InputGroup compact style={{display: 'flex'}}>
              <Select value={method} style={{flexBasis: 60}} onChange={this.changeMethod} >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
              </Select>
              <Select value={currDomain} mode="combobox" filterOption={() => true} style={{flexBasis: 180, flexGrow: 1}} onChange={this.changeDomain} onSelect={this.selectDomain}>
                {
                  Object.keys(domains).map((key, index) => (<Option value={domains[key]} key={index}>{key + '：' + domains[key]}</Option>))
                }
              </Select>
              <Input value={pathname + search} onChange={this.changePath} spellCheck="false" style={{flexBasis: 180, flexGrow: 1}} />
            </InputGroup>
            <Button
              onClick={this.reqRealInterface}
              type="primary"
              style={{marginLeft: 10}}
              loading={this.state.loading}
            >发送</Button>
            <Button
              onClick={this.reqRealInterface}
              type="primary"
              style={{marginLeft: 10}}
            >保存</Button>
          </div>

          <Collapse defaultActiveKey={['1', '2', '3']} bordered={true}>
            <Panel header="QUERY PARAMETERS" key="1">
              {
                query.map((item, index) => {
                  return (
                    <div key={index} className="key-value-wrap">
                      <Input value={item.key} onChange={e => this.changeQuery(e, index, true)} className="key" />
                      <span className="eq-symbol">=</span>
                      <Input value={item.value} onChange={e => this.changeQuery(e, index)} className="value" />
                      <Icon type="delete" className="icon-btn" onClick={() => this.deleteQuery(index)} />
                    </div>
                  )
                })
              }
              <Button type="primary" icon="plus" onClick={this.addQuery}>Add query parameter</Button>
            </Panel>
            <Panel header="HEADERS" key="2" >
              {
                headers.map((item, index) => {
                  return (
                    <div key={index} className="key-value-wrap">
                      <Input value={item.name} onChange={e => this.changeHeader(e, index, true)} className="key" />
                      <span className="eq-symbol">=</span>
                      <Input value={item.value} onChange={e => this.changeHeader(e, index)} className="value" />
                      <Icon type="delete" className="icon-btn" onClick={() => this.deleteHeader(index)} />
                    </div>
                  )
                })
              }
              <Button type="primary" icon="plus" onClick={this.addHeader}>Add header</Button>
            </Panel>
            <Panel
              header={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>BODY</div>
                  <div onClick={e => e.stopPropagation()} style={{marginRight: 5}}>
                    <Select defaultValue={bodyType} onChange={this.changeBodyType} className={method === 'POST' ? '' : 'hidden'}>
                      <Option value="text">Text</Option>
                      <Option value="file">File</Option>
                      <Option value="form">Form</Option>
                    </Select>
                  </div>
                </div>
              }
              key="3"
            >
              { method === 'POST' && bodyType !== 'form' && bodyType !== 'file' &&
                <div>
                  <RadioGroup defaultValue="json">
                    <RadioButton value="json">JSON</RadioButton>
                    <RadioButton value="text">TEXT</RadioButton>
                    <RadioButton value="xml">XML</RadioButton>
                    <RadioButton value="html">HTML</RadioButton>
                  </RadioGroup>
                  <TextArea
                    value={bodyOther}
                    style={{marginTop: 10}}
                    autosize={{ minRows: 2, maxRows: 10 }}
                  ></TextArea>
                </div>
              }
              {
                method === 'POST' && bodyType === 'form' &&
                <div>
                  {
                    bodyForm.map((item, index) => {
                      return (
                        <div key={index} className="key-value-wrap">
                          <Input value={item.key} onChange={e => this.changeBody(e, index, 'key')} className="key" />
                          <span>[</span>
                          <Select value={item.type} onChange={e => this.changeBody(e, index, 'type')}>
                            <Option value="file">File</Option>
                            <Option value="text">Text</Option>
                          </Select>
                          <span>]</span>
                          <span className="eq-symbol">=</span>
                          {
                            item.type === 'file' ? <Input type="file" id={'file_' + index} onChange={e => this.changeBody(e, index, 'value')} multiple className="value" /> :
                            <Input value={item.value} onChange={e => this.changeBody(e, index, 'value')} className="value" />
                          }
                          <Icon type="delete" className="icon-btn" onClick={() => this.deleteBody(index)} />
                        </div>
                      )
                    })
                  }
                  <Button type="primary" icon="plus" onClick={this.addBody}>Add form parameter</Button>
                </div>
              }
              {
                method === 'POST' && bodyType === 'file' &&
                <div>
                  <Input type="file"></Input>
                </div>
              }
              {
                method !== 'POST' &&
                <div>GET 请求没有 BODY。</div>
              }
            </Panel>
          </Collapse>
        </Card>

        <Card title="返回结果" noHovering className="resp-part">
          <Spin spinning={this.state.loading}>
            <div className="res-part">
              <div style={{padding: 10}}>
                <TextArea
                  value={typeof this.state.res === 'object' ? JSON.stringify(this.state.res, null, 2) : this.state.res.toString()}
                  autosize={{ minRows: 2, maxRows: 6 }}
                ></TextArea>
              </div>
            </div>
          </Spin>
        </Card>
      </div>
    )
  }
}
