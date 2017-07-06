'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    add: function add(ctx) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
            var params, checkRepeat, data, result;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            params = ctx.request.body;

                            if (params.project_name) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '组名不能为空'));

                        case 3:
                            _context.next = 5;
                            return _project2.default.checkRepeat(params.project_name);

                        case 5:
                            checkRepeat = _context.sent;

                            if (!(checkRepeat > 0)) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '组名已存在'));

                        case 8:
                            data = {
                                project_name: params.project_name,
                                project_desc: params.project_desc,
                                uid: '0',
                                add_time: _yapi2.default.commons.time(),
                                up_time: _yapi2.default.commons.time()
                            };
                            _context.prev = 9;
                            _context.next = 12;
                            return _project2.default.save(data);

                        case 12:
                            result = _context.sent;

                            result = _yapi2.default.commons.fieldSelect(result, ['_id', 'project_name', 'project_desc', 'uid']);
                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context.next = 20;
                            break;

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](9);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[9, 17]]);
        }))();
    },
    list: function list(ctx) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            var result;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return _project2.default.list();

                        case 3:
                            result = _context2.sent;

                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context2.next = 10;
                            break;

                        case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2['catch'](0);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                        case 10:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 7]]);
        }))();
    },
    del: function del(ctx) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
            var id, result;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            id = ctx.request.body.id;
                            _context3.next = 4;
                            return _project2.default.del(id);

                        case 4:
                            result = _context3.sent;

                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context3.next = 11;
                            break;

                        case 8:
                            _context3.prev = 8;
                            _context3.t0 = _context3['catch'](0);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                        case 11:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 8]]);
        }))();
    },
    up: function up(ctx) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
            var id, data, result;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            id = ctx.request.body.id;
                            data = {};

                            ctx.request.body.project_name && (data.project_name = ctx.request.body.project_name);
                            ctx.request.body.project_desc && (data.project_desc = ctx.request.body.project_desc);
                            if ((0, _keys2.default)(data).length === 0) {
                                ctx.body = _yapi2.default.commons.resReturn(null, 404, '分组名和分组描述都为空');
                            }
                            _context4.next = 8;
                            return _project2.default.up(id, data);

                        case 8:
                            result = _context4.sent;

                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context4.next = 15;
                            break;

                        case 12:
                            _context4.prev = 12;
                            _context4.t0 = _context4['catch'](0);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                        case 15:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 12]]);
        }))();
    }
};