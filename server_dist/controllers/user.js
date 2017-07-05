'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    login: function login(ctx) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
            var params, checkRepeat, name;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            params = ctx.request.body;

                            if (params.user_name) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                        case 3:
                            if (params.user_pwd) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                        case 5:
                            _context.next = 7;
                            return _user2.default.checkRepeat(params.user_name);

                        case 7:
                            checkRepeat = _context.sent;

                            if (checkRepeat > 0) {
                                name = ctx.request.body.user_name;
                            }

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    add: function add(ctx) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            var params, checkRepeat, data, user;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            //增加一个用户，即注册
                            params = ctx.request.body; //获取请求的参数

                            if (params.user_name) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                        case 3:
                            _context2.next = 5;
                            return _user2.default.checkRepeat(params.user_name);

                        case 5:
                            checkRepeat = _context2.sent;

                            if (!(checkRepeat > 0)) {
                                _context2.next = 8;
                                break;
                            }

                            return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '用户已存在'));

                        case 8:
                            data = {
                                user_name: params.user_name,
                                user_pwd: params.user_pwd,
                                add_time: _yapi2.default.commons.time(),
                                up_time: _yapi2.default.commons.time()
                            };
                            _context2.prev = 9;
                            _context2.next = 12;
                            return _user2.default.save(data);

                        case 12:
                            user = _context2.sent;

                            user = _yapi2.default.commons.fieldSelect(user, ['id', 'user_name', 'user_pwd']);
                            ctx.body = _yapi2.default.commons.resReturn(user);
                            _context2.next = 20;
                            break;

                        case 17:
                            _context2.prev = 17;
                            _context2.t0 = _context2['catch'](9);

                            ctx.body = _yapi2.default.commons.resReturn(_context2.t0.message);

                        case 20:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[9, 17]]);
        }))();
    },
    list: function list(ctx) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
            var user;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return _user2.default.list();

                        case 3:
                            user = _context3.sent;
                            return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(user));

                        case 7:
                            _context3.prev = 7;
                            _context3.t0 = _context3['catch'](0);
                            return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message));

                        case 10:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 7]]);
        }))();
    },
    del: function del(ctx) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
            var name, result;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            name = ctx.request.body.user_name;
                            _context4.next = 4;
                            return _user2.default.del(name);

                        case 4:
                            result = _context4.sent;

                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context4.next = 11;
                            break;

                        case 8:
                            _context4.prev = 8;
                            _context4.t0 = _context4['catch'](0);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                        case 11:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 8]]);
        }))();
    },
    up: function up(ctx) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
            var id, data, result;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            id = ctx.request.body.id;
                            data = {};

                            ctx.request.body.user_name && (data.user_name = ctx.request.body.user_name);
                            ctx.request.body.user_pwd && (data.user_pwd = ctx.request.body.user_pwd);
                            if ((0, _keys2.default)(data).length === 0) {
                                ctx.body = _yapi2.default.commons.resReturn(null, 404, '用户名和用户描述为空');
                            }
                            _context5.next = 8;
                            return _user2.default.up(id, data);

                        case 8:
                            result = _context5.sent;

                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context5.next = 15;
                            break;

                        case 12:
                            _context5.prev = 12;
                            _context5.t0 = _context5['catch'](0);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                        case 15:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 12]]);
        }))();
    }
};