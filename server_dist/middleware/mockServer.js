'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _project2 = require('../models/project.js');

var _project3 = _interopRequireDefault(_project2);

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
        var hostname, config, projectInst, projects, matchProject, maxBasepath, i, l, _project, project, interfaceData, interfaceInst;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _yapi2.default.commons.log('Server Recevie Request...');

                        hostname = ctx.hostname;
                        config = _yapi2.default.WEBCONFIG;

                        if (!(ctx.hostname === config.webhost)) {
                            _context.next = 8;
                            break;
                        }

                        if (!next) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 7;
                        return next();

                    case 7:
                        return _context.abrupt('return', true);

                    case 8:

                        _yapi2.default.commons.log('MockServer Running...');
                        projectInst = _yapi2.default.getInst(_project3.default), projects = void 0;
                        _context.prev = 10;
                        _context.next = 13;
                        return projectInst.getByDomain(hostname);

                    case 13:
                        projects = _context.sent;
                        _context.next = 19;
                        break;

                    case 16:
                        _context.prev = 16;
                        _context.t0 = _context['catch'](10);
                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 403, _context.t0.message));

                    case 19:
                        matchProject = [], maxBasepath = 0;


                        for (i = 0, l = projects.length; i < l; i++) {
                            _project = projects[i];


                            if (ctx.path && ctx.path.indexOf(_project.basepath) === 0) {
                                matchProject.push(_project);

                                if (_project.basepath.length > maxBasepath) {
                                    maxBasepath = _project.basepath.length;
                                    matchProject = _project;
                                }
                            }
                        }

                        if (!(matchProject === false)) {
                            _context.next = 23;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '不存在的domain'));

                    case 23:
                        project = matchProject, interfaceData = void 0;
                        interfaceInst = _yapi2.default.getInst(_interface2.default);
                        _context.prev = 25;
                        _context.next = 28;
                        return interfaceInst.getByPath(project._id, ctx.path.substr(project.basepath.length));

                    case 28:
                        interfaceData = _context.sent;

                        if (!(!interfaceData || interfaceData.length === 0)) {
                            _context.next = 31;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 404, '不存在的api'));

                    case 31:
                        if (!(interfaceData.length > 1)) {
                            _context.next = 33;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '存在多个api，请检查数据库'));

                    case 33:

                        interfaceData = interfaceData[0];

                        if (!(interfaceData.res_body_type === 'json')) {
                            _context.next = 36;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = _mockjs2.default.mock(_yapi2.default.commons.json_parse(interfaceData.res_body)));

                    case 36:
                        return _context.abrupt('return', ctx.body = interfaceData.res_body);

                    case 39:
                        _context.prev = 39;
                        _context.t1 = _context['catch'](25);
                        return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 409, _context.t1.message));

                    case 42:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[10, 16], [25, 39]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();