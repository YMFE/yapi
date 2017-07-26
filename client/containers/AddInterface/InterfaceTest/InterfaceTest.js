import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input } from 'antd'
import { autobind } from 'core-decorators';
import crossRequest from 'cross-request';
import { withRouter } from 'react-router';
import URL from 'url';

import {
} from '../../../actions/group.js'

import './InterfaceTest.scss'

const { TextArea } = Input;

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
    res: {},
    header: {}
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  @autobind
  testInterface() {
    const { method, url, seqGroup, interfaceProject } = this.props;
    const { prd_host, basepath, protocol } = interfaceProject;
    const reqParams = JSON.parse(this.props.reqParams);
    const headers = {}
    let query = {};

    if (method === 'GET') {
      Object.keys(reqParams).forEach(key => {
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams) : reqParams.toString();
        query[key] = value;
      })
    }

    seqGroup.forEach((headerItem) => {
      headers[headerItem.name] = headerItem.value;
    })

    const href = URL.format({
      protocol: protocol || 'http',
      host: prd_host,
      pathname: (basepath + url).replace(/\/+/g, '/'),
      query
    });

    crossRequest({
      url: href,
      method,
      headers,
      data: {
        a:1
      },
      success: (res, header) => {
        console.log(header)
        this.setState({res})
      }
    })
  }


  render () {
    const { method, url, seqGroup, interfaceName, interfaceProject } = this.props;
    const { prd_host, basepath, protocol } = interfaceProject;
    const reqParams = JSON.parse(this.props.reqParams);
    let query = {};

    if (method === 'GET') {
      Object.keys(reqParams).forEach(key => {
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams[key]) : reqParams[key].toString();
        query[key] = value;
      })
    }

    const href = URL.format({
      protocol: protocol || 'http',
      host: prd_host,
      pathname: (basepath + url).replace(/\/+/g, '/'),
      query
    });


    return (
      <div className="interface-test">
        <div className="interface-name">{interfaceName}</div>
        <div className="req-part">
          <div className="req-row method">
            METHOD：<Input value={method} disabled style={{display: 'inline-block', width: 200}} />
          </div>
          <div className="req-row url">
            URL：<Input value={href} style={{display: 'inline-block', width: 800, margin: 10}} />
            <Button onClick={this.testInterface} type="primary">发送</Button>
          </div>
          <div className="req-row headers">
            HEADERS：
            {
              seqGroup.map((headerItem, index) => {
                return (
                  <div key={index}>
                    <Input disabled value={headerItem.name} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                    <Input value={headerItem.value} style={{display: 'inline-block', width: 200, margin: 10}} />
                  </div>
                )
              })
            }
          </div>
          <div className="req-row params">
            请求参数：
            {
              Object.keys(reqParams).map((key, index) => {
                const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams[key]) : reqParams[key].toString();
                return (
                  <div key={index}>
                    <Input disabled value={key} style={{display: 'inline-block', width: 200, margin: 10}} />{' = '}
                    <Input value={value} style={{display: 'inline-block', width: 200, margin: 10}} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="res-part">
          返回结果：
          <TextArea value={JSON.stringify(this.state.res, 2)}></TextArea>
        </div>
      </div>
    )
  }
}
