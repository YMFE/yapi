'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commons = require('./utils/commons.js');

var _commons2 = _interopRequireDefault(_commons);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _db = require('./utils/db.js');

var _db2 = _interopRequireDefault(_db);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _router = require('./router.js');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runSever() {
    var app = new _koa2.default();
    app.use((0, _koaBodyparser2.default)());
    app.use((0, _koaStatic2.default)(_path2.default.join(WEBROOT, 'static')));
    app.use(_router2.default.routes());
    app.use(_router2.default.allowedMethods());
    app.listen(WEBCONFIG.port);
    _commons2.default.log('the server is start at port ' + WEBCONFIG.port);
}

module.exports = function () {
    global.yapi = {
        db: _mongoose2.default,
        commons: _commons2.default,
        fs: _fsExtra2.default,
        path: _path2.default
    };
    _fsExtra2.default.ensureDirSync(WEBROOT_RUNTIME);
    _fsExtra2.default.ensureDirSync(WEBROOT_LOG);
    (0, _db2.default)();
    runSever();
};