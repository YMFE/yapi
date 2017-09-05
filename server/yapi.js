const path = require('path');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');
const config = require('../../config.json');

let insts = new Map();
let mail;

const WEBROOT = path.resolve(__dirname, '..'); //路径
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.resolve(__dirname, '../..');
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
const WEBCONFIG = config;

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
function getInst(m, ...args) {
    if (!insts.get(m)) {
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

var hooks = {
    'third_login': {
        type: 'single',
        listener: null
    },
    'add_interface': {
        type: 'mulit',
        listener: []
    }
};

function bindHook(name, listener){
    if(!name) throw new Error('缺少hookname');
    if(name in hooks === false){
        throw new Error('不存在的hookname');
    }
    if(hooks[name].type === 'multi'){
         hooks[name].listener.push(listener);
    }else{
        hooks[name].listener = listener;
    }
    
}

function emitHook(name){
    if(!name) throw new Error('缺少hookname');
    if(name in hooks === false){
        throw new Error('不存在的hookname');
    }
    
    if(hooks[name] && typeof hooks[name] === 'object'){
        if(hooks[name].type === 'single' && typeof hooks[name].listener === 'function'){
            return hooks[name].listener.call();
        }
        if(Array.isArray(hooks[name.listener])){
            hooks[name].listener.forEach(listener=>{
                listener.call()
            })
        }
    }
}

let r = {
    fs: fs,
    path: path,
    WEBROOT: WEBROOT,
    WEBROOT_SERVER: WEBROOT_SERVER,
    WEBROOT_RUNTIME: WEBROOT_RUNTIME,
    WEBROOT_LOG: WEBROOT_LOG,
    WEBCONFIG: WEBCONFIG,
    getInst: getInst,
    delInst: delInst,
    getInsts: insts,
    emitHook: emitHook,
    bindHook: bindHook
};
if (mail) r.mail = mail;
module.exports = r;