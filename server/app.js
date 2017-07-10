import yapi from './yapi.js';

import commons from './utils/commons';
yapi.commons = commons;


import dbModule from './utils/db.js';

import userauth from './middleware/userauth.js'
//checkToken作为中间件存在
import checkToken  from './middleware/checkToken.js';

import Koa from 'koa'
import convert from 'koa-convert'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import router from './router.js'

yapi.connect = dbModule.connect()    

const app = new Koa()
app.use(userauth)
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.use(koaStatic(
    yapi.path.join(yapi.WEBROOT, 'static')
))
app.use(checkToken) //不是注册和登录，才需要检查token
app.listen(yapi.WEBCONFIG.port)
commons.log(`the server is start at port ${yapi.WEBCONFIG.port}`)



yapi.fs.ensureDirSync(yapi.WEBROOT_RUNTIME);   
yapi.fs.ensureDirSync(yapi.WEBROOT_LOG);










