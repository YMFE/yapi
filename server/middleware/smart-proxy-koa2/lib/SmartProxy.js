const sha256 = require('./sha256');
const debug = require('debug')('smart-proxy');
debug.enabled = true;

const _defaultOptions = {
  token: '',
  enable: true,
  logger(msg) {
    debug(msg);
  },
  defaultUserInfo: {
    id: '6666',
    name: 'edenhliut'
  }
};
class SmartProxy {
  constructor(options) {
    this.options = { ..._defaultOptions, ...options };

    this.token = this.options.token;

    if (!this.token) {
      throw new Error('token required');
    }
  }

  log(level, message) {
    this.options.logger(`[${level}] ${message}`);
  }

  valid(info) {
    console.log(info.host);
    const currentToken = this.token;
    if (!currentToken) {
      this.log('failed', 'token参数不能为空');
      return false;
    }

    const timestamp = parseInt(info.timestamp, 10);
    const nowTimestamp = this.options.timestamp || ~~(new Date().getTime() / 1000); //eslint-disable-line
    if (Math.abs(nowTimestamp - timestamp) > 180) {
      this.log('failed', '时间误差超过180秒');
      return false;
    }

    const signature = sha256(
      `${timestamp}${currentToken}${info.xRioSeq},${info.staffId},${info.staffName},${info.xExtData}${timestamp}`
    );
    if (signature.toUpperCase() !== info.signature) {
      this.log('failed', '签名校验失败');
      return false;
    }

    this.log('info', '验证通过');
    return true;
  }

  auth(info) {
    let result = {};
    if (!info.staffName) {
      if (process.env.NODE_ENV === 'development') {
        this.log('info', '智能网管没有开启,使用默认用户');
        result = _defaultOptions.defaultUserInfo;
      } else {
        result = false;
      }
    } else if (this.valid(info)) {
      result = {
        id: info.staffId,
        name: info.staffName
      };
      this.log('info', `用户信息：${JSON.stringify(result)}`);
    } else {
      result = false;
      this.log('failed', '智能代理校验失败');
    }
    return result;
  }
}

module.exports = SmartProxy;
