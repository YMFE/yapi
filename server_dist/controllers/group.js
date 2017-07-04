'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _group = require('../models/group.js');

var _group2 = _interopRequireDefault(_group);

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

                            if (params.group_name) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'Group不能为空'));

                        case 3:
                            _context.next = 5;
                            return _group2.default.checkRepeat(params.group_name);

                        case 5:
                            checkRepeat = _context.sent;

                            // if(checkRepeat > 0){
                            //     return ctx.body =  yapi.commons.resReturn(null, 401, 'group已存在');
                            // }
                            data = {
                                group_name: params.group_name,
                                group_desc: params.group_desc,
                                uid: '0',
                                add_time: _yapi2.default.commons.time(),
                                up_time: _yapi2.default.commons.time()
                            };
                            _context.prev = 7;
                            _context.next = 10;
                            return _group2.default.save(data);

                        case 10:
                            result = _context.sent;

                            result = _yapi2.default.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid']);
                            ctx.body = _yapi2.default.commons.resReturn(result);
                            _context.next = 18;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](7);

                            ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                        case 18:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[7, 15]]);
        }))();
    },
    list: function list(ctx) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            console.log(_yapi2.default);
                            ctx.body = 1;

                        case 2:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    },
    del: function del(ctx) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },
    up: function up(ctx) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    }
};