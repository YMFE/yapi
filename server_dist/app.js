'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _yapi = require('./yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _commons = require('./utils/commons');

var _commons2 = _interopRequireDefault(_commons);

var _db = require('./utils/db.js');

var _db2 = _interopRequireDefault(_db);

var _mockServer = require('./middleware/mockServer.js');

var _mockServer2 = _interopRequireDefault(_mockServer);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _router = require('./router.js');

var _router2 = _interopRequireDefault(_router);

var _koaWebsocket = require('koa-websocket');

var _koaWebsocket2 = _interopRequireDefault(_koaWebsocket);

var _websocket = require('./websocket.js');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yapi2.default.commons = _commons2.default;


_yapi2.default.connect = _db2.default.connect();
var app = (0, _koaWebsocket2.default)(new _koa2.default());
var indexFile = process.argv[2] === 'dev' ? 'dev.html' : 'index.html';

app.use(_mockServer2.default);
app.use((0, _koaBodyparser2.default)());
app.use(_router2.default.routes());
app.use(_router2.default.allowedMethods());

(0, _websocket2.default)(app);

app.use(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!/^\/(?!api)[a-zA-Z0-9\/\-]*$/.test(ctx.path)) {
                            _context.next = 6;
                            break;
                        }

                        ctx.path = "/";
                        _context.next = 4;
                        return next();

                    case 4:
                        _context.next = 8;
                        break;

                    case 6:
                        _context.next = 8;
                        return next();

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());
app.use((0, _koaStatic2.default)(_yapi2.default.path.join(_yapi2.default.WEBROOT, 'static'), { index: indexFile }));

app.listen(_yapi2.default.WEBCONFIG.port);
_commons2.default.log('the server is start at port ' + _yapi2.default.WEBCONFIG.port);