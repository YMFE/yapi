'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('../yapi.js');
var projectModel = require('../models/project.js');
var interfaceModel = require('../models/interface.js');
var mockExtra = require('../../common/mock-extra.js');
var _ = require('underscore');
var Mock = require('mockjs');

function matchApi(apiPath, apiRule) {
    var apiRules = apiRule.split("/");
    if (apiPaths.length !== apiRules.length) {
        return false;
    }
    for (var i = 0; i < apiRules.length; i++) {
        if (apiRules[i] && apiRules[i].indexOf(":") !== 0) {
            if (apiRules[i] !== apiPaths[i]) {
                return false;
            }
        }
    }
    return true;
}

module.exports = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
        var hostname, config, path, paths, projectId, projectInst, project, interfaceData, newData, newpath, interfaceInst, _newData, findInterface, res;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        hostname = ctx.hostname;
                        config = yapi.WEBCONFIG;
                        path = ctx.path;

                        if (!(path.indexOf('/mock/') !== 0)) {
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
                        paths = path.split("/");
                        projectId = paths[2];

                        paths.splice(0, 3);
                        path = "/" + paths.join("/");

                        if (projectId) {
                            _context.next = 14;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'projectId不能为空'));

                    case 14:

                        yapi.commons.log('MockServer Running...');
                        projectInst = yapi.getInst(projectModel), project = void 0;
                        _context.prev = 16;
                        _context.next = 19;
                        return projectInst.get(projectId);

                    case 19:
                        project = _context.sent;
                        _context.next = 25;
                        break;

                    case 22:
                        _context.prev = 22;
                        _context.t0 = _context['catch'](16);
                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 403, _context.t0.message));

                    case 25:
                        if (!(project === false)) {
                            _context.next = 27;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '不存在的项目'));

                    case 27:
                        interfaceData = void 0, newData = void 0, newpath = void 0;
                        interfaceInst = yapi.getInst(interfaceModel);
                        _context.prev = 29;

                        newpath = path.substr(project.basepath.length);
                        _context.next = 33;
                        return interfaceInst.getByPath(project._id, newpath, ctx.method);

                    case 33:
                        interfaceData = _context.sent;

                        if (!(!interfaceData || interfaceData.length === 0)) {
                            _context.next = 49;
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
                        _context.next = 41;
                        return interfaceInst.getVar(project._id, ctx.method);

                    case 41:
                        _newData = _context.sent;
                        findInterface = _.find(_newData, function (item) {
                            return matchApi(newpath, item.path);
                        });

                        if (findInterface) {
                            _context.next = 45;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 404, '不存在的api'));

                    case 45:
                        _context.next = 47;
                        return interfaceInst.get(findInterface._id);

                    case 47:
                        _context.t1 = _context.sent;
                        interfaceData = [_context.t1];

                    case 49:
                        if (!(interfaceData.length > 1)) {
                            _context.next = 51;
                            break;
                        }

                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 405, '存在多个api，请检查数据库'));

                    case 51:

                        interfaceData = interfaceData[0];
                        ctx.set("Access-Control-Allow-Origin", "*");

                        if (!(interfaceData.res_body_type === 'json')) {
                            _context.next = 63;
                            break;
                        }

                        _context.prev = 54;
                        res = mockExtra(yapi.commons.json_parse(interfaceData.res_body), {
                            query: ctx.request.query,
                            body: ctx.request.body
                        });
                        return _context.abrupt('return', ctx.body = Mock.mock(res));

                    case 59:
                        _context.prev = 59;
                        _context.t2 = _context['catch'](54);

                        yapi.commons.log(_context.t2, 'error');
                        return _context.abrupt('return', ctx.body = {
                            errcode: 400,
                            errmsg: 'mock json数据格式有误',
                            data: interfaceData.res_body
                        });

                    case 63:
                        return _context.abrupt('return', ctx.body = interfaceData.res_body);

                    case 66:
                        _context.prev = 66;
                        _context.t3 = _context['catch'](29);

                        console.error(_context.t3);
                        return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 409, _context.t3.message));

                    case 70:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[16, 22], [29, 66], [54, 59]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();