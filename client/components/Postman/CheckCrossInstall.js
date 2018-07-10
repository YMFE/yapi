import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

exports.initCrossRequest = function (fn) {
  let startTime = 0;
  let _crossRequest = setInterval(() => {
    startTime += 500;
    if (startTime > 5000) {
      clearInterval(_crossRequest);
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest);
      fn(true);
    } else {
      fn(false);
    }
  }, 500);
  return _crossRequest;
};

CheckCrossInstall.propTypes = {
  hasPlugin: PropTypes.bool
};

function CheckCrossInstall(props) {
  const hasPlugin = props.hasPlugin;
  return (
    <div className={hasPlugin ? null : 'has-plugin'}>
      {hasPlugin ? (
        ''
      ) : (
        <Alert
          message={
            <div>
              重要：当前的接口测试服务，需安装免费测试增强插件,仅支持 chrome
              浏览器，选择下面任意一种安装方式：
              <div>
                <a
                  target="blank"
                  href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
                >
                  [Google 商店获取（需翻墙]
                </a>
              </div>
              <div>
                <a target="blank" href="/api/interface/download_crx">
                  {' '}
                  [手动下载]{' '}
                </a>
                <span> zip 文件解压后将 crx 文件拖入到 chrome://extensions/ </span>
                <a target="blank" href="http://www.jianshu.com/p/12ca04c61fc6">
                  {' '}
                  [详细安装教程]{' '}
                </a>
              </div>
            </div>
          }
          type="warning"
        />
      )}
    </div>
  );
}

export default CheckCrossInstall;
