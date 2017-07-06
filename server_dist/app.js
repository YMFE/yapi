'use strict';

var _yapi = require('./yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _commons = require('./utils/commons');

var _commons2 = _interopRequireDefault(_commons);

var _db = require('./utils/db.js');

var _db2 = _interopRequireDefault(_db);

var _userauth = require('./middleware/userauth.js');

var _userauth2 = _interopRequireDefault(_userauth);

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

_yapi2.default.commons = _commons2.default;

_yapi2.default.connect = _db2.default.connect();

var app = new _koa2.default();
app.use(_userauth2.default);
app.use((0, _koaBodyparser2.default)());
app.use(_router2.default.routes());
app.use(_router2.default.allowedMethods());
app.use((0, _koaStatic2.default)(_yapi2.default.path.join(_yapi2.default.WEBROOT, 'static')));
app.listen(_yapi2.default.WEBCONFIG.port);
_commons2.default.log('the server is start at port ' + _yapi2.default.WEBCONFIG.port);

_yapi2.default.fs.ensureDirSync(_yapi2.default.WEBROOT_RUNTIME);
_yapi2.default.fs.ensureDirSync(_yapi2.default.WEBROOT_LOG);