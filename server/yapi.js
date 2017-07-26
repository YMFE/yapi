import path from 'path'
import fs from 'fs-extra'
import nodemailer from 'nodemailer';
import config from '../runtime/config.json'

var insts = new Map();
let mail;

const WEBROOT = path.resolve(__dirname, '..'); //路径
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.join(WEBROOT, 'runtime');
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
const WEBCONFIG  = config;

fs.ensureDirSync(WEBROOT_RUNTIME);
fs.ensureDirSync(WEBROOT_LOG);



if(WEBCONFIG.mail){
    mail = nodemailer.createTransport(WEBCONFIG.mail)
}

/**
 * 获取一个model实例，如果不存在则创建一个新的返回
 * @param {*} m class
 * @example
 * yapi.getInst(groupModel, arg1, arg2)
 */
function getInst(m, ...args){
    if(!insts.get(m)){
        insts.set(m, new m(args))
    }
    return insts.get(m)
}

function delInst(m){
    try{
        insts.delete(m)
    }catch(err){
        console.error(err)
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
    getInsts: insts
}
if(mail) r.mail = mail;
module.exports = r;