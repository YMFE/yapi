'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _request2 = require('request');

var _request3 = _interopRequireDefault(_request2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');

var userController = function (_baseController) {
    (0, _inherits3.default)(userController, _baseController);

    function userController(ctx) {
        (0, _classCallCheck3.default)(this, userController);
        return (0, _possibleConstructorReturn3.default)(this, (userController.__proto__ || (0, _getPrototypeOf2.default)(userController)).call(this, ctx));
    }
    /**
     * 用户登录接口
     * @interface /user/login
     * @method POST
     * @category user
     * @foldnumber 10
     * @param {String} email email名称，不能为空
     * @param  {String} password 密码，不能为空
     * @returns {Object} 
     * @example ./api/user/login.json
     */


    (0, _createClass3.default)(userController, [{
        key: 'login',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var userInst, email, password, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //登录
                                userInst = _yapi2.default.getInst(_user2.default); //创建user实体

                                email = ctx.request.body.email;
                                password = ctx.request.body.password;

                                if (email) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'email不能为空'));

                            case 5:
                                if (password) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 7:
                                _context.next = 9;
                                return userInst.findByEmail(email);

                            case 9:
                                result = _context.sent;

                                if (result) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 404, '该用户不存在'));

                            case 14:
                                if (!(_yapi2.default.commons.generatePassword(password, result.passsalt) === result.password)) {
                                    _context.next = 19;
                                    break;
                                }

                                this.setLoginCookie(result._id, result.passsalt);

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn({
                                    username: result.username,
                                    uid: result._id,
                                    email: result.email,
                                    add_time: result.add_time,
                                    up_time: result.up_time

                                }, 0, 'logout success...'));

                            case 19:
                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '密码错误'));

                            case 20:
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

        /**
         * 退出登录接口
         * @interface /user/logout
         * @method GET
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example ./api/user/logout.json
         */

    }, {
        key: 'logout',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                ctx.cookies.set('_yapi_token', null);
                                ctx.cookies.set('_yapi_uid', null);
                                ctx.body = _yapi2.default.commons.resReturn('ok');

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function logout(_x2) {
                return _ref2.apply(this, arguments);
            }

            return logout;
        }()

        /**
         *  第三方登录需要提供一个request方法和 token字段，暂时只支持qunar第三方
         * @return {email: String, username: String}
         */

    }, {
        key: 'thirdQunarLogin',
        value: function thirdQunarLogin() {
            return {
                request: function request(token) {
                    return new _promise2.default(function (resolve, reject) {
                        (0, _request3.default)('http://qsso.corp.qunar.com/api/verifytoken.php?token=' + token, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var result = JSON.parse(body);
                                if (result && result.ret === true) {
                                    var ret = {
                                        email: result.userId + '@qunar.com',
                                        username: result.data.userInfo.name
                                    };
                                    resolve(ret);
                                } else {
                                    reject(result);
                                }
                            }
                            reject(error);
                        });
                    });
                },
                tokenField: 'token'
            };
        }
    }, {
        key: 'loginByToken',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var config, token, ret, login;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                config = this.thirdQunarLogin();
                                token = ctx.request.body[config.tokenField] || ctx.request.query[config.tokenField];
                                _context3.prev = 2;
                                _context3.next = 5;
                                return config.request(token);

                            case 5:
                                ret = _context3.sent;
                                _context3.next = 8;
                                return this.handleThirdLogin(ret.email, ret.username);

                            case 8:
                                login = _context3.sent;

                                if (login === true) {
                                    _yapi2.default.commons.log('login success');
                                    ctx.redirect('/');
                                }
                                _context3.next = 16;
                                break;

                            case 12:
                                _context3.prev = 12;
                                _context3.t0 = _context3['catch'](2);

                                _yapi2.default.commons.log(_context3.t0.message, 'error');
                                ctx.redirect('/');

                            case 16:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[2, 12]]);
            }));

            function loginByToken(_x3) {
                return _ref3.apply(this, arguments);
            }

            return loginByToken;
        }()
    }, {
        key: 'handleThirdLogin',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(email, username) {
                var user, data, passsalt, userInst;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                user = void 0, data = void 0, passsalt = void 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context4.prev = 2;
                                _context4.next = 5;
                                return userInst.findByEmail(email);

                            case 5:
                                user = _context4.sent;

                                if (!(!user || !user._id)) {
                                    _context4.next = 12;
                                    break;
                                }

                                passsalt = _yapi2.default.commons.randStr();
                                data = {
                                    username: username,
                                    password: _yapi2.default.commons.generatePassword(passsalt, passsalt),
                                    email: email,
                                    passsalt: passsalt,
                                    role: 'member',
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context4.next = 11;
                                return userInst.save(data);

                            case 11:
                                user = _context4.sent;

                            case 12:

                                this.setLoginCookie(user._id, user.passsalt);
                                return _context4.abrupt('return', true);

                            case 16:
                                _context4.prev = 16;
                                _context4.t0 = _context4['catch'](2);

                                console.error(_context4.t0.message);
                                return _context4.abrupt('return', false);

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 16]]);
            }));

            function handleThirdLogin(_x4, _x5) {
                return _ref4.apply(this, arguments);
            }

            return handleThirdLogin;
        }()

        /**
         * 修改用户密码
         * @interface /user/change_password
         * @method POST
         * @category user
         * @param {Number} uid 用户ID
         * @param {Number} [old_password] 旧密码, 非admin用户必须传
         * @param {Number} password 新密码
         * @return {Object}
         * @example ./api/user/change_password
         */

    }, {
        key: 'changePassword',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var params, userInst, user, passsalt, data, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                params = ctx.request.body;
                                userInst = _yapi2.default.getInst(_user2.default);

                                if (!(this.getRole() !== 'admin' && params.uid != this.getUid())) {
                                    _context5.next = 5;
                                    break;
                                }

                                console.log(this.getRole(), this.getUid());
                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, '没有权限'));

                            case 5:
                                if (!(this.getRole() !== 'admin')) {
                                    _context5.next = 13;
                                    break;
                                }

                                if (params.old_password) {
                                    _context5.next = 8;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '旧密码不能为空'));

                            case 8:
                                _context5.next = 10;
                                return userInst.findById(params.uid);

                            case 10:
                                user = _context5.sent;

                                if (!(_yapi2.default.commons.generatePassword(params.old_password, user.passsalt) !== user.password)) {
                                    _context5.next = 13;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, '旧密码错误'));

                            case 13:
                                passsalt = _yapi2.default.commons.randStr();
                                data = {
                                    up_time: _yapi2.default.commons.time(),
                                    password: _yapi2.default.commons.generatePassword(params.password, passsalt),
                                    passsalt: passsalt
                                };
                                _context5.prev = 15;
                                _context5.next = 18;
                                return userInst.update(params.uid, data);

                            case 18:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 25;
                                break;

                            case 22:
                                _context5.prev = 22;
                                _context5.t0 = _context5['catch'](15);

                                ctx.body = _yapi2.default.commons.resReturn(null, 401, _context5.t0.message);

                            case 25:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[15, 22]]);
            }));

            function changePassword(_x6) {
                return _ref5.apply(this, arguments);
            }

            return changePassword;
        }()
    }, {
        key: 'forgetPassword',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function forgetPassword(_x7) {
                return _ref6.apply(this, arguments);
            }

            return forgetPassword;
        }()
    }, {
        key: 'resetPassword',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function resetPassword(_x8) {
                return _ref7.apply(this, arguments);
            }

            return resetPassword;
        }()
    }, {
        key: 'setLoginCookie',
        value: function setLoginCookie(uid, passsalt) {
            var token = jwt.sign({ uid: uid }, passsalt, { expiresIn: '7 days' });
            this.ctx.cookies.set('_yapi_token', token, {
                expires: _yapi2.default.commons.expireDate(7),
                httpOnly: true
            });
            this.ctx.cookies.set('_yapi_uid', uid, {
                expires: _yapi2.default.commons.expireDate(7),
                httpOnly: true
            });
        }

        /**
         * 用户注册接口
         * @interface /user/reg
         * @method POST
         * @category user
         * @foldnumber 10
         * @param {String} email email名称，不能为空
         * @param  {String} password 密码，不能为空
         * @param {String} [username] 用户名
         * @returns {Object} 
         * @example ./api/user/login.json
         */

    }, {
        key: 'reg',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var userInst, params, checkRepeat, passsalt, data, user;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                //注册
                                userInst = _yapi2.default.getInst(_user2.default);
                                params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码

                                if (params.email) {
                                    _context8.next = 4;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '邮箱不能为空'));

                            case 4:
                                if (params.password) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 6:
                                _context8.next = 8;
                                return userInst.checkRepeat(params.email);

                            case 8:
                                checkRepeat = _context8.sent;

                                if (!(checkRepeat > 0)) {
                                    _context8.next = 11;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该email已经注册'));

                            case 11:
                                passsalt = _yapi2.default.commons.randStr();
                                data = {
                                    username: params.username,
                                    password: _yapi2.default.commons.generatePassword(params.password, passsalt), //加密
                                    email: params.email,
                                    passsalt: passsalt,
                                    role: 'member',
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };

                                if (!data.username) {
                                    data.username = data.email.substr(0, data.email.indexOf('@'));
                                }
                                _context8.prev = 14;
                                _context8.next = 17;
                                return userInst.save(data);

                            case 17:
                                user = _context8.sent;

                                this.setLoginCookie(user._id, user.passsalt);

                                ctx.body = _yapi2.default.commons.resReturn({
                                    uid: user._id,
                                    email: user.email,
                                    username: user.username,
                                    add_time: user.add_time,
                                    up_time: user.up_time,
                                    role: 'member'
                                });
                                _yapi2.default.commons.sendMail({
                                    to: params.email,
                                    contents: '\u6B22\u8FCE\u6CE8\u518C\uFF0C\u60A8\u7684\u8D26\u53F7 ' + params.email + ' \u5DF2\u7ECF\u6CE8\u518C\u6210\u529F'
                                });
                                _context8.next = 26;
                                break;

                            case 23:
                                _context8.prev = 23;
                                _context8.t0 = _context8['catch'](14);

                                ctx.body = _yapi2.default.commons.resReturn(null, 401, _context8.t0.message);

                            case 26:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[14, 23]]);
            }));

            function reg(_x9) {
                return _ref8.apply(this, arguments);
            }

            return reg;
        }()

        /**
         * 获取用户列表
         * @interface /user/list
         * @method GET
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'list',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx) {
                var userInst, user;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!(this.getRole() !== 'admin')) {
                                    _context9.next = 2;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, '没有权限'));

                            case 2:
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context9.prev = 3;
                                _context9.next = 6;
                                return userInst.list();

                            case 6:
                                user = _context9.sent;
                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(user));

                            case 10:
                                _context9.prev = 10;
                                _context9.t0 = _context9['catch'](3);
                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, _context9.t0.message));

                            case 13:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[3, 10]]);
            }));

            function list(_x10) {
                return _ref9.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 获取用户个人信息
         * @interface /user/find
         * @method GET
         * @param id 用户uid
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'findById',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = ctx.request.body.id;
                                _context10.next = 5;
                                return userInst.findById(id);

                            case 5:
                                result = _context10.sent;
                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(result));

                            case 9:
                                _context10.prev = 9;
                                _context10.t0 = _context10['catch'](0);
                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, _context10.t0.message));

                            case 12:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 9]]);
            }));

            function findById(_x11) {
                return _ref10.apply(this, arguments);
            }

            return findById;
        }()

        /**
         * 删除用户,只有admin用户才有此权限
         * @interface /user/del
         * @method POST
         * @param id 用户uid
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'del',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.prev = 0;

                                if (!(this.getRole() !== 'admin')) {
                                    _context11.next = 3;
                                    break;
                                }

                                return _context11.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, 'Without permission.'));

                            case 3:
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = ctx.request.body.id;
                                _context11.next = 7;
                                return userInst.del(id);

                            case 7:
                                result = _context11.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context11.next = 14;
                                break;

                            case 11:
                                _context11.prev = 11;
                                _context11.t0 = _context11['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context11.t0.message);

                            case 14:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 11]]);
            }));

            function del(_x12) {
                return _ref11.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 更新用户个人信息
         * @interface /user/update
         * @method POST
         * @param username String
         * @param email String
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'update',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(ctx) {
                var userInst, id, data, checkRepeat, result;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.prev = 0;
                                userInst = _yapi2.default.getInst(_user2.default);
                                id = this.getUid();
                                data = {
                                    up_time: _yapi2.default.commons.time()
                                };

                                ctx.request.body.username && (data.username = ctx.request.body.username);
                                ctx.request.body.email && (data.email = ctx.request.body.email);

                                if (!data.email) {
                                    _context12.next = 12;
                                    break;
                                }

                                _context12.next = 9;
                                return userInst.checkRepeat(data.email);

                            case 9:
                                checkRepeat = _context12.sent;

                                if (!(checkRepeat > 0)) {
                                    _context12.next = 12;
                                    break;
                                }

                                return _context12.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该email已经注册'));

                            case 12:
                                _context12.next = 14;
                                return userInst.update(id, data);

                            case 14:
                                result = _context12.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context12.next = 21;
                                break;

                            case 18:
                                _context12.prev = 18;
                                _context12.t0 = _context12['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context12.t0.message);

                            case 21:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[0, 18]]);
            }));

            function update(_x13) {
                return _ref12.apply(this, arguments);
            }

            return update;
        }()
    }]);
    return userController;
}(_base2.default);

module.exports = userController;