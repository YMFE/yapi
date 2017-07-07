'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sha1 = require('sha1');

var userController = function (_baseController) {
    (0, _inherits3.default)(userController, _baseController);

    function userController(ctx) {
        (0, _classCallCheck3.default)(this, userController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (userController.__proto__ || (0, _getPrototypeOf2.default)(userController)).call(this, ctx));

        console.log('constructor...');
        return _this;
    }

    (0, _createClass3.default)(userController, [{
        key: 'login',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var userInst, username, password, user, id, result, checkRepeat;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //登录
                                userInst = _yapi2.default.getInst(_user2.default); //创建user实体

                                username = ctx.request.body.username;
                                password = sha1(ctx.request.body.password);
                                _context.next = 5;
                                return userInst.findByName(username);

                            case 5:
                                user = _context.sent;
                                id = user.id;
                                _context.next = 9;
                                return userInst.findById(id);

                            case 9:
                                result = _context.sent;

                                if (username) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                            case 12:
                                if (password) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 14:
                                _context.next = 16;
                                return userInst.checkRepeat(username);

                            case 16:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat == 0)) {
                                    _context.next = 21;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 404, '该用户不存在'));

                            case 21:
                                if (!(result.password === password)) {
                                    _context.next = 25;
                                    break;
                                }

                                //用户名存在，判断密码是否正确，正确则可以登录
                                console.log('密码一致'); //是不是还需要把用户名密码一些东西写到session
                                // setCookie('token', sha1(username+password));
                                // userInst.update({_id, result._id}, {token: sha1(username+password)})
                                // return ctx.body = {username: ''}
                                _context.next = 26;
                                break;

                            case 25:
                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码错误'));

                            case 26:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function login(_x) {
                return _ref.apply(this, arguments);
            }

            return login;
        }()
    }, {
        key: 'reg',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var userInst, params, checkRepeat, data, user;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //注册
                                userInst = _yapi2.default.getInst(_user2.default);
                                params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码

                                if (params.username) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                            case 4:
                                if (params.password) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 6:
                                if (params.email) {
                                    _context2.next = 8;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '邮箱不能为空'));

                            case 8:
                                _context2.next = 10;
                                return userInst.checkRepeat(params.username);

                            case 10:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat > 0)) {
                                    _context2.next = 13;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该用户名已经注册'));

                            case 13:
                                _context2.next = 15;
                                return userInst.checkRepeat(params.email);

                            case 15:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat > 0)) {
                                    _context2.next = 18;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该邮箱已经注册'));

                            case 18:
                                data = {
                                    username: params.username,
                                    password: sha1(params.password), //加密
                                    email: params.email,
                                    role: params.role,
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context2.prev = 19;
                                _context2.next = 22;
                                return userInst.save(data);

                            case 22:
                                user = _context2.sent;

                                user = _yapi2.default.commons.fieldSelect(user, ['id', 'username', 'password', 'email', 'role']);
                                ctx.body = _yapi2.default.commons.resReturn(user);
                                _context2.next = 30;
                                break;

                            case 27:
                                _context2.prev = 27;
                                _context2.t0 = _context2['catch'](19);

                                ctx.body = _yapi2.default.commons.resReturn(null, 401, _context2.t0.message);

                            case 30:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[19, 27]]);
            }));

            function reg(_x2) {
                return _ref2.apply(this, arguments);
            }

            return reg;
        }()
    }, {
        key: 'list',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var userInst, user;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                //获取用户列表并分页 
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context3.prev = 1;
                                _context3.next = 4;
                                return userInst.list();

                            case 4:
                                user = _context3.sent;
                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(user));

                            case 8:
                                _context3.prev = 8;
                                _context3.t0 = _context3['catch'](1);
                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message));

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 8]]);
            }));

            function list(_x3) {
                return _ref3.apply(this, arguments);
            }

            return list;
        }()
    }, {
        key: 'findById',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = ctx.request.body.id;
                                _context4.next = 5;
                                return userInst.findById(id);

                            case 5:
                                result = _context4.sent;
                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(result));

                            case 9:
                                _context4.prev = 9;
                                _context4.t0 = _context4['catch'](0);
                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message));

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 9]]);
            }));

            function findById(_x4) {
                return _ref4.apply(this, arguments);
            }

            return findById;
        }()
    }, {
        key: 'del',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = ctx.request.body.id;
                                _context5.next = 5;
                                return userInst.del(id);

                            case 5:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 12;
                                break;

                            case 9:
                                _context5.prev = 9;
                                _context5.t0 = _context5['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                            case 12:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 9]]);
            }));

            function del(_x5) {
                return _ref5.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'update',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var userInst, id, data, result;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = ctx.request.body.id;
                                data = {};

                                ctx.request.body.username && (data.username = ctx.request.body.username);
                                ctx.request.body.password && (data.password = ctx.request.body.password);
                                ctx.request.body.email && (data.email = ctx.request.body.email);
                                ctx.request.body.role && (data.role = ctx.request.body.role);
                                if ((0, _keys2.default)(data).length === 0) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 404, '用户名、密码、Email、role都为空');
                                }
                                _context6.next = 11;
                                return userInst.update(id, data);

                            case 11:
                                result = _context6.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 18;
                                break;

                            case 15:
                                _context6.prev = 15;
                                _context6.t0 = _context6['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 18:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 15]]);
            }));

            function update(_x6) {
                return _ref6.apply(this, arguments);
            }

            return update;
        }()
    }]);
    return userController;
}(_base2.default);

module.exports = userController;