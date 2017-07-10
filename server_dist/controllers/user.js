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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');
var sha1 = require('sha1');

var userController = function (_baseController) {
    (0, _inherits3.default)(userController, _baseController);

    function userController(ctx) {
        (0, _classCallCheck3.default)(this, userController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (userController.__proto__ || (0, _getPrototypeOf2.default)(userController)).call(this, ctx));

        console.log('constructor...');
        return _this;
    }
    /**
     * 添加项目分组
     * @interface /user/login
     * @method POST
     * @category user
     * @foldnumber 10
     * @param {String} username 用户名称，不能为空
     * @param  {String} password 密码，不能为空
     * @returns {Object} 
     * @example ./api/user/login.json
     */


    (0, _createClass3.default)(userController, [{
        key: 'login',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var userInst, username, password, result, token, checkRepeat;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //登录
                                userInst = _yapi2.default.getInst(_user2.default); //创建user实体

                                username = ctx.request.body.username;
                                password = ctx.request.body.password;
                                _context.next = 5;
                                return userInst.findByName(username);

                            case 5:
                                result = _context.sent;
                                token = jwt.sign(result._id, 'qunar', { expiresIn: 24 * 60 * 60 /* 1 days */ });

                                console.log(token);

                                if (username) {
                                    _context.next = 10;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                            case 10:
                                if (password) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 12:
                                _context.next = 14;
                                return userInst.checkRepeat(username);

                            case 14:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat == 0)) {
                                    _context.next = 19;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 404, '该用户不存在'));

                            case 19:
                                if (!(sha1(result.password) === password)) {
                                    _context.next = 24;
                                    break;
                                }

                                //用户名存在，判断密码是否正确，正确则可以登录
                                console.log('密码一致'); //是不是还需要把用户名密码一些东西写到session

                                //生成一个新的token,并存到数据库
                                // var token = jwt.sign(result._id,'qunar',{expiresIn: 24 * 60 * 60  /* 1 days */});
                                // console.log(token);
                                //result.token = token;
                                // setCookie('token', sha1(username+password));
                                // userInst.update({_id, result._id}, {token: sha1(username+password)})
                                // return ctx.body = {username: ''}
                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 200, 'ok'));

                            case 24:
                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码错误'));

                            case 25:
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
                var userInst, params, result, checkRepeat, data, user;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //注册
                                userInst = _yapi2.default.getInst(_user2.default);
                                params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码

                                _context2.next = 4;
                                return userInst.findByName(params.username);

                            case 4:
                                result = _context2.sent;

                                if (params.username) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户名不能为空'));

                            case 7:
                                if (params.password) {
                                    _context2.next = 9;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '密码不能为空'));

                            case 9:
                                if (params.email) {
                                    _context2.next = 11;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '邮箱不能为空'));

                            case 11:
                                _context2.next = 13;
                                return userInst.checkRepeat(params.username);

                            case 13:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat > 0)) {
                                    _context2.next = 16;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该用户名已经注册'));

                            case 16:
                                _context2.next = 18;
                                return userInst.checkRepeat(params.email);

                            case 18:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat > 0)) {
                                    _context2.next = 21;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '该邮箱已经注册'));

                            case 21:

                                //var token = jwt.sign(result._id,'qunar',{expiresIn: 24 * 60 * 60  /* 1 days */});
                                //console.log(111)
                                data = {
                                    username: params.username,
                                    password: sha1(params.password), //加密
                                    email: params.email,
                                    //token: token, //创建token并存入数据库
                                    role: params.role,
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context2.prev = 22;
                                _context2.next = 25;
                                return userInst.save(data);

                            case 25:
                                user = _context2.sent;

                                user = _yapi2.default.commons.fieldSelect(user, ['id', 'username', 'password', 'email']);
                                ctx.body = _yapi2.default.commons.resReturn(user);
                                _context2.next = 33;
                                break;

                            case 30:
                                _context2.prev = 30;
                                _context2.t0 = _context2['catch'](22);

                                ctx.body = _yapi2.default.commons.resReturn(null, 401, _context2.t0.message);

                            case 33:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[22, 30]]);
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