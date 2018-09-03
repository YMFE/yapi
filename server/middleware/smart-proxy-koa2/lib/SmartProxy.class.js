const sha256 = require('./sha256');
const debug = require('debug')('smart-proxy');

const _defaultOptions = {
  token: '',
  enable: true,
  logger(msg) {
    debug(msg);
  },
  env: process.env.NODE_ENV || 'development',
  defaultUserInfo: {
    id: '6666',
    name: 'edenhliu'
  }
};

class SmartProxy {
  constructor(options) {
    if (typeof options === 'string') {
      options = { token: options };
    }
    this.options = Object.assign({}, _defaultOptions, options);

    if (typeof options === 'object' && options.enable) {
      this.enable = true;
    }

    this.token = this.options.token;

    if (!this.enable) {
      this.log('warning', `智能网关未开启，将会返回默认用户：${this.options.defaultUserInfo.name}`);
    } else if (!this.token) {
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

    if (!this.enable) {
      result = this.options.defaultUserInfo;
      this.log('info', `智能网关未开启，返回默认用户信息：${JSON.stringify(this.options.defaultUserInfo)}`);
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
