import path from 'path'
import mongoose from 'mongoose'
import {fileExist, log} from './commons.js'



function init(){
    mongoose.Promise = global.Promise;
    let config = WEBCONFIG;
    let db = mongoose.connect(`mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`);

    db.then(function (res) {
        log('mongodb load success...')
    }, function (err) {
        log(err, 'Mongo connect error');
    })

    checkDatabase();
    return db;
}

function checkDatabase(){
    let exist = fileExist(path.join(WEBROOT_RUNTIME, 'init.lock'))
    if(!exist){
        log('lock is not exist')
    }
}

export default init;