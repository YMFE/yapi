'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('./yapi.js');
var commons = require('./utils/commons');
yapi.commons = commons;
var dbModule = require('./utils/db.js');
var mockServer = require('./middleware/mockServer.js');
var Koa = require('koa');
var koaStatic = require('koa-static');
var bodyParser = require('koa-bodyparser');
var router = require('./router.js');
var websockify = require('koa-websocket');
var websocket = require('./websocket.js');

yapi.connect = dbModule.connect();
var app = websockify(new Koa());
var indexFile = process.argv[2] === 'dev' ? 'dev.html' : 'index.html';

app.use(mockServer);
app.use(bodyParser({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

websocket(app);

app.use(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!/^\/(?!api)[a-zA-Z0-9\/\-_]*$/.test(ctx.path)) {
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

app.use(function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx, next) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (ctx.path.indexOf('/prd') === 0) {
                            if (yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT, 'static', ctx.path + '.gz'))) {
                                ctx.set('Content-Encoding', 'gzip');
                                ctx.path = ctx.path + '.gz';
                            }
                        }
                        _context2.next = 3;
                        return next();

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());
app.use(koaStatic(yapi.path.join(yapi.WEBROOT, 'static'), { index: indexFile, gzip: true }));

app.listen(yapi.WEBCONFIG.port);
commons.log('the server is start at port ' + yapi.WEBCONFIG.port);