const fs = require('fs-extra');
const path = require('path');
const yapi = require('../yapi.js');
const sha1 = require('sha1');
const logModel = require('../models/log.js');
const json5 = require('json5');

exports.resReturn = (data, num, errmsg) => {
    num = num || 0;

    return {
        errcode: num,
        errmsg: errmsg || '成功！',
        data: data
    };
};

exports.log = (msg, type) => {
    if (!msg) {
        return;
    }

    type = type || 'log';

    let f;

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

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    let logfile = path.join(yapi.WEBROOT_LOG, year + '-' + month + '.log');

    if (typeof msg === 'object') {
        if (msg instanceof Error) msg = msg.message;
        else msg = JSON.stringify(msg);
    }

    let data = (new Date).toLocaleTimeString() + '\t|\t' + type + '\t|\t' + msg;

    fs.writeFileSync(logfile, data, {
        flag: 'w+'
    });
};

exports.fileExist = (filePath) => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
};

exports.time = () => {
    return Date.parse(new Date()) / 1000;
};

exports.fieldSelect = (data, field) => {
    if (!data || !field || !Array.isArray(field)) {
        return null;
    }

    var arr = {};

    field.forEach((f) => {
        (typeof data[f] !== 'undefined') && (arr[f] = data[f]);
    });

    return arr;
};

exports.rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

exports.json_parse = (json) => {
    try {
        return json5.parse(json);
    } catch (e) {
        return json;
    }
};

exports.randStr = () => {
    return Math.random().toString(36).substr(2);
};

exports.generatePassword = (password, passsalt) => {
    return sha1(password + sha1(passsalt));
};

exports.expireDate = (day) => {
    let date = new Date();
    date.setTime(date.getTime() + day * 86400000);
    return date;
};

exports.sendMail = (options, cb) => {
    if (!yapi.mail) return false;
    options.subject = options.subject ? options.subject + '-yapi平台' : 'ypai平台';

    cb = cb || function (err) {
        if (err) {
            yapi.commons.log('send mail ' + options.to + ' error,' + err.message, 'error');
        } else {
            yapi.commons.log('send mail ' + options.to + ' success');
        }
    };

    try {
        yapi.mail.sendMail({
            from: yapi.WEBCONFIG.mail.from,
            to: options.to,
            subject: options.subject,
            html: options.contents
        }, cb);
    } catch (e) {
        yapi.commons.log(e.message, 'error')
        console.error(e.message); // eslint-disable-line
    }
};

exports.validateSearchKeyword = keyword => {
    if (/^\*|\?|\+|\$|\^|\\|\.$/.test(keyword)) {
        return false;
    }

    return true;
};

exports.filterRes = (list, rules) => {
    return list.map(item => {
        let filteredRes = {};

        rules.forEach(rule => {
            if (typeof rule == 'string') {
                filteredRes[rule] = item[rule];
            } else if (typeof rule == 'object') {
                filteredRes[rule.alias] = item[rule.key];
            }
        });

        return filteredRes;
    });
};

exports.verifyPath = (path) => {
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

exports.sandbox = (sandbox, script) => {
    const vm = require('vm');
    sandbox = sandbox || {};
    script = new vm.Script(script);
    const context = new vm.createContext(sandbox);
    script.runInContext(context);
    return sandbox;
}

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

exports.handleParams = (params, keys) => {
    if (!params || typeof params !== 'object' || !keys || typeof keys !== 'object') {
        return false;
    }

    for (var key in keys) {
        var filter = keys[key];
        if (params[key]) {
            switch (filter) {
                case 'string': params[key] = trim(params[key] + '');
                    break;
                case 'number': params[key] = parseInt(params[key], 10);
                    break;
                default: params[key] = trim(params + '');
            }
        }
    }

    return params;
};


exports.saveLog = (logData) => {
    try {
        let logInst = yapi.getInst(logModel);
        let data = {
            content: logData.content,
            type: logData.type,
            uid: logData.uid,
            username: logData.username,
            typeid: logData.typeid
        };
        logInst.save(data).then(

        );
    } catch (e) {
        yapi.commons.log(e, 'error'); // eslint-disable-line
    }
};
