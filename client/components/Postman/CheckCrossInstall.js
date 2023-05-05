import React from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'

exports.initCrossRequest = function(fn) {
  let startTime = 0
  let _crossRequest = setInterval(() => {
    startTime += 500
    if (startTime > 5000) {
      clearInterval(_crossRequest)
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest)
      fn(true)
    } else {
      fn(false)
    }
  }, 500)
  return _crossRequest
}

CheckCrossInstall.propTypes = {
  hasPlugin: PropTypes.bool,
}

function CheckCrossInstall(props) {
  const hasPlugin = props.hasPlugin
  return (
    <div className={hasPlugin ? null : 'has-plugin'}>
      {!hasPlugin && (
        <Alert
          showIcon
          type="warning"
          message="请安装跨域插件"
          description={
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="/api/interface/download_crx"
              >
                [手动下载插件包]
              </a>
              <span>，将 zip 文件解压后，在 Chrome 扩展页面中加载，</span>
              {/* 文档预留 */}
              查看详细安装教程
            </div>
          }
        />
      )}
    </div>
  )
}

export default CheckCrossInstall
