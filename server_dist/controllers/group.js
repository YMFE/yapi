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

var _group = require('../models/group.js');

var _group2 = _interopRequireDefault(_group);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _interfaceCol = require('../models/interfaceCol.js');

var _interfaceCol2 = _interopRequireDefault(_interfaceCol);

var _interfaceCase = require('../models/interfaceCase.js');

var _interfaceCase2 = _interopRequireDefault(_interfaceCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupController = function (_baseController) {
    (0, _inherits3.default)(groupController, _baseController);

    function groupController(ctx) {
        (0, _classCallCheck3.default)(this, groupController);
        return (0, _possibleConstructorReturn3.default)(this, (groupController.__proto__ || (0, _getPrototypeOf2.default)(groupController)).call(this, ctx));
    }
    /**
     * 添加项目分组
     * @interface /group/get
     * @method GET
     * @category group
     * @foldnumber 10
     * @param {String} id 项目分组ID
     * @returns {Object} 
     * @example 
     */


    (0, _createClass3.default)(groupController, [{
        key: 'get',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var params, groupInst, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                params = ctx.request.query;

                                if (params.id) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组id不能为空'));

                            case 4:
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context.next = 7;
                                return groupInst.getGroupById(params.id);

                            case 7:
                                result = _context.sent;

                                result = result.toObject();
                                _context.next = 11;
                                return this.getProjectRole(params.id, 'group');

                            case 11:
                                result.role = _context.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 18;
                                break;

                            case 15:
                                _context.prev = 15;
                                _context.t0 = _context['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 400, _context.t0.message);

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 15]]);
            }));

            function get(_x) {
                return _ref.apply(this, arguments);
            }

            return get;
        }()

        /**
         * 添加项目分组
         * @interface /group/add
         * @method POST
         * @category group
         * @foldnumber 10
         * @param {String} group_name 项目分组名称，不能为空
         * @param {String} [group_desc] 项目分组描述
         * @param {String} owner_uid  组长uid
         * @returns {Object}
         * @example ./api/group/add.json
         */

    }, {
        key: 'add',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var params, groupUserdata, groupInst, checkRepeat, data, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                params = ctx.request.body;


                                params = _yapi2.default.commons.handleParams(params, {
                                    group_name: 'string',
                                    group_desc: 'string',
                                    owner_uid: 'number'
                                });

                                if (!(this.getRole() !== 'admin')) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '没有权限'));

                            case 4:
                                if (params.group_name) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组名不能为空'));

                            case 6:
                                if (params.owner_uid) {
                                    _context2.next = 8;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组必须添加一个组长'));

                            case 8:
                                _context2.next = 10;
                                return this.getUserdata(params.owner_uid, 'owner');

                            case 10:
                                groupUserdata = _context2.sent;

                                if (!(groupUserdata === null)) {
                                    _context2.next = 13;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '组长uid不存在'));

                            case 13:
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context2.next = 16;
                                return groupInst.checkRepeat(params.group_name);

                            case 16:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat > 0)) {
                                    _context2.next = 19;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '项目分组名已存在'));

                            case 19:
                                data = {
                                    group_name: params.group_name,
                                    group_desc: params.group_desc,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time(),
                                    members: [groupUserdata]
                                };
                                _context2.prev = 20;
                                _context2.next = 23;
                                return groupInst.save(data);

                            case 23:
                                result = _context2.sent;


                                result = _yapi2.default.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid', 'members']);
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context2.next = 31;
                                break;

                            case 28:
                                _context2.prev = 28;
                                _context2.t0 = _context2['catch'](20);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context2.t0.message);

                            case 31:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[20, 28]]);
            }));

            function add(_x2) {
                return _ref2.apply(this, arguments);
            }

            return add;
        }()
    }, {
        key: 'getUserdata',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(uid, role) {
                var userInst, userData;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                role = role || 'dev';
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context3.next = 4;
                                return userInst.findById(uid);

                            case 4:
                                userData = _context3.sent;

                                if (userData) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 7:
                                return _context3.abrupt('return', {
                                    _role: userData.role,
                                    role: role,
                                    uid: userData._id,
                                    username: userData.username,
                                    email: userData.email
                                });

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getUserdata(_x3, _x4) {
                return _ref3.apply(this, arguments);
            }

            return getUserdata;
        }()

        /**
         * 添加项目分组成员
         * @interface /group/add_member
         * @method POST
         * @category group
         * @foldnumber 10
         * @param {String} id 项目分组id
         * @param {String} member_uid 项目分组成员uid
         * @returns {Object}
         * @example
         */

    }, {
        key: 'addMember',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var params, groupInst, check, groupUserdata, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                params = ctx.request.body;
                                groupInst = _yapi2.default.getInst(_group2.default);

                                if (params.member_uid) {
                                    _context4.next = 4;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组成员uid不能为空'));

                            case 4:
                                if (params.id) {
                                    _context4.next = 6;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组id不能为空'));

                            case 6:
                                _context4.next = 8;
                                return groupInst.checkMemberRepeat(params.id, params.member_uid);

                            case 8:
                                check = _context4.sent;

                                if (!(check > 0)) {
                                    _context4.next = 11;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '成员已存在'));

                            case 11:
                                _context4.next = 13;
                                return this.getUserdata(params.member_uid);

                            case 13:
                                groupUserdata = _context4.sent;

                                if (!(groupUserdata === null)) {
                                    _context4.next = 16;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '组长uid不存在'));

                            case 16:
                                if (!(groupUserdata._role === 'admin')) {
                                    _context4.next = 18;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '不能邀请管理员'));

                            case 18:
                                delete groupUserdata._role;
                                _context4.prev = 19;
                                _context4.next = 22;
                                return groupInst.addMember(params.id, groupUserdata);

                            case 22:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 29;
                                break;

                            case 26:
                                _context4.prev = 26;
                                _context4.t0 = _context4['catch'](19);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 29:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[19, 26]]);
            }));

            function addMember(_x5) {
                return _ref4.apply(this, arguments);
            }

            return addMember;
        }()

        /**
         * 修改项目分组成员角色
         * @interface /group/change_member_role
         * @method POST
         * @category group
         * @foldnumber 10
         * @param {String} id 项目分组id
         * @param {String} member_uid 项目分组成员uid
         * @param {String} role 权限 ['owner'|'dev']
         * @returns {Object}
         * @example
         */

    }, {
        key: 'changeMemberRole',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var params, groupInst, check, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                params = ctx.request.body;
                                groupInst = _yapi2.default.getInst(_group2.default);

                                if (params.member_uid) {
                                    _context5.next = 4;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组成员uid不能为空'));

                            case 4:
                                if (params.id) {
                                    _context5.next = 6;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组id不能为空'));

                            case 6:
                                _context5.next = 8;
                                return groupInst.checkMemberRepeat(params.id, params.member_uid);

                            case 8:
                                check = _context5.sent;

                                if (!(check === 0)) {
                                    _context5.next = 11;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组成员不存在'));

                            case 11:
                                _context5.next = 13;
                                return this.checkAuth(params.id, 'group', 'danger');

                            case 13:
                                _context5.t0 = _context5.sent;

                                if (!(_context5.t0 !== true)) {
                                    _context5.next = 16;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 16:

                                params.role = params.role === 'owner' ? 'owner' : 'dev';

                                _context5.prev = 17;
                                _context5.next = 20;
                                return groupInst.changeMemberRole(params.id, params.member_uid, params.role);

                            case 20:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 27;
                                break;

                            case 24:
                                _context5.prev = 24;
                                _context5.t1 = _context5['catch'](17);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t1.message);

                            case 27:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[17, 24]]);
            }));

            function changeMemberRole(_x6) {
                return _ref5.apply(this, arguments);
            }

            return changeMemberRole;
        }()
        /**
         * 获取所有项目成员
         * @interface /group/get_member_list
         * @method GET
         * @category group
         * @foldnumber 10
         * @param {String} id 项目分组id
         * @returns {Object}
         * @example
         */

    }, {
        key: 'getMemberList',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var params, groupInst, group;
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
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context6.next = 7;
                                return groupInst.get(params.id);

                            case 7:
                                group = _context6.sent;

                                ctx.body = _yapi2.default.commons.resReturn(group.members);
                                _context6.next = 14;
                                break;

                            case 11:
                                _context6.prev = 11;
                                _context6.t0 = _context6['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 14:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[3, 11]]);
            }));

            function getMemberList(_x7) {
                return _ref6.apply(this, arguments);
            }

            return getMemberList;
        }()

        /**
         * 删除项目成员
         * @interface /group/del_member
         * @method POST
         * @category group
         * @foldnumber 10
         * @param {String} id 项目分组id
         * @param {String} member_uid 项目分组成员uid
         * @returns {Object}
         * @example
         */

    }, {
        key: 'delMember',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var params, groupInst, check, result;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                params = ctx.request.body;
                                groupInst = _yapi2.default.getInst(_group2.default);

                                if (params.member_uid) {
                                    _context7.next = 4;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组成员uid不能为空'));

                            case 4:
                                if (params.id) {
                                    _context7.next = 6;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组id不能为空'));

                            case 6:
                                _context7.next = 8;
                                return groupInst.checkMemberRepeat(params.id, params.member_uid);

                            case 8:
                                check = _context7.sent;

                                if (!(check === 0)) {
                                    _context7.next = 11;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分组成员不存在'));

                            case 11:
                                _context7.next = 13;
                                return this.checkAuth(params.id, 'group', 'danger');

                            case 13:
                                _context7.t0 = _context7.sent;

                                if (!(_context7.t0 !== true)) {
                                    _context7.next = 16;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 16:
                                _context7.prev = 16;
                                _context7.next = 19;
                                return groupInst.delMember(params.id, params.member_uid);

                            case 19:
                                result = _context7.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 26;
                                break;

                            case 23:
                                _context7.prev = 23;
                                _context7.t1 = _context7['catch'](16);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context7.t1.message);

                            case 26:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[16, 23]]);
            }));

            function delMember(_x8) {
                return _ref7.apply(this, arguments);
            }

            return delMember;
        }()

        /**
         * 获取项目分组列表
         * @interface /group/list
         * @method get
         * @category group
         * @foldnumber 10
         * @returns {Object}
         * @example ./api/group/list.json
         */

    }, {
        key: 'list',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var groupInst, result;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context8.next = 4;
                                return groupInst.list();

                            case 4:
                                result = _context8.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context8.next = 11;
                                break;

                            case 8:
                                _context8.prev = 8;
                                _context8.t0 = _context8['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context8.t0.message);

                            case 11:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 8]]);
            }));

            function list(_x9) {
                return _ref8.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 删除项目分组
         * @interface /group/del
         * @method post
         * @param {String} id 项目分组id
         * @category group
         * @foldnumber 10
         * @returns {Object}
         * @example ./api/group/del.json
         */

    }, {
        key: 'del',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(ctx) {
                var _this2 = this;

                var groupInst, projectInst, interfaceInst, interfaceColInst, interfaceCaseInst, _id, projectList, result;

                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                if (!(this.getRole() !== 'admin')) {
                                    _context10.next = 2;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '没有权限'));

                            case 2:
                                _context10.prev = 2;
                                groupInst = _yapi2.default.getInst(_group2.default);
                                projectInst = _yapi2.default.getInst(_project2.default);
                                interfaceInst = _yapi2.default.getInst(_interface2.default);
                                interfaceColInst = _yapi2.default.getInst(_interfaceCol2.default);
                                interfaceCaseInst = _yapi2.default.getInst(_interfaceCase2.default);
                                _id = ctx.request.body.id;

                                if (_id) {
                                    _context10.next = 11;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, 'id不能为空'));

                            case 11:
                                _context10.next = 13;
                                return projectInst.list(_id, true);

                            case 13:
                                projectList = _context10.sent;

                                projectList.forEach(function () {
                                    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(p) {
                                        return _regenerator2.default.wrap(function _callee9$(_context9) {
                                            while (1) {
                                                switch (_context9.prev = _context9.next) {
                                                    case 0:
                                                        _context9.next = 2;
                                                        return interfaceInst.delByProjectId(p._id);

                                                    case 2:
                                                        _context9.next = 4;
                                                        return interfaceCaseInst.delByProjectId(p._id);

                                                    case 4:
                                                        _context9.next = 6;
                                                        return interfaceColInst.delByProjectId(p._id);

                                                    case 6:
                                                    case 'end':
                                                        return _context9.stop();
                                                }
                                            }
                                        }, _callee9, _this2);
                                    }));

                                    return function (_x11) {
                                        return _ref10.apply(this, arguments);
                                    };
                                }());
                                _context10.next = 17;
                                return projectInst.delByGroupid(_id);

                            case 17:
                                _context10.next = 19;
                                return groupInst.del(_id);

                            case 19:
                                result = _context10.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context10.next = 26;
                                break;

                            case 23:
                                _context10.prev = 23;
                                _context10.t0 = _context10['catch'](2);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context10.t0.message);

                            case 26:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[2, 23]]);
            }));

            function del(_x10) {
                return _ref9.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 更新项目分组
         * @interface /group/up
         * @method post
         * @param {String} id 项目分组id
         * @param {String} group_name 项目分组名称
         * @param {String} group_desc 项目分组描述
         * @category group
         * @foldnumber 10
         * @returns {Object}
         * @example ./api/group/up.json
         */

    }, {
        key: 'up',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(ctx) {
                var groupInst, _id2, data, result;

                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.checkAuth(id, 'group', 'danger');

                            case 2:
                                _context11.t0 = _context11.sent;

                                if (!(_context11.t0 !== true)) {
                                    _context11.next = 5;
                                    break;
                                }

                                return _context11.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 5:
                                _context11.prev = 5;

                                ctx.request.body = _yapi2.default.commons.handleParams(ctx.request.body, {
                                    id: 'number',
                                    group_name: 'string',
                                    group_desc: 'string'
                                });
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _id2 = ctx.request.body.id;
                                data = {};

                                ctx.request.body.group_name && (data.group_name = ctx.request.body.group_name);
                                ctx.request.body.group_desc && (data.group_desc = ctx.request.body.group_desc);
                                if ((0, _keys2.default)(data).length === 0) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 404, '分组名和分组描述不能为空');
                                }
                                _context11.next = 15;
                                return groupInst.up(_id2, data);

                            case 15:
                                result = _context11.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context11.next = 22;
                                break;

                            case 19:
                                _context11.prev = 19;
                                _context11.t1 = _context11['catch'](5);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context11.t1.message);

                            case 22:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[5, 19]]);
            }));

            function up(_x12) {
                return _ref11.apply(this, arguments);
            }

            return up;
        }()
    }]);
    return groupController;
}(_base2.default);

module.exports = groupController;