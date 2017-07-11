'use strict';

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _configDev = require('./config.dev.json');

var _configDev2 = _interopRequireDefault(_configDev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.splice(2);
var isDev = args[0] === 'dev' ? true : false;
var insts = new _map2.default();
var config = isDev ? _configDev2.default : _config2.default;

var WEBROOT = _path2.default.resolve(__dirname, '..'); //路径
var WEBROOT_SERVER = __dirname;
var WEBROOT_RUNTIME = _path2.default.join(WEBROOT, 'runtime');
var WEBROOT_LOG = _path2.default.join(WEBROOT_RUNTIME, 'log');
var WEBCONFIG = config;

/**
 * 获取一个model实例，如果不存在则创建一个新的返回
 * @param {*} m class
 * @example
 * yapi.getInst(groupModel, arg1, arg2)
 */
function getInst(m) {
    if (!insts.get(m)) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        insts.set(m, new m(args));
    }
    return insts.get(m);
}

function delInst(m) {
    try {
        insts.delete(m);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    fs: _fsExtra2.default,
    path: _path2.default,
    WEBROOT: WEBROOT,
    WEBROOT_SERVER: WEBROOT_SERVER,
    WEBROOT_RUNTIME: WEBROOT_RUNTIME,
    WEBROOT_LOG: WEBROOT_LOG,
    WEBCONFIG: WEBCONFIG,
    getInst: getInst,
    delInst: delInst,
    getInsts: insts
};