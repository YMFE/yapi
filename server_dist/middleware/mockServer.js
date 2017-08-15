'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
        var hostname, config, path, paths, projectId, projectInst, project, interfaceData, interfaceInst, res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _yapi2.default.commons.log('Server Recevie Request...');

                        hostname = ctx.hostname;
                        config = _yapi2.default.WEBCONFIG;
                        path = ctx.path;

                        if (!(path.indexOf('/mock/') !== 0)) {
                            _context.next = 9;
                            break;
                        }

                        if (!next) {
                            _context.next = 8;
                            break;
                        }

                        _context.next = 8;
                        return next();

                    case 8:
                        return _context.abrupt('return', true);

                    case 9:
                        paths = path.split("/");
                        projectId = paths[2];

                        paths.splice(0, 3);
                        path = "/" + paths.join("/");

                        if (projectId) {
                            _context.next = 15;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'projectId不能为空'));

                    case 15:

                        _yapi2.default.commons.log('MockServer Running...');
                        projectInst = _yapi2.default.getInst(_project2.default), project = void 0;
                        _context.prev = 17;
                        _context.next = 20;
                        return projectInst.get(projectId);

                    case 20:
                        project = _context.sent;
                        _context.next = 26;
                        break;

                    case 23:
                        _context.prev = 23;
                        _context.t0 = _context['catch'](17);
                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 403, _context.t0.message));

                    case 26:
                        if (!(project === false)) {
                            _context.next = 28;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '不存在的项目'));

                    case 28:
                        interfaceData = void 0;
                        interfaceInst = _yapi2.default.getInst(_interface2.default);
                        _context.prev = 30;
                        _context.next = 33;
                        return interfaceInst.getByPath(project._id, path.substr(project.basepath.length), ctx.method);

                    case 33:
                        interfaceData = _context.sent;

                        if (!(!interfaceData || interfaceData.length === 0)) {
                            _context.next = 40;
                            break;
                        }

                        if (!(ctx.method === 'OPTIONS')) {
                            _context.next = 39;
                            break;
                        }

                        ctx.set("Access-Control-Allow-Origin", "*");
                        ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
                        return _context.abrupt('return', ctx.body = 'ok');

                    case 39:
                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 404, '不存在的api'));

                    case 40:
                        if (!(interfaceData.length > 1)) {
                            _context.next = 42;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '存在多个api，请检查数据库'));

                    case 42:

                        interfaceData = interfaceData[0];
                        ctx.set("Access-Control-Allow-Origin", "*");

                        if (!(interfaceData.res_body_type === 'json')) {
                            _context.next = 53;
                            break;
                        }

                        _context.prev = 45;
                        res = _mockjs2.default.mock(_yapi2.default.commons.json_parse(interfaceData.res_body));
                        return _context.abrupt('return', ctx.body = res);

                    case 50:
                        _context.prev = 50;
                        _context.t1 = _context['catch'](45);
                        return _context.abrupt('return', ctx.body = {
                            errcode: 400,
                            errmsg: 'mock json数据格式有误',
                            data: interfaceData.res_body
                        });

                    case 53:
                        return _context.abrupt('return', ctx.body = interfaceData.res_body);

                    case 56:
                        _context.prev = 56;
                        _context.t2 = _context['catch'](30);
                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 409, _context.t2.message));

                    case 59:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[17, 23], [30, 56], [45, 50]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();