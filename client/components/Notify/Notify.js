import React, { Component } from 'react';
import axios from 'axios';
import { Alert, message } from 'antd';

export default class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersion: process.env.version,
      version: process.env.version
    };
  }

  componentDidMount() {
    axios.get('https://www.easy-mock.com/mock/5c2851e3d84c733cb500c3b9/yapi/versions').then(req => {
      if (req.status === 200) {
        this.setState({ newVersion: req.data.data[0] });
      } else {
        message.error('无法获取新版本信息！');
      }
    });
  }

  render() {
    const isShow = this.state.newVersion !== this.state.version;
    return (
      <div>
        {isShow && (
          <Alert
            message={
              <div>
                当前版本是：{this.state.version}&nbsp;&nbsp;可升级到: {this.state.newVersion}
                &nbsp;&nbsp;&nbsp;
                <a
                  target="view_window"
                  href="https://github.com/YMFE/yapi/blob/master/CHANGELOG.md"
                >
                  版本详情
                </a>
              </div>
            }
            banner
            closable
            type="info"
          />
        )}
      </div>
    );
  }
}
