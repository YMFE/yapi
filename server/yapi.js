import path from 'path'
import fs from 'fs-extra'
import prdConfig from './config.json'
import devConfig from './config.dev.json'
let args = process.argv.splice(2);
let isDev = args[0] === 'dev' ? true : false;
const config = isDev ? devConfig : prdConfig;

const WEBROOT = path.resolve(__dirname, '..');
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.join(WEBROOT, 'runtime');
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
const WEBCONFIG  = config;

module.exports = {
    fs: fs,
    path: path,
    WEBROOT: WEBROOT,
    WEBROOT_SERVER: WEBROOT_SERVER,
    WEBROOT_RUNTIME: WEBROOT_RUNTIME,
    WEBROOT_LOG: WEBROOT_LOG,
    WEBCONFIG: WEBCONFIG,
}