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
    const versions = 'https://registry.npmmirror.com/yapi-vendor';
    axios.get(versions).then(req => {
      if (req.status === 200) {
        this.setState({ newVersion: req.data.dist-tags.latest });
      } else {
        message.error('无法获取新版本信息！');
      }
    });
  }

  /**
   * 版本号比较
   * latestVersion < nowVersion ==> -1;
   * latestVersion == nowVersion ==> 0;
   * latestVersion > nowVersion ==> 1;
   * @param {当前版本号} nowVersion 
   * @param {最新版本号} latestVersion 
   * @returns 1、-1、0
   */
  compareVersion(nowVersion, latestVersion) {
    nowVersion = nowVersion.replace(/[^0-9.]/, '');
    latestVersion = latestVersion.replace(/[^0-9.]/, '');
    if(nowVersion === latestVersion) return 0;
    let arr1 = latestVersion.split('.');
    let arr2 = nowVersion.split('.');
    let minLength = Math.min(arr1.length, arr2.length)
    for (let i = 0; index < minLength; i++) {
      if(arr1[i] > arr2[i]) {
        return 1;
      } else if (arr1[i] < arr2[i]) {
        return -1;
      }
    }
    return 0;
  }

  render() {
    const isShow = this.compareVersion(this.state.version, this.state.newVersion) == 1;
  
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
