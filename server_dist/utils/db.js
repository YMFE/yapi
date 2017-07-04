'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function model(model, schema) {
    return _mongoose2.default.model(model, schema, model);
}

function connect() {
    _mongoose2.default.Promise = global.Promise;
    var config = _yapi2.default.WEBCONFIG;

    var db = _mongoose2.default.connect('mongodb://' + config.db.servername + ':' + config.db.port + '/' + config.db.DATABASE);

    db.then(function (res) {
        _yapi2.default.commons.log('mongodb load success...');
    }, function (err) {
        _yapi2.default.commons.log(err, 'Mongo connect error');
    });

    checkDatabase();
    return db;
}

function checkDatabase() {
    var exist = _yapi2.default.commons.fileExist(_yapi2.default.path.join(_yapi2.default.WEBROOT_RUNTIME, 'init.lock'));
    if (!exist) {
        _yapi2.default.commons.log('lock is not exist');
    }
}

_yapi2.default.db = model;

module.exports = {
    model: model,
    connect: connect
};