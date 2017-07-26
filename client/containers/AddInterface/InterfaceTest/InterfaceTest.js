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
    crossRequest({
      url: 'http://petstore.swagger.io/v2/swagger.json',
      method: 'GET',
      data: {
        a:1
      },
      success: (res, header) => {
        this.setState({res})
        console.log(header)
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
        const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams) : reqParams.toString();
        query[key] = value;
      })
    }

    const href = URL.format({
      protocol: protocol || 'http',
      host: prd_host,
      pathname: URL.resolve(basepath, url),
      query
    });


    return (
      <div>
        <div>接口名：{interfaceName}</div>
        <div>
          METHOD: <Input value={method} disabled />
          URL: <Input value={href} />
          HEADERS: <Input value={JSON.stringify(seqGroup, 2)} />
          请求参数：
          <div>
            {
              Object.keys(reqParams).map((key, index) => {
                const value = typeof reqParams[key] === 'object' ? JSON.stringify(reqParams) : reqParams.toString();
                return (
                  <div key={index}>
                    <Input value={key} style={{display: 'inline-block', width: 200}} />{' = '}
                    <Input value={value} style={{display: 'inline-block', width: 200}} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <Button onClick={this.testInterface}>发送跨域请求</Button>
        <div>
          返回结果：
          {JSON.stringify(this.state.res, 2)}
        </div>
      </div>
    )
  }
}
