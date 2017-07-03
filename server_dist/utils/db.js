'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _commons = require('./commons.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
    _mongoose2.default.Promise = global.Promise;
    var config = WEBCONFIG;
    var db = _mongoose2.default.connect('mongodb://' + config.db.servername + ':' + config.db.port + '/' + config.db.DATABASE);

    db.then(function (res) {
        (0, _commons.log)('mongodb load success...');
    }, function (err) {
        (0, _commons.log)(err, 'Mongo connect error');
    });

    checkDatabase();
    return db;
}

function checkDatabase() {
    var exist = (0, _commons.fileExist)(_path2.default.join(WEBROOT_RUNTIME, 'init.lock'));
    if (!exist) {
        (0, _commons.log)('lock is not exist');
    }
}

exports.default = init;