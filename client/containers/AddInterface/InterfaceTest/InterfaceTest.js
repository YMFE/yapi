import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, Select, Card, Alert } from 'antd'
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
    search: '',
    currDomain: ''
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.interfacePropsToState()
  }

  componentWillReceiveProps(nextProps) {
    this.interfacePropsToState(nextProps)
  }

  @autobind
  interfacePropsToState(nextProps) {
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
      domains,
      pathname,
      query,
      params,
      paramsNotJson,
      headers,
      currDomain: domains.prd
    });
  }

  @autobind
  testInterface() {
    const { method } = this.props;
    const { pathname, query, headers, params, currDomain } = this.state;
    const urlObj = URL.parse(currDomain);

    const href = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname,
      query
    });

    crossRequest({
      url: href,
      method,
      headers,
      data: params,
      success: (res, header) => {
        console.log(header)
        this.setState({res})
      }
    })
  }

  @autobind
  changeDomain(value) {
    const domain = this.state.domains[value];
    this.setState({ currDomain: domain });
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

  hasCrossRequestPlugin() {
    const dom = document.getElementById('y-request');
    return dom.getAttribute('key') === 'yapi';
  }

  render () {

    const { interfaceName, method } = this.props;
    const { domains, pathname, query, headers, params, paramsNotJson } = this.state;
    const search = URL.format({
      query
    });
    const hasPlugin = this.hasCrossRequestPlugin();


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
        <div className="req-part">
          <div className="req-row href">
            <InputGroup compact style={{display: 'inline-block', width: 680, border: 0, background: '#fff', marginBottom: -4}}>
              <Input value="Method" disabled style={{display: 'inline-block', width: 80, border: 0, background: '#fff'}} />
              <Input value="Domain" disabled style={{display: 'inline-block', width: 300, border: 0, background: '#fff'}} />
              <Input value="Basepath + Url + [Query]" disabled style={{display: 'inline-block', width: 300, border: 0, background: '#fff'}} />
            </InputGroup>
            <InputGroup compact style={{display: 'inline-block', width: 680}}>
              <Input value={method} disabled style={{display: 'inline-block', width: 80}} />
              <Select defaultValue="prd" style={{display: 'inline-block', width: 300}} onChange={this.changeDomain}>
                {
                  Object.keys(domains).map((key, index) => (<Option value={key} key={index}>{domains[key]}</Option>))
                }
              </Select>
              <Input value={pathname+search} disabled style={{display: 'inline-block', width: 300}} />
            </InputGroup>
            <Button onClick={this.testInterface} type="primary" style={{marginLeft: 10}}>发送</Button>
          </div>
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
          <div className="res-part">
            <div>
              <TextArea
                value={this.state.res ? JSON.stringify(this.state.res, 2) : ''}
                style={{margin: 10}}
                autosize={{ minRows: 2, maxRows: 6 }}
              ></TextArea>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
