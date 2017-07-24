
import fs from 'fs-extra'
import path from 'path'
import yapi from '../yapi.js'
import sha1 from 'sha1'

exports.resReturn = (data, num, errmsg) => {
    num = num || 0;
    return {
        errcode: num,
        errmsg: errmsg || 'success',
        data: data
    }
}

const MSGTYPE = {
    'log': 'Log',
    'warn': 'warning',
    'error': 'Error'
}

exports.log = (msg, type) => {
    if (!msg) return;
    type = type || 'log';
    let f;
    switch (type) {
        case 'log': f = console.log; break;
        case 'warn': f = console.warn; break;
        case 'error': f = console.error; break;
        default: f = console.log; break;
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
    let data = (new Date).toLocaleTimeString() + "\t|\t" + type + "\t|\t" + msg;
    fs.writeFileSync(logfile, data, {
        flag: 'w+'
    });


}


exports.fileExist = (filePath) => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

exports.time = () => {
    return Date.parse(new Date()) / 1000;
}

exports.fieldSelect = (data, field) => {
    if (!data || !field || !Array.isArray(field)) return null;
    var arr = {};
    field.forEach((f) => {
        data[f] && (arr[f] = data[f]);
    })
    return arr;
}

exports.rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

exports.json_parse = (json) => {
    try {
        return JSON.parse(json);
    } catch (e) {
        return json
    }
}

exports.randStr = () => {
    return Math.random().toString(36).substr(2)
}

exports.generatePassword = (password, passsalt) => {
    return sha1(password + sha1(passsalt));
}

exports.expireDate = (day) => {
    let date = new Date();
    date.setTime(date.getTime() + day * 86400000);
    return date;
}

exports.sendMail = (options, cb) => {
    if (!yapi.mail) return false;
    options.subject = options.subject ? options.subject + '-yapi平台' : 'ypai平台';
    cb = cb || function (err, info) {
        if (err) {
            yapi.commons.log('send mail ' + options.to + ' error,' + err.message, 'error');
        } else {
            yapi.commons.log('send mail ' + options.to + ' success');
        }

    }
    yapi.mail.sendMail({
        from: yapi.WEBCONFIG.mail.auth.user,
        to: options.to,
        subject: 'yapi平台',
        html: options.contents
    }, cb)
}

exports.validateSearchKeyword = keyword => {
    if (/^\*|\?|\+|\$|\^|\\|\.$/.test(keyword)) {
        return false;
    }
    return true;
}

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
    })
}

exports.verifyPath = (path) => {
    if (/^\/[a-zA-Z0-9\-\/_:]+$/.test(path)) {
        if (path[path.length - 1] === '/') {
            return false;
        } else {
            return true
        }
    } else {
        return false;
    }
}