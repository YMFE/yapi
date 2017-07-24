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

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _group = require('../models/group');

var _group2 = _interopRequireDefault(_group);

var _commons = require('../utils/commons.js');

var _commons2 = _interopRequireDefault(_commons);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectController = function (_baseController) {
    (0, _inherits3.default)(projectController, _baseController);

    function projectController(ctx) {
        (0, _classCallCheck3.default)(this, projectController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (projectController.__proto__ || (0, _getPrototypeOf2.default)(projectController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_project2.default);
        _this.groupModel = _yapi2.default.getInst(_group2.default);
        return _this;
    }

    (0, _createClass3.default)(projectController, [{
        key: 'handleBasepath',
        value: function handleBasepath(basepath) {
            if (!basepath) return false;
            if (basepath[0] !== '/') basepath = '/' + basepath;
            if (basepath[basepath.length - 1] === '/') basepath = basepath.substr(0, basepath.length - 1);
            if (!_yapi2.default.commons.verifyPath(basepath)) {
                return false;
            }
            return basepath;
        }
    }, {
        key: 'verifyDomain',
        value: function verifyDomain(domain) {
            if (!domain) return false;
            if (/^[a-zA-Z0-9\-_\.]+[a-zA-Z]{2,6}$/.test(domain)) {
                return true;
            }
            return false;
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
         * @param {String} protocol 线上域名协议，不能为空
         * @param {Number} group_id 项目分组id，不能为空
         * @param  {String} [desc] 项目描述
         * @returns {Object}
         * @example ./api/project/add.json
         */

    }, {
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
                                if (!((params.basepath = this.handleBasepath(params.basepath)) === false)) {
                                    _context.next = 16;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, 'basepath格式有误'));

                            case 16:
                                if (this.verifyDomain(params.prd_host)) {
                                    _context.next = 18;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '线上域名格式有误'));

                            case 18:
                                _context.next = 20;
                                return this.Model.checkDomainRepeat(params.prd_host, params.basepath);

                            case 20:
                                checkRepeatDomain = _context.sent;

                                if (!(checkRepeatDomain > 0)) {
                                    _context.next = 23;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在domain和basepath'));

                            case 23:
                                data = {
                                    name: params.name,
                                    desc: params.desc,
                                    prd_host: params.prd_host,
                                    basepath: params.basepath,
                                    protocol: params.protocol || 'http',
                                    members: [this.getUid()],
                                    uid: this.getUid(),
                                    group_id: params.group_id,
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context.prev = 24;
                                _context.next = 27;
                                return this.Model.save(data);

                            case 27:
                                result = _context.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 34;
                                break;

                            case 31:
                                _context.prev = 31;
                                _context.t0 = _context['catch'](24);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 34:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[24, 31]]);
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
        * @param {String} member_uid 项目成员uid,不能为空
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
         * 获取项目成员列表
         * @interface /project/get_member_list
         * @method GET
         * @category project
         * @foldnumber 10
         * @param {Number} id 项目id，不能为空
         * @return {Object}
         * @example ./api/project/get_member_list.json
         */

    }, {
        key: 'getMemberList',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var params, project, userInst, result;
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
                                project = _context4.sent;
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context4.next = 10;
                                return userInst.findByUids(project.members);

                            case 10:
                                result = _context4.sent;


                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 17;
                                break;

                            case 14:
                                _context4.prev = 14;
                                _context4.t0 = _context4['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 17:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[3, 14]]);
            }));

            function getMemberList(_x4) {
                return _ref4.apply(this, arguments);
            }

            return getMemberList;
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
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var params, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                params = ctx.request.query;

                                if (params.id) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context5.prev = 3;
                                _context5.next = 6;
                                return this.Model.get(params.id);

                            case 6:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 13;
                                break;

                            case 10:
                                _context5.prev = 10;
                                _context5.t0 = _context5['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[3, 10]]);
            }));

            function get(_x5) {
                return _ref5.apply(this, arguments);
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
         * @param {Number} [page] 分页页码
         * @param {Number} [limit] 每页数据条目，默认为10
         * @returns {Object}
         * @example ./api/project/list.json
         */

    }, {
        key: 'list',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var group_id, page, limit, result, count, uids, _users, users;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                group_id = ctx.request.query.group_id, page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10;

                                if (group_id) {
                                    _context6.next = 3;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组id不能为空'));

                            case 3:
                                _context6.prev = 3;
                                _context6.next = 6;
                                return this.Model.listWithPaging(group_id, page, limit);

                            case 6:
                                result = _context6.sent;
                                _context6.next = 9;
                                return this.Model.listCount(group_id);

                            case 9:
                                count = _context6.sent;
                                uids = [];

                                result.forEach(function (item) {
                                    if (uids.indexOf(item.uid) === -1) {
                                        uids.push(item.uid);
                                    }
                                });
                                _users = {};
                                _context6.next = 15;
                                return _yapi2.default.getInst(_user2.default).findByUids(uids);

                            case 15:
                                users = _context6.sent;

                                users.forEach(function (item) {
                                    _users[item._id] = item;
                                });
                                ctx.body = _yapi2.default.commons.resReturn({
                                    total: Math.ceil(count / limit),
                                    list: result,
                                    userinfo: _users
                                });
                                _context6.next = 23;
                                break;

                            case 20:
                                _context6.prev = 20;
                                _context6.t0 = _context6['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 23:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[3, 20]]);
            }));

            function list(_x6) {
                return _ref6.apply(this, arguments);
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
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var id, interfaceInst, count, result;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;
                                id = ctx.request.body.id;

                                if (id) {
                                    _context7.next = 4;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 4:
                                interfaceInst = _yapi2.default.getInst(_interface2.default);
                                _context7.next = 7;
                                return interfaceInst.countByProjectId(id);

                            case 7:
                                count = _context7.sent;

                                if (!(count > 0)) {
                                    _context7.next = 10;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '请先删除该项目下所有接口'));

                            case 10:
                                _context7.next = 12;
                                return this.jungeProjectAuth(id);

                            case 12:
                                _context7.t0 = _context7.sent;

                                if (!(_context7.t0 !== true)) {
                                    _context7.next = 15;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 15:
                                _context7.next = 17;
                                return this.Model.del(id);

                            case 17:
                                result = _context7.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 24;
                                break;

                            case 21:
                                _context7.prev = 21;
                                _context7.t1 = _context7['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 24:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 21]]);
            }));

            function del(_x7) {
                return _ref7.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 编辑项目
         * @interface /project/up
         * @method POST
         * @category project
         * @foldnumber 10
         * @param {Number} id 项目id，不能为空
         * @param {String} name 项目名称，不能为空
         * @param {String} basepath 项目基本路径，不能为空
         * @param {String} prd_host 项目线上域名，不能为空。可通过配置的域名访问到mock数据
         * @param {String} [desc] 项目描述
         * @param {Array} [env] 项目环境配置
         * @param {String} [env[].name] 环境名称
         * @param {String} [env[].domain] 环境域名
         * @returns {Object}
         * @example ./api/project/up.json
         */

    }, {
        key: 'up',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var id, params, projectData, checkRepeat, checkRepeatDomain, data, result;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                id = ctx.request.body.id;
                                params = ctx.request.body;

                                if (id) {
                                    _context8.next = 5;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '项目id不能为空'));

                            case 5:
                                _context8.next = 7;
                                return this.jungeMemberAuth(id, this.getUid());

                            case 7:
                                _context8.t0 = _context8.sent;

                                if (!(_context8.t0 !== true)) {
                                    _context8.next = 10;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 10:
                                _context8.next = 12;
                                return this.Model.get(id);

                            case 12:
                                projectData = _context8.sent;

                                if (!(params.basepath = this.handleBasepath(params.basepath) === false)) {
                                    _context8.next = 15;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, 'basepath格式有误'));

                            case 15:
                                if (this.verifyDomain(params.prd_host)) {
                                    _context8.next = 17;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '线上域名格式有误'));

                            case 17:

                                if (projectData.name === params.name) {
                                    delete params.name;
                                }
                                if (projectData.basepath === params.basepath && projectData.prd_host === params.prd_host) {
                                    delete params.basepath;
                                    delete params.prd_host;
                                }

                                if (!params.name) {
                                    _context8.next = 25;
                                    break;
                                }

                                _context8.next = 22;
                                return this.Model.checkNameRepeat(params.name);

                            case 22:
                                checkRepeat = _context8.sent;

                                if (!(checkRepeat > 0)) {
                                    _context8.next = 25;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的项目名'));

                            case 25:
                                if (!(params.basepath && params.prd_host)) {
                                    _context8.next = 31;
                                    break;
                                }

                                _context8.next = 28;
                                return this.Model.checkDomainRepeat(params.prd_host, params.basepath);

                            case 28:
                                checkRepeatDomain = _context8.sent;

                                if (!(checkRepeatDomain > 0)) {
                                    _context8.next = 31;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在domain和basepath'));

                            case 31:
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
                                if (params.protocol) data.protocol = params.protocol;
                                if (params.env) data.env = params.env;

                                _context8.next = 39;
                                return this.Model.up(id, data);

                            case 39:
                                result = _context8.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context8.next = 46;
                                break;

                            case 43:
                                _context8.prev = 43;
                                _context8.t1 = _context8['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context8.t1.message);

                            case 46:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 43]]);
            }));

            function up(_x8) {
                return _ref8.apply(this, arguments);
            }

            return up;
        }()

        /**
         * 模糊搜索项目名称或者组名称
         * @interface /project/search
         * @method GET
         * @category project
         * @foldnumber 10
         * @param {String} q
         * @return {Object}
         * @example ./api/project/search.json
        */

    }, {
        key: 'search',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx) {
                var q, projectList, groupList, projectRules, groupRules, queryList;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                q = ctx.request.query.q;

                                if (q) {
                                    _context9.next = 3;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(void 0, 400, 'No keyword.'));

                            case 3:
                                if (_yapi2.default.commons.validateSearchKeyword(q)) {
                                    _context9.next = 5;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(void 0, 400, 'Bad query.'));

                            case 5:
                                _context9.next = 7;
                                return this.Model.search(q);

                            case 7:
                                projectList = _context9.sent;
                                _context9.next = 10;
                                return this.groupModel.search(q);

                            case 10:
                                groupList = _context9.sent;
                                projectRules = ['_id', 'name', 'basepath', 'uid', 'env', 'members', { key: 'group_id', alias: 'groupId' }, { key: 'up_time', alias: 'upTime' }, { key: 'prd_host', alias: 'prdHost' }, { key: 'add_time', alias: 'addTime' }];
                                groupRules = ['_id', 'uid', { key: 'group_name', alias: 'groupName' }, { key: 'group_desc', alias: 'groupDesc' }, { key: 'add_time', alias: 'addTime' }, { key: 'up_time', alias: 'upTime' }];


                                projectList = _commons2.default.filterRes(projectList, projectRules);
                                groupList = _commons2.default.filterRes(groupList, groupRules);

                                queryList = {
                                    project: projectList,
                                    group: groupList
                                };
                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(queryList, 0, 'ok'));

                            case 17:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function search(_x9) {
                return _ref9.apply(this, arguments);
            }

            return search;
        }()
    }]);
    return projectController;
}(_base2.default);

module.exports = projectController;