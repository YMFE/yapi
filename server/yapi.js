import path from 'path'
import fs from 'fs-extra'
import prdConfig from './config.json'
import devConfig from './config.dev.json'
let args = process.argv.splice(2);
let isDev = args[0] === 'dev' ? true : false;
var insts = new Map();
const config = isDev ? devConfig : prdConfig;

const WEBROOT = path.resolve(__dirname, '..');
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.join(WEBROOT, 'runtime');
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
const WEBCONFIG  = config;

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

module.exports = {
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