'use strict';

var mongoose = require('mongoose');
var yapi = require('../yapi.js');
var autoIncrement = require('mongoose-auto-increment');

function model(model, schema) {
    if (schema instanceof mongoose.Schema === false) {
        schema = new mongoose.Schema(schema);
    }

    schema.set('autoIndex', false);

    return yapi.connect.model(model, schema, model);
}

function connect(callback) {
    mongoose.Promise = global.Promise;

    var config = yapi.WEBCONFIG;
    var options = {};

    if (config.db.user) {
        options.user = config.db.user;
        options.pass = config.db.pass;
    }

    var db = mongoose.connect('mongodb://' + config.db.servername + ':' + config.db.port + '/' + config.db.DATABASE, options);

    db.then(function () {
        yapi.commons.log('mongodb load success...');
        if (typeof callback === 'function') {
            callback.call(db);
        }
    }, function (err) {
        yapi.commons.log(err, 'Mongo connect error');
    });

    autoIncrement.initialize(db);
    return db;
}

yapi.db = model;

module.exports = {
    model: model,
    connect: connect
};