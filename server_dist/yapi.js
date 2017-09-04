'use strict';

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs-extra');
var nodemailer = require('nodemailer');
var config = require('../../config.json');

var insts = new _map2.default();
var mail = void 0;

var WEBROOT = path.resolve(__dirname, '..'); //路径
var WEBROOT_SERVER = __dirname;
var WEBROOT_RUNTIME = path.resolve(__dirname, '../..');
var WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
var WEBCONFIG = config;

fs.ensureDirSync(WEBROOT_LOG);

if (WEBCONFIG.mail) {
    mail = nodemailer.createTransport(WEBCONFIG.mail);
}

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
        console.error(err); // eslint-disable-line
    }
}

var r = {
    fs: fs,
    path: path,
    WEBROOT: WEBROOT,
    WEBROOT_SERVER: WEBROOT_SERVER,
    WEBROOT_RUNTIME: WEBROOT_RUNTIME,
    WEBROOT_LOG: WEBROOT_LOG,
    WEBCONFIG: WEBCONFIG,
    getInst: getInst,
    delInst: delInst,
    getInsts: insts
};
if (mail) r.mail = mail;
module.exports = r;