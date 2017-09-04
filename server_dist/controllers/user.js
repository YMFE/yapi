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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userModel = require('../models/user.js');
var yapi = require('../yapi.js');
var baseController = require('./base.js');
var _request = require('request');
var common = require('../utils/commons.js');

var interfaceModel = require('../models/interface.js');
var groupModel = require('../models/group.js');
var projectModel = require('../models/project.js');
var avatarModel = require('../models/avatar.js');

var jwt = require('jsonwebtoken');

var userController = function (_baseController) {
    (0, _inherits3.default)(userController, _baseController);

    function userController(ctx) {
        (0, _classCallCheck3.default)(this, userController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (userController.__proto__ || (0, _getPrototypeOf2.default)(userController)).call(this, ctx));

        _this.Model = yapi.getInst(userModel);
        return _this;
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
                                userInst = yapi.getInst(userModel); //创建user实体

                                email = ctx.request.body.email;
                                password = ctx.request.body.password;

                                if (email) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'email不能为空'));

                            case 5:
                                if (password) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空'));

                            case 7:
                                _context.next = 9;
                                return userInst.findByEmail(email);

                            case 9:
                                result = _context.sent;

                                if (result) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 404, '该用户不存在'));

                            case 14:
                                if (!(yapi.commons.generatePassword(password, result.passsalt) === result.password)) {
                                    _context.next = 19;
                                    break;
                                }

                                this.setLoginCookie(result._id, result.passsalt);

                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn({
                                    username: result.username,
                                    role: result.role,
                                    uid: result._id,
                                    email: result.email,
                                    add_time: result.add_time,
                                    up_time: result.up_time,
                                    server_ip: yapi.WEBCONFIG.server_ip,
                                    type: 'site'
                                }, 0, 'logout success...'));

                            case 19:
                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 405, '密码错误'));

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
                                ctx.body = yapi.commons.resReturn('ok');

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
                        _request('http://qsso.corp.qunar.com/api/verifytoken.php?token=' + token, function (error, response, body) {
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
                                    yapi.commons.log('login success');
                                    ctx.redirect('/group');
                                }
                                _context3.next = 16;
                                break;

                            case 12:
                                _context3.prev = 12;
                                _context3.t0 = _context3['catch'](2);

                                yapi.commons.log(_context3.t0.message, 'error');
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
                                userInst = yapi.getInst(userModel);
                                _context4.prev = 2;
                                _context4.next = 5;
                                return userInst.findByEmail(email);

                            case 5:
                                user = _context4.sent;

                                if (!(!user || !user._id)) {
                                    _context4.next = 13;
                                    break;
                                }

                                passsalt = yapi.commons.randStr();
                                data = {
                                    username: username,
                                    password: yapi.commons.generatePassword(passsalt, passsalt),
                                    email: email,
                                    passsalt: passsalt,
                                    role: 'member',
                                    add_time: yapi.commons.time(),
                                    up_time: yapi.commons.time(),
                                    type: 'third'
                                };
                                _context4.next = 11;
                                return userInst.save(data);

                            case 11:
                                user = _context4.sent;

                                yapi.commons.sendMail({
                                    to: email,
                                    contents: '<h3>\u4EB2\u7231\u7684\u7528\u6237\uFF1A</h3><p>\u60A8\u597D\uFF0C\u611F\u8C22\u4F7F\u7528YApi\u5E73\u53F0\uFF0C\u4F60\u7684\u90AE\u7BB1\u8D26\u53F7\u662F\uFF1A' + email + '</p>'
                                });

                            case 13:

                                this.setLoginCookie(user._id, user.passsalt);
                                return _context4.abrupt('return', true);

                            case 17:
                                _context4.prev = 17;
                                _context4.t0 = _context4['catch'](2);

                                console.error('third_login:', _context4.t0.message); // eslint-disable-line
                                return _context4.abrupt('return', false);

                            case 21:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 17]]);
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
         * @example ./api/user/change_password.json
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
                                userInst = yapi.getInst(userModel);

                                if (params.uid) {
                                    _context5.next = 4;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空'));

                            case 4:
                                if (params.password) {
                                    _context5.next = 6;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空'));

                            case 6:
                                if (!(this.getRole() !== 'admin' && params.uid != this.getUid())) {
                                    _context5.next = 8;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, '没有权限'));

                            case 8:
                                if (!(this.getRole() !== 'admin')) {
                                    _context5.next = 16;
                                    break;
                                }

                                if (params.old_password) {
                                    _context5.next = 11;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '旧密码不能为空'));

                            case 11:
                                _context5.next = 13;
                                return userInst.findById(params.uid);

                            case 13:
                                user = _context5.sent;

                                if (!(yapi.commons.generatePassword(params.old_password, user.passsalt) !== user.password)) {
                                    _context5.next = 16;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, '旧密码错误'));

                            case 16:
                                passsalt = yapi.commons.randStr();
                                data = {
                                    up_time: yapi.commons.time(),
                                    password: yapi.commons.generatePassword(params.password, passsalt),
                                    passsalt: passsalt
                                };
                                _context5.prev = 18;
                                _context5.next = 21;
                                return userInst.update(params.uid, data);

                            case 21:
                                result = _context5.sent;

                                ctx.body = yapi.commons.resReturn(result);
                                _context5.next = 28;
                                break;

                            case 25:
                                _context5.prev = 25;
                                _context5.t0 = _context5['catch'](18);

                                ctx.body = yapi.commons.resReturn(null, 401, _context5.t0.message);

                            case 28:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[18, 25]]);
            }));

            function changePassword(_x6) {
                return _ref5.apply(this, arguments);
            }

            return changePassword;
        }()
    }, {
        key: 'setLoginCookie',
        value: function setLoginCookie(uid, passsalt) {
            var token = jwt.sign({ uid: uid }, passsalt, { expiresIn: '7 days' });

            this.ctx.cookies.set('_yapi_token', token, {
                expires: yapi.commons.expireDate(7),
                httpOnly: true
            });
            this.ctx.cookies.set('_yapi_uid', uid, {
                expires: yapi.commons.expireDate(7),
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
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var userInst, params, checkRepeat, passsalt, data, user;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                //注册
                                userInst = yapi.getInst(userModel);
                                params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码

                                params = yapi.commons.handleParams(params, {
                                    username: 'string',
                                    password: 'string',
                                    email: 'string'
                                });

                                if (params.email) {
                                    _context6.next = 5;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '邮箱不能为空'));

                            case 5:
                                if (params.password) {
                                    _context6.next = 7;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空'));

                            case 7:
                                _context6.next = 9;
                                return userInst.checkRepeat(params.email);

                            case 9:
                                checkRepeat = _context6.sent;

                                if (!(checkRepeat > 0)) {
                                    _context6.next = 12;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = yapi.commons.resReturn(null, 401, '该email已经注册'));

                            case 12:
                                passsalt = yapi.commons.randStr();
                                data = {
                                    username: params.username,
                                    password: yapi.commons.generatePassword(params.password, passsalt), //加密
                                    email: params.email,
                                    passsalt: passsalt,
                                    role: 'member',
                                    add_time: yapi.commons.time(),
                                    up_time: yapi.commons.time(),
                                    type: "site"
                                };


                                if (!data.username) {
                                    data.username = data.email.substr(0, data.email.indexOf('@'));
                                }

                                _context6.prev = 15;
                                _context6.next = 18;
                                return userInst.save(data);

                            case 18:
                                user = _context6.sent;


                                this.setLoginCookie(user._id, user.passsalt);
                                ctx.body = yapi.commons.resReturn({
                                    uid: user._id,
                                    email: user.email,
                                    username: user.username,
                                    add_time: user.add_time,
                                    up_time: user.up_time,
                                    role: 'member',
                                    type: user.type
                                });
                                yapi.commons.sendMail({
                                    to: user.email,
                                    contents: '<h3>\u4EB2\u7231\u7684\u7528\u6237\uFF1A</h3><p>\u60A8\u597D\uFF0C\u611F\u8C22\u4F7F\u7528YApi,\u60A8\u7684\u8D26\u53F7 ' + params.email + ' \u5DF2\u7ECF\u6CE8\u518C\u6210\u529F</p>'
                                });
                                _context6.next = 27;
                                break;

                            case 24:
                                _context6.prev = 24;
                                _context6.t0 = _context6['catch'](15);

                                ctx.body = yapi.commons.resReturn(null, 401, _context6.t0.message);

                            case 27:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[15, 24]]);
            }));

            function reg(_x7) {
                return _ref6.apply(this, arguments);
            }

            return reg;
        }()

        /**
         * 获取用户列表
         * @interface /user/list
         * @method GET
         * @category user
         * @foldnumber 10
         * @param {Number} [page] 分页页码
         * @param {Number} [limit] 分页大小,默认为10条
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'list',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var page, limit, userInst, user, count;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10;
                                userInst = yapi.getInst(userModel);
                                _context7.prev = 2;
                                _context7.next = 5;
                                return userInst.listWithPaging(page, limit);

                            case 5:
                                user = _context7.sent;
                                _context7.next = 8;
                                return userInst.listCount();

                            case 8:
                                count = _context7.sent;
                                return _context7.abrupt('return', ctx.body = yapi.commons.resReturn({
                                    total: Math.ceil(count / limit),
                                    list: user
                                }));

                            case 12:
                                _context7.prev = 12;
                                _context7.t0 = _context7['catch'](2);
                                return _context7.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, _context7.t0.message));

                            case 15:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[2, 12]]);
            }));

            function list(_x8) {
                return _ref7.apply(this, arguments);
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
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                userInst = yapi.getInst(userModel);
                                id = ctx.request.query.id;

                                if (id) {
                                    _context8.next = 5;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空'));

                            case 5:
                                _context8.next = 7;
                                return userInst.findById(id);

                            case 7:
                                result = _context8.sent;

                                if (result) {
                                    _context8.next = 10;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, '不存在的用户'));

                            case 10:
                                return _context8.abrupt('return', ctx.body = yapi.commons.resReturn({
                                    uid: result._id,
                                    username: result.username,
                                    email: result.email,
                                    role: result.role,
                                    type: result.type,
                                    add_time: result.add_time,
                                    up_time: result.up_time
                                }));

                            case 13:
                                _context8.prev = 13;
                                _context8.t0 = _context8['catch'](0);
                                return _context8.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, _context8.t0.message));

                            case 16:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 13]]);
            }));

            function findById(_x9) {
                return _ref8.apply(this, arguments);
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
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx) {
                var userInst, id, result;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;

                                if (!(this.getRole() !== 'admin')) {
                                    _context9.next = 3;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = yapi.commons.resReturn(null, 402, 'Without permission.'));

                            case 3:
                                userInst = yapi.getInst(userModel);
                                id = ctx.request.body.id;

                                if (id) {
                                    _context9.next = 7;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空'));

                            case 7:
                                _context9.next = 9;
                                return userInst.del(id);

                            case 9:
                                result = _context9.sent;


                                ctx.body = yapi.commons.resReturn(result);
                                _context9.next = 16;
                                break;

                            case 13:
                                _context9.prev = 13;
                                _context9.t0 = _context9['catch'](0);

                                ctx.body = yapi.commons.resReturn(null, 402, _context9.t0.message);

                            case 16:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 13]]);
            }));

            function del(_x10) {
                return _ref9.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 更新用户个人信息
         * @interface /user/update
         * @method POST
         * @param uid  用户uid
         * @param [role] 用户角色,只有管理员有权限修改
         * @param [username] String
         * @param [email] String
         * @category user
         * @foldnumber 10
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'update',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(ctx) {
                var params, userInst, id, data, checkRepeat, result;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                params = ctx.request.body;


                                params = yapi.commons.handleParams(params, {
                                    username: 'string',
                                    email: 'string'
                                });

                                if (!(this.getRole() !== 'admin' && params.uid != this.getUid())) {
                                    _context10.next = 5;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = yapi.commons.resReturn(null, 401, '没有权限'));

                            case 5:
                                userInst = yapi.getInst(userModel);
                                id = params.uid;

                                if (id) {
                                    _context10.next = 9;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空'));

                            case 9:
                                data = {
                                    up_time: yapi.commons.time()
                                };


                                params.username && (data.username = params.username);
                                params.email && (data.email = params.email);

                                if (!data.email) {
                                    _context10.next = 18;
                                    break;
                                }

                                _context10.next = 15;
                                return userInst.checkRepeat(data.email);

                            case 15:
                                checkRepeat = _context10.sent;

                                if (!(checkRepeat > 0)) {
                                    _context10.next = 18;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = yapi.commons.resReturn(null, 401, '该email已经注册'));

                            case 18:
                                _context10.next = 20;
                                return userInst.update(id, data);

                            case 20:
                                result = _context10.sent;


                                ctx.body = yapi.commons.resReturn(result);
                                _context10.next = 27;
                                break;

                            case 24:
                                _context10.prev = 24;
                                _context10.t0 = _context10['catch'](0);

                                ctx.body = yapi.commons.resReturn(null, 402, _context10.t0.message);

                            case 27:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 24]]);
            }));

            function update(_x11) {
                return _ref10.apply(this, arguments);
            }

            return update;
        }()

        /**
         * 上传用户头像
         * @interface /user/upload_avatar
         * @method POST 
         * @param {*} basecode  base64编码，通过h5 api传给后端
         * @category user
         * @returns {Object} 
         * @example 
         */

    }, {
        key: 'uploadAvatar',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(ctx) {
                var basecode, pngPrefix, jpegPrefix, type, strLength, avatarInst, result;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.prev = 0;
                                basecode = ctx.request.body.basecode;

                                if (basecode) {
                                    _context11.next = 4;
                                    break;
                                }

                                return _context11.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, 'basecode不能为空'));

                            case 4:
                                pngPrefix = 'data:image/png;base64,';
                                jpegPrefix = 'data:image/jpeg;base64,';
                                type = void 0;

                                if (!(basecode.substr(0, pngPrefix.length) === pngPrefix)) {
                                    _context11.next = 12;
                                    break;
                                }

                                basecode = basecode.substr(pngPrefix.length);
                                type = 'image/png';
                                _context11.next = 18;
                                break;

                            case 12:
                                if (!(basecode.substr(0, jpegPrefix.length) === jpegPrefix)) {
                                    _context11.next = 17;
                                    break;
                                }

                                basecode = basecode.substr(jpegPrefix.length);
                                type = 'image/jpeg';
                                _context11.next = 18;
                                break;

                            case 17:
                                return _context11.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '仅支持jpeg和png格式的图片'));

                            case 18:
                                strLength = basecode.length;

                                if (!(parseInt(strLength - strLength / 8 * 2) > 200000)) {
                                    _context11.next = 21;
                                    break;
                                }

                                return _context11.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '图片大小不能超过200kb'));

                            case 21:
                                avatarInst = yapi.getInst(avatarModel);
                                _context11.next = 24;
                                return avatarInst.up(this.getUid(), basecode, type);

                            case 24:
                                result = _context11.sent;

                                ctx.body = yapi.commons.resReturn(result);

                                _context11.next = 31;
                                break;

                            case 28:
                                _context11.prev = 28;
                                _context11.t0 = _context11['catch'](0);

                                ctx.body = yapi.commons.resReturn(null, 401, _context11.t0.message);

                            case 31:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 28]]);
            }));

            function uploadAvatar(_x12) {
                return _ref11.apply(this, arguments);
            }

            return uploadAvatar;
        }()

        /**
        * 根据用户uid头像
        * @interface /user/avatar
        * @method GET 
        * @param {*} uid  
        * @category user
        * @returns {Object} 
        * @example 
        */

    }, {
        key: 'avatar',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(ctx) {
                var uid, avatarInst, data, dataBuffer, type;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.prev = 0;
                                uid = ctx.query.uid ? ctx.query.uid : this.getUid();
                                avatarInst = yapi.getInst(avatarModel);
                                _context12.next = 5;
                                return avatarInst.get(uid);

                            case 5:
                                data = _context12.sent;
                                dataBuffer = void 0, type = void 0;

                                if (!data || !data.basecode) {
                                    dataBuffer = yapi.fs.readFileSync(yapi.path.join(yapi.WEBROOT, 'static/image/avatar.png'));
                                    type = 'image/png';
                                } else {
                                    type = data.type;
                                    dataBuffer = new Buffer(data.basecode, 'base64');
                                }

                                ctx.set('Content-type', type);
                                ctx.body = dataBuffer;
                                _context12.next = 15;
                                break;

                            case 12:
                                _context12.prev = 12;
                                _context12.t0 = _context12['catch'](0);

                                ctx.body = 'error:' + _context12.t0.message;

                            case 15:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[0, 12]]);
            }));

            function avatar(_x13) {
                return _ref12.apply(this, arguments);
            }

            return avatar;
        }()

        /**
         * 模糊搜索用户名或者email
         * @interface /user/search
         * @method GET
         * @category user
         * @foldnumber 10
         * @param {String} q
         * @return {Object}
         * @example ./api/user/search.json
        */

    }, {
        key: 'search',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(ctx) {
                var q, queryList, rules, filteredRes;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                q = ctx.request.query.q;

                                if (q) {
                                    _context13.next = 3;
                                    break;
                                }

                                return _context13.abrupt('return', ctx.body = yapi.commons.resReturn(void 0, 400, 'No keyword.'));

                            case 3:
                                if (yapi.commons.validateSearchKeyword(q)) {
                                    _context13.next = 5;
                                    break;
                                }

                                return _context13.abrupt('return', ctx.body = yapi.commons.resReturn(void 0, 400, 'Bad query.'));

                            case 5:
                                _context13.next = 7;
                                return this.Model.search(q);

                            case 7:
                                queryList = _context13.sent;
                                rules = [{
                                    key: '_id',
                                    alias: 'uid'
                                }, 'username', 'email', 'role', {
                                    key: 'add_time',
                                    alias: 'addTime'
                                }, {
                                    key: 'up_time',
                                    alias: 'upTime'
                                }];
                                filteredRes = common.filterRes(queryList, rules);
                                return _context13.abrupt('return', ctx.body = yapi.commons.resReturn(filteredRes, 0, 'ok'));

                            case 11:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function search(_x14) {
                return _ref13.apply(this, arguments);
            }

            return search;
        }()

        /**
         * 根据路由id初始化项目数据
         * @interface /user/project
         * @method GET
         * @category user
         * @foldnumber 10
         * @param {String} type 可选group|interface|project
         * @param {Number} id   
         * @return {Object}
         * @example 
        */

    }, {
        key: 'project',
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(ctx) {
                var _ctx$request$query, id, type, result, interfaceInst, interfaceData, projectInst, projectData, ownerAuth, devAuth, groupInst, groupData, _ownerAuth, _devAuth;

                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _ctx$request$query = ctx.request.query, id = _ctx$request$query.id, type = _ctx$request$query.type;
                                result = {};
                                _context14.prev = 2;

                                if (!(type === 'interface')) {
                                    _context14.next = 11;
                                    break;
                                }

                                interfaceInst = yapi.getInst(interfaceModel);
                                _context14.next = 7;
                                return interfaceInst.get(id);

                            case 7:
                                interfaceData = _context14.sent;

                                result.interface = interfaceData;
                                type = 'project';
                                id = interfaceData.project_id;

                            case 11:
                                if (!(type === 'project')) {
                                    _context14.next = 31;
                                    break;
                                }

                                projectInst = yapi.getInst(projectModel);
                                _context14.next = 15;
                                return projectInst.get(id);

                            case 15:
                                projectData = _context14.sent;

                                result.project = projectData.toObject();
                                _context14.next = 19;
                                return this.checkAuth(id, 'project', 'danger');

                            case 19:
                                ownerAuth = _context14.sent;
                                devAuth = void 0;

                                if (!ownerAuth) {
                                    _context14.next = 25;
                                    break;
                                }

                                result.project.role = 'owner';
                                _context14.next = 29;
                                break;

                            case 25:
                                _context14.next = 27;
                                return this.checkAuth(id, 'project', 'site');

                            case 27:
                                devAuth = _context14.sent;

                                if (devAuth) {
                                    result.project.role = 'dev';
                                } else {
                                    result.project.role = 'member';
                                }

                            case 29:
                                type = 'group';
                                id = projectData.group_id;

                            case 31:
                                if (!(type === 'group')) {
                                    _context14.next = 49;
                                    break;
                                }

                                groupInst = yapi.getInst(groupModel);
                                _context14.next = 35;
                                return groupInst.get(id);

                            case 35:
                                groupData = _context14.sent;

                                result.group = groupData.toObject();
                                _context14.next = 39;
                                return this.checkAuth(id, 'group', 'danger');

                            case 39:
                                _ownerAuth = _context14.sent;
                                _devAuth = void 0;

                                if (!_ownerAuth) {
                                    _context14.next = 45;
                                    break;
                                }

                                result.group.role = 'owner';
                                _context14.next = 49;
                                break;

                            case 45:
                                _context14.next = 47;
                                return this.checkAuth(id, 'group', 'site');

                            case 47:
                                _devAuth = _context14.sent;

                                if (_devAuth) {
                                    result.group.role = 'dev';
                                } else {
                                    result.group.role = 'member';
                                }

                            case 49:
                                return _context14.abrupt('return', ctx.body = yapi.commons.resReturn(result));

                            case 52:
                                _context14.prev = 52;
                                _context14.t0 = _context14['catch'](2);
                                return _context14.abrupt('return', ctx.body = yapi.commons.resReturn(result, 422, _context14.t0.message));

                            case 55:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this, [[2, 52]]);
            }));

            function project(_x15) {
                return _ref14.apply(this, arguments);
            }

            return project;
        }()
    }]);
    return userController;
}(baseController);

module.exports = userController;