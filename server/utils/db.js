import mongoose from 'mongoose'
import yapi from '../yapi.js'

function model(model, schema){
    return mongoose.model(model, schema, model)
}

function connect(){
    mongoose.Promise = global.Promise;
    let config = yapi.WEBCONFIG;

    let db = mongoose.connect(`mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`);

    db.then(function (res) {
        yapi.commons.log('mongodb load success...')
    }, function (err) {
        yapi.commons.log(err, 'Mongo connect error');
    })


    checkDatabase();
    return db;
}

function checkDatabase(){
    let exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'))
    if(!exist){
        yapi.commons.log('lock is not exist')
    }
}

yapi.db = model;


module.exports =   {
    model: model,
    connect: connect
};




