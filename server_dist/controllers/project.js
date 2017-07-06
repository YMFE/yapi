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

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectController = function (_baseController) {
    (0, _inherits3.default)(projectController, _baseController);

    function projectController(ctx) {
        (0, _classCallCheck3.default)(this, projectController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (projectController.__proto__ || (0, _getPrototypeOf2.default)(projectController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_project2.default);
        return _this;
    }

    (0, _createClass3.default)(projectController, [{
        key: 'jungeProjectAuth',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
                var result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.getRole() === 'admin')) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return', true);

                            case 2:
                                if (id) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt('return', false);

                            case 4:
                                _context.next = 6;
                                return this.Model.get(params.id);

                            case 6:
                                result = _context.sent;

                                if (!(result.uid === this.getUid())) {
                                    _context.next = 9;
                                    break;
                                }

                                return _context.abrupt('return', true);

                            case 9:
                                return _context.abrupt('return', false);

                            case 10:
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
                var result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.getRole() === 'admin')) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt('return', true);

                            case 2:
                                if (!(!id || !member_uid)) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt('return', false);

                            case 4:
                                _context2.next = 6;
                                return this.Model.checkMemberRepeat(params.id, member_uid);

                            case 6:
                                result = _context2.sent;

                                if (!(result > 0)) {
                                    _context2.next = 9;
                                    break;
                                }

                                return _context2.abrupt('return', true);

                            case 9:
                                return _context2.abrupt('return', false);

                            case 10:
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
    }, {
        key: 'add',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var params, checkRepeat, checkRepeatDomain, data, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.group_id) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组id不能为空'));

                            case 3:
                                if (params.name) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目名不能为空'));

                            case 5:
                                _context3.next = 7;
                                return this.Model.checkNameRepeat(params.name);

                            case 7:
                                checkRepeat = _context3.sent;

                                if (!(checkRepeat > 0)) {
                                    _context3.next = 10;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的项目名'));

                            case 10:
                                if (params.basepath) {
                                    _context3.next = 12;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目basepath不能为空'));

                            case 12:
                                if (params.prd_host) {
                                    _context3.next = 14;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目domain不能为空'));

                            case 14:
                                _context3.next = 16;
                                return this.Model.checkDomainRepeat(params.prd_host, params.basepath);

                            case 16:
                                checkRepeatDomain = _context3.sent;

                                if (!(checkRepeatDomain > 0)) {
                                    _context3.next = 19;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在domain和basepath'));

                            case 19:
                                data = {
                                    name: params.name,
                                    desc: params.desc,
                                    prd_host: params.prd_host,
                                    basepath: params.basepath,
                                    members: [this.getUid()],
                                    uid: this.getUid(),
                                    group_id: params.group_id,
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context3.prev = 20;
                                _context3.next = 23;
                                return this.Model.save(data);

                            case 23:
                                result = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 30;
                                break;

                            case 27:
                                _context3.prev = 27;
                                _context3.t0 = _context3['catch'](20);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message);

                            case 30:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[20, 27]]);
            }));

            function add(_x4) {
                return _ref3.apply(this, arguments);
            }

            return add;
        }()
    }, {
        key: 'addMember',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var params, check, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.member_uid) {
                                    _context4.next = 3;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员uid不能为空'));

                            case 3:
                                if (params.id) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context4.next = 7;
                                return this.Model.checkMemberRepeat(params.id, params.member_uid);

                            case 7:
                                check = _context4.sent;

                                if (!(check > 0)) {
                                    _context4.next = 10;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员已存在'));

                            case 10:
                                _context4.prev = 10;
                                _context4.next = 13;
                                return this.Model.addMember(params.id, params.member_uid);

                            case 13:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 20;
                                break;

                            case 17:
                                _context4.prev = 17;
                                _context4.t0 = _context4['catch'](10);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[10, 17]]);
            }));

            function addMember(_x5) {
                return _ref4.apply(this, arguments);
            }

            return addMember;
        }()
    }, {
        key: 'delMember',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var params, check, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.member_uid) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员uid不能为空'));

                            case 3:
                                if (params.id) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context5.next = 7;
                                return this.Model.checkMemberRepeat(params.id, params.member_uid);

                            case 7:
                                check = _context5.sent;

                                if (!(check === 0)) {
                                    _context5.next = 10;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员不存在'));

                            case 10:
                                _context5.prev = 10;
                                _context5.next = 13;
                                return this.Model.delMember(params.id, params.member_uid);

                            case 13:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 20;
                                break;

                            case 17:
                                _context5.prev = 17;
                                _context5.t0 = _context5['catch'](10);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                            case 20:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[10, 17]]);
            }));

            function delMember(_x6) {
                return _ref5.apply(this, arguments);
            }

            return delMember;
        }()
    }, {
        key: 'get',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var params, result;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                params = ctx.request.query;

                                if (params.id) {
                                    _context6.next = 3;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context6.prev = 3;
                                _context6.next = 6;
                                return this.Model.get(params.id);

                            case 6:
                                result = _context6.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 13;
                                break;

                            case 10:
                                _context6.prev = 10;
                                _context6.t0 = _context6['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 13:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[3, 10]]);
            }));

            function get(_x7) {
                return _ref6.apply(this, arguments);
            }

            return get;
        }()
    }, {
        key: 'list',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var result;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (ctx.request.query.group_id) {
                                    _context7.next = 2;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组id不能为空'));

                            case 2:
                                _context7.prev = 2;
                                _context7.next = 5;
                                return this.Model.list();

                            case 5:
                                result = _context7.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 12;
                                break;

                            case 9:
                                _context7.prev = 9;
                                _context7.t0 = _context7['catch'](2);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 12:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[2, 9]]);
            }));

            function list(_x8) {
                return _ref7.apply(this, arguments);
            }

            return list;
        }()
    }, {
        key: 'del',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var id, result;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                id = ctx.request.body.id;

                                if (!(this.jungeProjectAuth(id) !== true)) {
                                    _context8.next = 4;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 4:
                                _context8.next = 6;
                                return this.Model.del(id);

                            case 6:
                                result = _context8.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context8.next = 13;
                                break;

                            case 10:
                                _context8.prev = 10;
                                _context8.t0 = _context8['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 13:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 10]]);
            }));

            function del(_x9) {
                return _ref8.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'up',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx) {
                var id, data, result;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                id = ctx.request.body.id;

                                if (!(this.jungeMemberAuth(id, this.getUid()) !== true)) {
                                    _context9.next = 4;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 4:
                                data = {};

                                ctx.request.body.project_name && (data.project_name = ctx.request.body.project_name);
                                ctx.request.body.project_desc && (data.project_desc = ctx.request.body.project_desc);
                                if ((0, _keys2.default)(data).length === 0) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 404, '分组名和分组描述都为空');
                                }
                                _context9.next = 10;
                                return this.Model.up(id, data);

                            case 10:
                                result = _context9.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context9.next = 17;
                                break;

                            case 14:
                                _context9.prev = 14;
                                _context9.t0 = _context9['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 17:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 14]]);
            }));

            function up(_x10) {
                return _ref9.apply(this, arguments);
            }

            return up;
        }()
    }]);
    return projectController;
}(_base2.default);

module.exports = projectController;