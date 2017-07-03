import path from 'path'
import commons from './utils/commons.js'
import fs from 'fs-extra'
import mongoose from 'mongoose'
import db from './utils/db.js'
import Koa from 'koa'
import convert from 'koa-convert'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import router from './router.js'

function runSever(){
    const app = new Koa()
    app.use(bodyParser())
    app.use(koaStatic(
    path.join(WEBROOT,'static')
    ))
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen( WEBCONFIG.port )
    commons.log(`the server is start at port ${WEBCONFIG.port}`)
}


module.exports = ()=>{
    global.yapi = {
        db: mongoose,
        commons: commons,
        fs: fs,
        path: path
    }
    fs.ensureDirSync(WEBROOT_RUNTIME);
    fs.ensureDirSync(WEBROOT_LOG);
    db();
    runSever();
}

