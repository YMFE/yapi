import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, Select, Card, Alert, Spin } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';
import { withRouter } from 'react-router';
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
  }),
  {
  }
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
    currDomain: ''
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

    const query = {};
    let params = {};
    let reqParams = this.props.reqParams ? this.props.reqParams : '{}';
    let paramsNotJson = false;
    try {
      reqParams = JSON.parse(reqParams)
      paramsNotJson = false;
    } catch (e) {
      paramsNotJson = true;
    }
    if (method === 'GET') {
      Object.keys(reqParams).forEach(key => {
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams[key]) : reqParams[key].toString();
        query[key] = value;
      })
    } else if (method === 'POST') {
      params = reqParams;
    }

    const headers = {}
    seqGroup.forEach((headerItem) => {
      if (headerItem.name) {
        headers[headerItem.name] = headerItem.value;
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
      loading: false
    });
  }

  @autobind
  testInterface() {
    const { headers, params, currDomain, method, pathname, query } = this.state;
    const urlObj = URL.parse(currDomain);

    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname,
      query
    });

    this.setState({ loading: true })

    crossRequest({
      url: href,
      method,
      headers,
      data: params,
      success: (res, header) => {
        console.log(header)
        try {
          res = JSON.parse(res);
        } catch (e) {
          null;
        }
        this.setState({res})
        this.setState({ loading: false })
      },
      error: (err, header) => {
        console.log(header)
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
  changeHeader(e, key) {
    const headers = JSON.parse(JSON.stringify(this.state.headers));
    headers[key] = e.target.value;
    this.setState({ headers });
  }

  @autobind
  changeQuery(e, key) {
    const query = JSON.parse(JSON.stringify(this.state.query));
    query[key] = e.target.value;

    this.setState({ query });
  }

  @autobind
  changeParams(e, key) {
    const params = JSON.parse(JSON.stringify(this.state.params));
    params[key] = e.target.value;
    this.setState({ params });
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

  hasCrossRequestPlugin() {
    const dom = document.getElementById('y-request');
    return dom.getAttribute('key') === 'yapi';
  }

  render () {

    const { interfaceName } = this.props;
    const { method, domains, pathname, query, headers, params, paramsNotJson, currDomain } = this.state;
    const hasPlugin = this.hasCrossRequestPlugin();
    const search = decodeURIComponent(URL.format({query}));


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
              onClick={this.testInterface}
              type="primary"
              style={{marginLeft: 10}}
              loading={this.state.loading}
            >发送</Button>
            <span style={{fontSize: 12, color: 'rgba(0, 0, 0, 0.25)'}}>（请求测试真实接口）</span>
          </div>

          <Card title="Query" noHovering style={{marginTop: 10}} className={Object.keys(query).length ? '' : 'hidden'}>
            <div className="req-row query">
              {
                Object.keys(query).map((key, index) => {
                  const value = typeof query[key] === 'object' ? JSON.stringify(query[key]) : query[key].toString();
                  return (
                    <div key={index}>
                      <Input disabled value={key} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                      <Input value={value} onChange={e => this.changeQuery(e, key)} style={{display: 'inline-block', width: 200, margin: 10}} />
                    </div>
                  )
                })
              }
            </div>
          </Card>
          <Card title="HEADERS" noHovering style={{marginTop: 10}} className={Object.keys(headers).length ? '' : 'hidden'}>
            <div className="req-row headers">
              {
                Object.keys(headers).map((key, index) => {
                  return (
                    <div key={index}>
                      <Input disabled value={key} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                      <Input value={headers[key]} onChange={e => this.changeHeader(e, key)} style={{display: 'inline-block', width: 200, margin: 10}} />
                    </div>
                  )
                })
              }
            </div>
          </Card>
          <Card title="Body" noHovering style={{marginTop: 10}} className={Object.keys(params).length ? '' : 'hidden'}>
            <div className="req-row params">
              { paramsNotJson ?
                <TextArea
                  value={params}
                  style={{margin: 10}}
                  autosize={{ minRows: 2, maxRows: 6 }}
                ></TextArea> :
                Object.keys(params).map((key, index) => {
                  const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key].toString();
                  return (
                    <div key={index}>
                      <Input disabled value={key} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                      <Input value={value} onChange={e => this.changeParams(e, key)} style={{display: 'inline-block', width: 200, margin: 10}} />
                    </div>
                  )
                })
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
