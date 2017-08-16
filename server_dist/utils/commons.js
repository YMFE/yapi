'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _sha = require('sha1');

var _sha2 = _interopRequireDefault(_sha);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.resReturn = function (data, num, errmsg) {
    num = num || 0;

    return {
        errcode: num,
        errmsg: errmsg || 'success',
        data: data
    };
};

exports.log = function (msg, type) {
    if (!msg) {
        return;
    }

    type = type || 'log';

    var f = void 0;

    switch (type) {
        case 'log':
            f = console.log; // eslint-disable-line
            break;
        case 'warn':
            f = console.warn; // eslint-disable-line
            break;
        case 'error':
            f = console.error; // eslint-disable-line
            break;
        default:
            f = console.log; // eslint-disable-line
            break;
    }

    f(type + ':', msg);

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();

    var logfile = _path2.default.join(_yapi2.default.WEBROOT_LOG, year + '-' + month + '.log');

    if ((typeof msg === 'undefined' ? 'undefined' : (0, _typeof3.default)(msg)) === 'object') {
        if (msg instanceof Error) msg = msg.message;else msg = (0, _stringify2.default)(msg);
    }

    var data = new Date().toLocaleTimeString() + '\t|\t' + type + '\t|\t' + msg;

    _fsExtra2.default.writeFileSync(logfile, data, {
        flag: 'w+'
    });
};

exports.fileExist = function (filePath) {
    try {
        return _fsExtra2.default.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
};

exports.time = function () {
    return Date.parse(new Date()) / 1000;
};

exports.fieldSelect = function (data, field) {
    if (!data || !field || !Array.isArray(field)) {
        return null;
    }

    var arr = {};

    field.forEach(function (f) {
        data[f] && (arr[f] = data[f]);
    });

    return arr;
};

exports.rand = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

exports.json_parse = function (json) {
    try {
        return _json2.default.parse(json);
    } catch (e) {
        return json;
    }
};

exports.randStr = function () {
    return Math.random().toString(36).substr(2);
};

exports.generatePassword = function (password, passsalt) {
    return (0, _sha2.default)(password + (0, _sha2.default)(passsalt));
};

exports.expireDate = function (day) {
    var date = new Date();
    date.setTime(date.getTime() + day * 86400000);
    return date;
};

exports.sendMail = function (options, cb) {
    if (!_yapi2.default.mail) return false;
    options.subject = options.subject ? options.subject + '-yapi平台' : 'ypai平台';

    cb = cb || function (err) {
        if (err) {
            _yapi2.default.commons.log('send mail ' + options.to + ' error,' + err.message, 'error');
        } else {
            _yapi2.default.commons.log('send mail ' + options.to + ' success');
        }
    };

    try {
        _yapi2.default.mail.sendMail({
            from: _yapi2.default.WEBCONFIG.mail.from,
            to: options.to,
            subject: 'yapi平台',
            html: options.contents
        }, cb);
    } catch (e) {
        console.error(e.message); // eslint-disable-line
    }
};

exports.validateSearchKeyword = function (keyword) {
    if (/^\*|\?|\+|\$|\^|\\|\.$/.test(keyword)) {
        return false;
    }

    return true;
};

exports.filterRes = function (list, rules) {
    return list.map(function (item) {
        var filteredRes = {};

        rules.forEach(function (rule) {
            if (typeof rule == 'string') {
                filteredRes[rule] = item[rule];
            } else if ((typeof rule === 'undefined' ? 'undefined' : (0, _typeof3.default)(rule)) == 'object') {
                filteredRes[rule.alias] = item[rule.key];
            }
        });

        return filteredRes;
    });
};

exports.verifyPath = function (path) {
    if (/^\/[a-zA-Z0-9\-\/_:\.]+$/.test(path)) {
        if (path[path.length - 1] === '/') {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

function trim(str) {
    if (!str) {
        return str;
    }

    str = str + '';

    return str.replace(/(^\s*)|(\s*$)/g, '');
}

function ltrim(str) {
    if (!str) {
        return str;
    }

    str = str + '';

    return str.replace(/(^\s*)/g, '');
}

function rtrim(str) {
    if (!str) {
        return str;
    }

    str = str + '';

    return str.replace(/(\s*$)/g, '');
}

exports.trim = trim;
exports.ltrim = ltrim;
exports.rtrim = rtrim;

exports.handleParams = function (params, keys) {
    if (!params || (typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) !== 'object' || !keys || (typeof keys === 'undefined' ? 'undefined' : (0, _typeof3.default)(keys)) !== 'object') {
        return false;
    }

    for (var key in keys) {
        var filter = keys[key];
        if (params[key]) {
            switch (filter) {
                case 'string':
                    params[key] = trim(params[key] + '');
                    break;
                case 'number':
                    params[key] = parseInt(params[key], 10);
                    break;
                default:
                    params[key] = trim(params + '');
            }
        }
    }

    return params;
};