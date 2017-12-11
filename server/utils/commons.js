const fs = require('fs-extra');
const path = require('path');
const yapi = require('../yapi.js');
const sha1 = require('sha1');
const logModel = require('../models/log.js');
const json5 = require('json5');
const _ = require('underscore');

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
    options.subject = options.subject ? options.subject + '-YApi 平台' : 'YApi 平台';

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

exports.handleVarPath = (pathname, params)=>{

    function insertParams(name){
        if (!_.find(params, { name: name })) {
            params.push({
                name: name,
                desc: ''
            })
        }
    }

    if(!pathname) return;
    if(pathname.indexOf(':') !== -1){
        let paths = pathname.split("/"), name, i;
        for (i = 1; i < paths.length; i++) {
            if (paths[i] && paths[i][0] === ':') {
                name = paths[i].substr(1);
                insertParams(name)
            }
        }
    }
    pathname.replace(/\{(.+?)\}/g, function(str, match){
        insertParams(match)
    })
}

/**
 * 验证一个 path 是否合法
 * path第一位必需为 /, path 只允许由 字母数字-/_:.{}= 组成
 */
exports.verifyPath = (path) => {
    if (/^\/[a-zA-Z0-9\-\/_:\.\{\}\=]*$/.test(path)) {
        return true;
    } else {
        return false;
    }
};

/**
 * 沙盒执行 js 代码 
 * @sandbox Object context
 * @script String script
 * @return sandbox
 * 
 * @example let a = sandbox({a: 1}, 'a=2')
 * a = {a: 2}
 */
exports.sandbox = (sandbox, script) => {
    const vm = require('vm');
    sandbox = sandbox || {};
    script = new vm.Script(script);
    const context = new vm.createContext(sandbox);
    script.runInContext(context, {
        timeout: 3000
    });
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

/**
 * 处理请求参数类型，String 字符串去除两边空格，Number 使用parseInt 转换为数字
 * @params Object {a: ' ab ', b: ' 123 '}
 * @keys Object {a: 'string', b: 'number'}
 * @return Object {a: 'ab', b: 123}
 */
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
                case 'number': params[key] = !isNaN(params[key]) ? parseInt(params[key], 10) : 0;
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


/**
 *
 * @param {*} router router
 * @param {*} baseurl base_url_path
 * @param {*} routerController controller
 * @param {*} path  routerPath
 * @param {*} method request_method , post get put delete ...
 * @param {*} action controller action_name
 * @param {*} ws enable ws
 */
exports.createAction = (router, baseurl, routerController, action, path, method, ws) => {
    router[method](baseurl + path, async (ctx) => {
        let inst = new routerController(ctx);
        try {
            await inst.init(ctx);

            if (inst.$auth === true) {
                await inst[action].call(inst, ctx);
            } else {
                if (ws === true) {
                    ctx.ws.send('请登录...');
                } else {
                    ctx.body = yapi.commons.resReturn(null, 40011, '请登录...');
                }
            }
        } catch (err) {
            ctx.body = yapi.commons.resReturn(null, 40011, '服务器出错...');
            yapi.commons.log(err, 'error')
        }

    });
}