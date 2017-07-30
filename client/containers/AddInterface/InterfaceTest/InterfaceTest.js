import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, Select, Card, Alert, Spin, Icon, message } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';
import { withRouter } from 'react-router';
import axios from 'axios';
import URL from 'url';

import {
} from '../../../actions/group.js'

import './InterfaceTest.scss'

const { TextArea } = Input;
const InputGroup = Input.Group;
const Option = Select.Option;

@connect(
  state => ({
    reqParams: state.addInterface.reqParams,
    method: state.addInterface.method,
    url: state.addInterface.url,
    seqGroup: state.addInterface.seqGroup,
    interfaceName: state.addInterface.interfaceName,
    interfaceProject: state.addInterface.project
  })
)
@withRouter
export default class InterfaceTest extends Component {

  static propTypes = {
    reqParams: PropTypes.string,
    method: PropTypes.string,
    url: PropTypes.string,
    interfaceName: PropTypes.string,
    seqGroup: PropTypes.array,
    match: PropTypes.object,
    interfaceProject: PropTypes.object
  }

  state = {
    res: '',
    method: 'GET',
    domains: [],
    pathname: '',
    query: {},
    params: {},
    paramsNotJson: false,
    headers: {},
    currDomain: '',
    paramsType: 'from'
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
    const { method, url, seqGroup, interfaceProject } = props;
    const { prd_host, basepath, protocol, env } = interfaceProject;
    const pathname = (basepath + url).replace(/\/+/g, '/');

    const domains = {prd: protocol + '://' + prd_host};
    env.forEach(item => {
      domains[item.name] = item.domain;
    })

    const query = [];
    let params = [];
    let reqParams = this.props.reqParams ? this.props.reqParams : '{}';
    let paramsNotJson = false;
    try {
      reqParams = JSON.parse(reqParams);
      // paramsNotJson = false;
    } catch (e) {
      // paramsNotJson = true;
      reqParams = {};
      message.error('请求参数不是 JSON 格式');
    }
    if (method === 'GET') {
      Object.keys(reqParams).forEach(key => {
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams[key]) : reqParams[key].toString();
        query.push({key, value})
      })
    } else if (method === 'POST') {
      // params = reqParams;
      Object.keys(reqParams).forEach(key => {
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams[key]) : reqParams[key].toString();
        query.push({key, value, type: 'text'})
      })
    }

    const headers = []
    seqGroup.forEach((headerItem) => {
      if (headerItem.name) {
        headers.push({name: headerItem.name, value: headerItem.value});
      }
    })

    this.setState({
      method,
      domains,
      pathname,
      query,
      params,
      paramsNotJson,
      headers,
      currDomain: domains.prd,
      loading: false,
      paramsType: 'form'
    });
  }

  @autobind
  requestInterface() {
    const { headers, params, currDomain, method, pathname, query } = this.state;
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
      headers,
      data: params,
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
  changeParams(e, index, type) {
    const params = JSON.parse(JSON.stringify(this.state.params));
    switch (type) {
      case 'key':
        params[index].key = e.target.value
        break;
      case 'type':
        params[index].type = e
        break;
      case 'value':
        params[index].value = e.target.value
        break;
      default:
        break;
    }
    this.setState({ params });
  }
  @autobind
  addParams() {
    const { params } = this.state;
    this.setState({params: params.concat([{key: '', value: '', type: 'text'}])})
  }
  @autobind
  deleteParams(index) {
    const { params } = this.state;
    this.setState({params: params.filter((item, i) => +index !== +i)});
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
      query: urlObj.query,
      pathname: urlObj.pathname
    })
  }

  @autobind
  changeParamsType(value) {
    this.setState({paramsType: value})
  }

  hasCrossRequestPlugin() {
    const dom = document.getElementById('y-request');
    return dom.getAttribute('key') === 'yapi';
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

  render () {

    const { interfaceName } = this.props;
    const { method, domains, pathname, query, headers, params, currDomain, paramsType } = this.state;
    const hasPlugin = this.hasCrossRequestPlugin();
    const search = decodeURIComponent(URL.format({query: this.getQueryObj(query)}));

    console.log(axios)
    window.axios = axios


    return (
      <div className="interface-test">
        <div style={{padding: '0 20%'}}>
          { hasPlugin ? '' :
          <Alert
            message={
              <div>
                温馨提示：当前正在使用接口测试服务，请安装我们为您免费提供的&nbsp;
                <a
                  target="blank"
                  href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
                >
                  测试增强插件 [点击获取]！
                </a>
              </div>
            }
            type="warning"
          />
          }
        </div>
        <div className="interface-name">{interfaceName}</div>

        {/* url */}
        <div className="req-part">
          <div className="req-row href">
            <InputGroup compact style={{display: 'inline-block', width: 680, border: 0, background: '#fff', marginBottom: -4}}>
              <Input value="Method" disabled style={{display: 'inline-block', width: 80, border: 0, background: '#fff'}} />
              <Input value="Domain" disabled style={{display: 'inline-block', width: 300, border: 0, background: '#fff'}} />
              <Input value="Basepath + Url + [Query]" disabled style={{display: 'inline-block', width: 300, border: 0, background: '#fff'}} />
            </InputGroup>
            <InputGroup compact style={{display: 'inline-block', width: 680}}>
              <Select value={method} style={{display: 'inline-block', width: 80}} onChange={this.changeMethod} >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
              </Select>
              <Select value={currDomain} mode="combobox" filterOption={() => true} style={{display: 'inline-block', width: 300}} onChange={this.changeDomain} onSelect={this.selectDomain}>
                {
                  Object.keys(domains).map((key, index) => (<Option value={domains[key]} key={index}>{key + '：' + domains[key]}</Option>))
                }
              </Select>
              <Input value={pathname + search} onChange={this.changePath} spellCheck="false" style={{display: 'inline-block', width: 300}} />
            </InputGroup>
            <Button
              onClick={this.requestInterface}
              type="primary"
              style={{marginLeft: 10}}
              loading={this.state.loading}
            >发送</Button>
            <span style={{fontSize: 12, color: 'rgba(0, 0, 0, 0.25)'}}>（请求测试真实接口）</span>
          </div>

          <Card title="Query" noHovering style={{marginTop: 10}}>
            {
              query.map((item, index) => {
                return (
                  <div key={index}>
                    <Input value={item.key} onChange={e => this.changeQuery(e, index, true)} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                    <Input value={item.value} onChange={e => this.changeQuery(e, index)} style={{display: 'inline-block', width: 200, margin: 10}} />
                    <Icon type="close" className="icon-btn" onClick={() => this.deleteQuery(index)} />
                  </div>
                )
              })
            }
            <Button type="primary" icon="plus" onClick={this.addQuery}>Add query parameter</Button>
          </Card>
          <Card title="HEADERS" noHovering style={{marginTop: 10}} >
            <div className="req-row headers">
              {
                headers.map((item, index) => {
                  return (
                    <div key={index}>
                      <Input value={item.name} onChange={e => this.changeHeader(e, index, true)} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                      <Input value={item.value} onChange={e => this.changeHeader(e, index)} style={{display: 'inline-block', width: 200, margin: 10}} />
                      <Icon type="close" className="icon-btn" onClick={() => this.deleteHeader(index)} />
                    </div>
                  )
                })
              }
              <Button type="primary" icon="plus" onClick={this.addHeader}>Add header</Button>
            </div>
          </Card>
          <Card title="Body" noHovering style={{marginTop: 10}}>
            <div className="req-row params">
              <Select defaultValue={paramsType} onChange={this.changeParamsType} className={method === 'POST' ? '' : 'hidden'}>
                <Option value="text">Text</Option>
                <Option value="file">File</Option>
                <Option value="form">Form</Option>
              </Select>
              { method === 'POST' && paramsType !== 'form' && paramsType !== 'file' &&
                <div>
                  <TextArea
                    value={params}
                    style={{margin: 10}}
                    autosize={{ minRows: 2, maxRows: 6 }}
                  ></TextArea>
                  <div>{paramsType}</div>
                </div>
              }
              {
                method === 'POST' && paramsType === 'form' && (
                  <div>
                    {
                      params.map((item, index) => {
                        return (
                          <div key={index}>
                            <Input value={item.key} onChange={e => this.changeParams(e, index, 'key')} style={{display: 'inline-block', width: 200, margin: 10}} />
                            [<Select value={item.type} onChange={e => this.changeParams(e, index, 'type')}>
                              <Option value="file">File</Option>
                              <Option value="text">Text</Option>
                            </Select>]{' = '}
                            {item.type === 'file' ?
                              <Input type="file" style={{display: 'inline-block', width: 200, margin: 10}} /> :
                              <Input value={item.value} onChange={e => this.changeParams(e, index, 'value')} style={{display: 'inline-block', width: 200, margin: 10}} />
                            }
                          </div>
                        )
                      })
                    }
                    <Button type="primary" icon="plus" onClick={this.addParams}>Add form parameter</Button>
                  </div>
                )
              }
              {
                method === 'POST' && paramsType === 'file' && (
                  <div>
                    <Input type="file"></Input>
                  </div>
                )
              }
              {
                method !== 'POST' && (
                  <div>GET 请求没有 Body。</div>
                )
              }
            </div>
          </Card>
        </div>
        <Card title="返回结果" noHovering style={{marginTop: 10}}>
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
