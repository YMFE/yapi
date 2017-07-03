'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _init = require('./init.js');

var _init2 = _interopRequireDefault(_init);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _configDev = require('./config.dev.json');

var _configDev2 = _interopRequireDefault(_configDev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.splice(2);
var isDev = args[0] === 'dev' ? true : false;
var config = isDev ? _configDev2.default : _config2.default;

global.WEBROOT = _path2.default.resolve(__dirname, '..');
global.WEBROOT_SERVER = __dirname;
global.WEBROOT_RUNTIME = _path2.default.join(WEBROOT, 'runtime');
global.WEBROOT_LOG = _path2.default.join(WEBROOT_RUNTIME, 'log');
global.WEBCONFIG = config;

(0, _init2.default)();