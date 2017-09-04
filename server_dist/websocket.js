'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var koaRouter = require('koa-router');
var interfaceController = require('./controllers/interface.js');
var router = koaRouter();

function websocket(app) {
  console.log('load websocket...');
  app.ws.use(function (ctx, next) {
    return next(ctx);
  });
  router.get('/api/interface/solve_conflict', function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
      var inst;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              inst = new interfaceController(ctx);
              _context.next = 3;
              return inst.init(ctx);

            case 3:
              if (!(inst.$auth === true)) {
                _context.next = 8;
                break;
              }

              _context.next = 6;
              return inst.solveConflict.call(inst, ctx);

            case 6:
              _context.next = 9;
              break;

            case 8:
              ctx.ws.send('请登录...');

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  app.ws.use(router.routes());
  app.ws.use(router.allowedMethods());
}

module.exports = websocket;