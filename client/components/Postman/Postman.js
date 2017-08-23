import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { Button, Input, Select, Card, Alert, Spin, Icon, Collapse, Radio, Tooltip } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';
// import { withRouter } from 'react-router';
// import axios from 'axios';
import URL from 'url';
// import AddColModal from './AddColModal'

// import {
// } from '../../../reducer/modules/group.js'

// import './Run.scss'

const { TextArea } = Input;
const InputGroup = Input.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Run extends Component {

  static propTypes = {
    data: PropTypes.object,
    save:PropTypes.func
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
    const { data } = props;
    const {
      method = '',
      path: url = '',
      req_headers = [],
      req_body_type,
      req_query = [],
      req_params = [],
      req_body_other = '',
      req_body_form = [],
      basepath = '',
      env = [],
      domain = ''
    } = data;
    const pathname = (basepath + url).replace(/\/+/g, '/');

    let hasContentType = false;
    req_headers.forEach(headerItem => {
      // TODO 'Content-Type' 排除大小写不同格式影响
      if (headerItem.name === 'Content-Type'){
        hasContentType = true;
        headerItem.value = headerItem.value || 'application/x-www-form-urlencoded';
      }
    })
    if (!hasContentType) {
      req_headers.push({name: 'Content-Type', value: 'application/x-www-form-urlencoded'});
    }
    const domains = env.concat();
    if (domain && !env.find(item => item.domain === domain)) {
      domains.push([{name: 'default', domain}])
    }

    this.setState({
      method,
      domains,
      pathParam: req_params.concat(),
      pathname,
      query: req_query.concat(),
      bodyForm: req_body_form.concat(),
      headers: req_headers.concat(),
      bodyOther: req_body_other,
      currDomain: domain || env[0].domain,
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
    this.setState({headers: this.objToArr(headersObj)})
  }

  @autobind
  changeQuery(e, index, isKey) {
    const query = JSON.parse(JSON.stringify(this.state.query));
    const v = e.target.value;
    if (isKey) {
      query[index].name = v;
    } else {
      query[index].value = v;
    }
    this.setState({ query });
  }
  @autobind
  addQuery() {
    const { query } = this.state;
    this.setState({query: query.concat([{name: '', value: ''}])})
  }
  @autobind
  deleteQuery(index) {
    const { query } = this.state;
    this.setState({query: query.filter((item, i) => +index !== +i)});
  }

  @autobind
  changePathParam(e, index, isKey) {
    const pathParam = JSON.parse(JSON.stringify(this.state.pathParam));
    const v = e.target.value;
    const name = pathParam[index].name;
    let newPathname = this.state.pathname;
    if (isKey) {
      if (!name && v) {
        newPathname += `/:${v}`;
      } else {
        newPathname = newPathname.replace(`/:${name}`, v ? `/:${v}` : '')
      }
      pathParam[index].name = v;
    } else {
      pathParam[index].value = v;
    }
    this.setState({ pathParam, pathname: newPathname });
  }
  @autobind
  addPathParam() {
    const { pathParam } = this.state;
    this.setState({pathParam: pathParam.concat([{name: '', value: ''}])})
  }
  @autobind
  deletePathParam(index) {
    const { pathParam } = this.state;
    const name = pathParam[index].name;
    const newPathname = this.state.pathname.replace(`/:${name}`, '');
    this.setState({pathParam: pathParam.filter((item, i) => +index !== +i), pathname: newPathname});
  }

  @autobind
  changeBody(e, index, type) {
    const bodyForm = JSON.parse(JSON.stringify(this.state.bodyForm));
    switch (type) {
      case 'key':
        bodyForm[index].name = e.target.value
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
    this.setState({bodyForm: bodyForm.concat([{name: '', value: '', type: 'text'}])})
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
    const keyName = key || 'name';
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
      if (item.name && item.type !== 'file') {
        obj[item.name] = item.value || '';
      }
    })
    return obj;
  }
  getFiles(bodyForm) {
    const files = {};
    bodyForm.forEach(item => {
      if (item.name && item.type === 'file') {
        files[item.name] = item.value
      }
    })
    return files;
  }
  getQueryObj(query) {
    const queryObj = {};
    query.forEach(item => {
      if (item.name) {
        queryObj[item.name] = item.value || '';
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

    const { method, domains, pathParam, pathname, query, headers, bodyForm, bodyOther, currDomain, bodyType } = this.state;
    const hasPlugin = this.hasCrossRequestPlugin();
    let path = pathname;
    pathParam.forEach(item => {
      path = path.replace(`:${item.name}`, item.value || `:${item.name}`);
    });
    const search = decodeURIComponent(URL.format({query: this.getQueryObj(query)}));

    return (
      <div className="interface-test">
        <div  className="has-plugin">
          {
            hasPlugin ? '' :
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
                  domains.map((item, index) => (<Option value={item.domain} key={index}>{item.name + '：' + item.domain}</Option>))
                }
              </Select>
              <Input value={path + search} onChange={this.changePath} spellCheck="false" style={{flexBasis: 180, flexGrow: 1}} />
            </InputGroup>
            <Tooltip placement="bottom" title="请求真实接口">
              <Button
                onClick={this.reqRealInterface}
                type="primary"
                style={{marginLeft: 10}}
                loading={this.state.loading}
              >发送</Button>
            </Tooltip>
            <Tooltip placement="bottom" title="保存到集合">
              <Button
                onClick={this.props.save}
                type="primary"
                style={{marginLeft: 10}}
              >保存</Button>
            </Tooltip>
          </div>

          <Collapse defaultActiveKey={['0', '1', '2', '3']} bordered={true}>
            <Panel header="PATH PARAMETERS" key="0" className={pathParam.length === 0 ? 'hidden' : ''}>
              {
                pathParam.map((item, index) => {
                  return (
                    <div key={index} className="key-value-wrap">
                      <Input value={item.name} onChange={e => this.changePathParam(e, index, true)} className="key" />
                      <span className="eq-symbol">=</span>
                      <Input value={item.value} onChange={e => this.changePathParam(e, index)} className="value" />
                      <Icon type="delete" className="icon-btn" onClick={() => this.deletePathParam(index)} />
                    </div>
                  )
                })
              }
              <Button type="primary" icon="plus" onClick={this.addPathParam}>Add path parameter</Button>
            </Panel>
            <Panel header="QUERY PARAMETERS" key="1">
              {
                query.map((item, index) => {
                  return (
                    <div key={index} className="key-value-wrap">
                      <Input value={item.name} onChange={e => this.changeQuery(e, index, true)} className="key" />
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
                          <Input value={item.name} onChange={e => this.changeBody(e, index, 'key')} className="key" />
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
