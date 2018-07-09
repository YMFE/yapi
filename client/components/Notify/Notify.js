import React, { Component } from 'react';
import axios from 'axios';
import { Alert, message } from 'antd';

export default class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersion: '',
      version: process.env.version,
      isOpen: process.env.isVersionInfo
    };
  }

  componentDidMount() {
    axios.get('http://yapi.demo.qunar.com/publicapi/versions').then(req => {
      if (req.status === 200) {
        this.setState({ newVersion: req.data[0].version });
      } else {
        message.error('无法获取新版本信息！');
      }
    });
  }

  render() {
    // if (this.state.isOpen && this.state.newVersion === this.state.version) {
    const isShow = this.state.isOpen && this.state.newVersion === this.state.version;
    return (
      <div>
        {isShow && (
          <Alert
            message={
              <div>
                当前版本是：{this.state.version} 可升级到: {this.state.newVersion}
                &nbsp;
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
