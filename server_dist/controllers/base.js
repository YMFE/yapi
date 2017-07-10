'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseController = function () {
    function baseController(ctx) {
        // console.log('baseControler init...')
        // let router;
        // if(router === 'user/reg' || 'router/login'){

        // }else{
        //     var a = this.getLoginStatus()
        //     if(a === false){
        //         return ctx.body = {};

        //     }
        // }
        // this.auth = false;

        (0, _classCallCheck3.default)(this, baseController);
    }

    (0, _createClass3.default)(baseController, [{
        key: 'getUid',
        value: function getUid() {
            return 0;
        }
    }, {
        key: 'getLoginStatus',
        value: function getLoginStatus() {
            // let token = getCookie('_yapi_token');
            // let uid   = getCookie('_yapi_uid');
            // let usermodel

            // usermode.token === token
            // return true
            return true;
        }
    }, {
        key: 'getRole',
        value: function getRole() {
            return 'admin';
        }
    }, {
        key: 'jungeProjectAuth',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
                var model, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                model = _yapi2.default.getInst(_project2.default);

                                if (!(this.getRole() === 'admin')) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', true);

                            case 3:
                                if (id) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', false);

                            case 5:
                                _context.next = 7;
                                return model.get(id);

                            case 7:
                                result = _context.sent;

                                if (!(result.uid === this.getUid())) {
                                    _context.next = 10;
                                    break;
                                }

                                return _context.abrupt('return', true);

                            case 10:
                                return _context.abrupt('return', false);

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function jungeProjectAuth(_x) {
                return _ref.apply(this, arguments);
            }

            return jungeProjectAuth;
        }()
    }, {
        key: 'jungeMemberAuth',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(id, member_uid) {
                var model, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                model = _yapi2.default.getInst(_project2.default);

                                if (!(this.getRole() === 'admin')) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', true);

                            case 3:
                                if (!(!id || !member_uid)) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt('return', false);

                            case 5:
                                _context2.next = 7;
                                return model.checkMemberRepeat(id, member_uid);

                            case 7:
                                result = _context2.sent;

                                if (!(result > 0)) {
                                    _context2.next = 10;
                                    break;
                                }

                                return _context2.abrupt('return', true);

                            case 10:
                                return _context2.abrupt('return', false);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function jungeMemberAuth(_x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return jungeMemberAuth;
        }()
    }]);
    return baseController;
}();

module.exports = baseController;