
import path from 'path'
import init from'./init.js'
import fs from 'fs-extra'

import prdConfig from './config.json'
import devConfig from './config.dev.json'

let args = process.argv.splice(2);
let isDev = args[0] === 'dev' ? true : false;
const config = isDev ? devConfig : prdConfig;


global.WEBROOT = path.resolve(__dirname, '..');
global.WEBROOT_SERVER = __dirname;
global.WEBROOT_RUNTIME = path.join(WEBROOT, 'runtime');
global.WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
global.WEBCONFIG  = config;

init();


