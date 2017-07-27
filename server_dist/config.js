'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * config.js是用来第一次安装初始化网站配置，如果不用默认的runtime_path，可以直接修改runtime_path路径
 */
var runtime_path = _path2.default.join(_path2.default.resolve(__dirname, '../'), 'runtime');
var config = {
  "port": 80,
  "runtime_path": runtime_path,
  "webhost": "yapi.local.qunar.com",
  "adminAccount": "admin@admin.com",
  "db": {
    "servername": "127.0.0.1",
    "DATABASE": "yapi",
    "port": 27017
  },
  "mail": {
    "host": "smtp.mail.com",
    "from": "****@mail.com",
    "port": 4652,
    "auth": {
      "user": "****@mail.com",
      "pass": "**********"
    }
  }
};

module.exports = config;