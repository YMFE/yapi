'use strict';

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

    /**
     * 添加项目分组
     * @interface /project/add
     * @method POST
     * @category project
     * @foldnumber 10
     * @param {String} name 项目名称，不能为空
     * @param {String} basepath 项目基本路径，不能为空
     * @param {String} prd_host 项目线上域名，不能为空。可通过配置的域名访问到mock数据
     * @param {Number} group_id 项目分组id，不能为空
     * @param  {String} [desc] 项目描述 
     * @returns {Object} 
     * @example ./api/project/add.json
     */


    (0, _createClass3.default)(projectController, [{
        key: 'add',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var params, checkRepeat, checkRepeatDomain, data, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.group_id) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组id不能为空'));

                            case 3:
                                if (params.name) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目名不能为空'));

                            case 5:
                                _context.next = 7;
                                return this.Model.checkNameRepeat(params.name);

                            case 7:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat > 0)) {
                                    _context.next = 10;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的项目名'));

                            case 10:
                                if (params.basepath) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目basepath不能为空'));

                            case 12:
                                if (params.prd_host) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目domain不能为空'));

                            case 14:
                                _context.next = 16;
                                return this.Model.checkDomainRepeat(params.prd_host, params.basepath);

                            case 16:
                                checkRepeatDomain = _context.sent;

                                if (!(checkRepeatDomain > 0)) {
                                    _context.next = 19;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在domain和basepath'));

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
                                _context.prev = 20;
                                _context.next = 23;
                                return this.Model.save(data);

                            case 23:
                                result = _context.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 30;
                                break;

                            case 27:
                                _context.prev = 27;
                                _context.t0 = _context['catch'](20);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 30:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[20, 27]]);
            }));

            function add(_x) {
                return _ref.apply(this, arguments);
            }

            return add;
        }()
        /**
        * 添加项目
        * @interface /project/add_member
        * @method POST
        * @category project
        * @foldnumber 10
        * @param {Number} id 项目id，不能为空
        * @param {member_uid} uid 项目成员uid,不能为空
        * @returns {Object} 
        * @example ./api/project/add_member.json
        */

    }, {
        key: 'addMember',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var params, check, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.member_uid) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员uid不能为空'));

                            case 3:
                                if (params.id) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context2.next = 7;
                                return this.Model.checkMemberRepeat(params.id, params.member_uid);

                            case 7:
                                check = _context2.sent;

                                if (!(check > 0)) {
                                    _context2.next = 10;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员已存在'));

                            case 10:
                                _context2.prev = 10;
                                _context2.next = 13;
                                return this.Model.addMember(params.id, params.member_uid);

                            case 13:
                                result = _context2.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context2.next = 20;
                                break;

                            case 17:
                                _context2.prev = 17;
                                _context2.t0 = _context2['catch'](10);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context2.t0.message);

                            case 20:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[10, 17]]);
            }));

            function addMember(_x2) {
                return _ref2.apply(this, arguments);
            }

            return addMember;
        }()
        /**
        * 添加项目
        * @interface /project/del_member
        * @method POST
        * @category project
        * @foldnumber 10
        * @param {Number} id 项目id，不能为空
        * @param {member_uid} uid 项目成员uid,不能为空
        * @returns {Object} 
        * @example ./api/project/del_member.json
        */

    }, {
        key: 'delMember',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var params, check, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.member_uid) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员uid不能为空'));

                            case 3:
                                if (params.id) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context3.next = 7;
                                return this.Model.checkMemberRepeat(params.id, params.member_uid);

                            case 7:
                                check = _context3.sent;

                                if (!(check === 0)) {
                                    _context3.next = 10;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目成员不存在'));

                            case 10:
                                _context3.prev = 10;
                                _context3.next = 13;
                                return this.Model.delMember(params.id, params.member_uid);

                            case 13:
                                result = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 20;
                                break;

                            case 17:
                                _context3.prev = 17;
                                _context3.t0 = _context3['catch'](10);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message);

                            case 20:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[10, 17]]);
            }));

            function delMember(_x3) {
                return _ref3.apply(this, arguments);
            }

            return delMember;
        }()
        /**
        * 添加项目
        * @interface /project/get
        * @method GET
        * @category project
        * @foldnumber 10
        * @param {Number} id 项目id，不能为空
        * @returns {Object} 
        * @example ./api/project/get.json
        */

    }, {
        key: 'get',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var params, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                params = ctx.request.query;

                                if (params.id) {
                                    _context4.next = 3;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context4.prev = 3;
                                _context4.next = 6;
                                return this.Model.get(params.id);

                            case 6:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 13;
                                break;

                            case 10:
                                _context4.prev = 10;
                                _context4.t0 = _context4['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 13:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[3, 10]]);
            }));

            function get(_x4) {
                return _ref4.apply(this, arguments);
            }

            return get;
        }()

        /**
         * 获取项目列表
         * @interface /project/list
         * @method GET
         * @category project
         * @foldnumber 10
         * @param {Number} group_id 项目group_id，不能为空
         * @returns {Object} 
         * @example ./api/project/list.json
         */

    }, {
        key: 'list',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var group_id, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                group_id = ctx.request.query.group_id;

                                if (group_id) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组id不能为空'));

                            case 3:
                                _context5.prev = 3;
                                _context5.next = 6;
                                return this.Model.list(group_id);

                            case 6:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 13;
                                break;

                            case 10:
                                _context5.prev = 10;
                                _context5.t0 = _context5['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[3, 10]]);
            }));

            function list(_x5) {
                return _ref5.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 删除项目
         * @interface /project/del
         * @method POST
         * @category project
         * @foldnumber 10
         * @param {Number} id 项目id，不能为空
         * @returns {Object} 
         * @example ./api/project/del.json
         */

    }, {
        key: 'del',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var id, result;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                id = ctx.request.body.id;

                                if (id) {
                                    _context6.next = 4;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 4:
                                _context6.next = 6;
                                return this.jungeProjectAuth(id);

                            case 6:
                                _context6.t0 = _context6.sent;

                                if (!(_context6.t0 !== true)) {
                                    _context6.next = 9;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 9:
                                _context6.next = 11;
                                return this.Model.del(id);

                            case 11:
                                result = _context6.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 18;
                                break;

                            case 15:
                                _context6.prev = 15;
                                _context6.t1 = _context6['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 18:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 15]]);
            }));

            function del(_x6) {
                return _ref6.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 编辑项目
         * @interface /project/up
         * @method GET
         * @category project
         * @foldnumber 10
         * @param {Number} id 项目id，不能为空
         * @param {String} name 项目名称，不能为空
         * @param {String} basepath 项目基本路径，不能为空
         * @param {String} prd_host 项目线上域名，不能为空。可通过配置的域名访问到mock数据
         * @param {String} [desc] 项目描述 
         * @param {String} [env] JSON字符串,例如{"local": "http://www.api.com"}
         * @returns {Object} 
         * @example ./api/project/up.json
         */

    }, {
        key: 'up',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var id, params, checkRepeat, checkRepeatDomain, data, result;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;
                                id = ctx.request.body.id;
                                params = ctx.request.body;
                                _context7.next = 5;
                                return this.jungeMemberAuth(id, this.getUid());

                            case 5:
                                _context7.t0 = _context7.sent;

                                if (!(_context7.t0 !== true)) {
                                    _context7.next = 8;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 8:
                                if (!params.name) {
                                    _context7.next = 14;
                                    break;
                                }

                                _context7.next = 11;
                                return this.Model.checkNameRepeat(params.name);

                            case 11:
                                checkRepeat = _context7.sent;

                                if (!(checkRepeat > 0)) {
                                    _context7.next = 14;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的项目名'));

                            case 14:
                                if (!(params.basepath && params.prd_host)) {
                                    _context7.next = 20;
                                    break;
                                }

                                _context7.next = 17;
                                return this.Model.checkDomainRepeat(params.prd_host, params.basepath);

                            case 17:
                                checkRepeatDomain = _context7.sent;

                                if (!(checkRepeatDomain > 0)) {
                                    _context7.next = 20;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在domain和basepath'));

                            case 20:
                                data = {
                                    uid: this.getUid(),
                                    up_time: _yapi2.default.commons.time()
                                };


                                if (params.name) data.name = params.name;
                                if (params.desc) data.desc = params.desc;
                                if (params.prd_host && params.basepath) {
                                    data.prd_host = params.prd_host;
                                    data.basepath = params.basepath;
                                }
                                if (params.env) data.env = params.env;

                                _context7.next = 27;
                                return this.Model.up(id, data);

                            case 27:
                                result = _context7.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 34;
                                break;

                            case 31:
                                _context7.prev = 31;
                                _context7.t1 = _context7['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context7.t1.message);

                            case 34:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 31]]);
            }));

            function up(_x7) {
                return _ref7.apply(this, arguments);
            }

            return up;
        }()
    }]);
    return projectController;
}(_base2.default);

module.exports = projectController;