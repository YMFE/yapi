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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 
var groupController = function (_baseController) {
    (0, _inherits3.default)(groupController, _baseController);

    function groupController(ctx) {
        (0, _classCallCheck3.default)(this, groupController);
        return (0, _possibleConstructorReturn3.default)(this, (groupController.__proto__ || (0, _getPrototypeOf2.default)(groupController)).call(this, ctx));
    }

    /**
     * 添加项目分组
     * @interface /group/add
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} group_name 项目分组名称，不能为空
     * @param  {String} [group_desc] 项目分组描述 
     * @returns {Object} 
     * @example ./api/group/add.json
     */


    (0, _createClass3.default)(groupController, [{
        key: 'add',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var params, groupInst, checkRepeat, data, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                params = ctx.request.body;

                                if (!(this.getRole() !== 'admin')) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '没有权限'));

                            case 3:
                                if (params.group_name) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目分组名不能为空'));

                            case 5:
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context.next = 8;
                                return groupInst.checkRepeat(params.group_name);

                            case 8:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat > 0)) {
                                    _context.next = 11;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '项目分组名已存在'));

                            case 11:
                                data = {
                                    group_name: params.group_name,
                                    group_desc: params.group_desc,
                                    uid: '0',
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };
                                _context.prev = 12;
                                _context.next = 15;
                                return groupInst.save(data);

                            case 15:
                                result = _context.sent;

                                result = _yapi2.default.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid']);
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 23;
                                break;

                            case 20:
                                _context.prev = 20;
                                _context.t0 = _context['catch'](12);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 23:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[12, 20]]);
            }));

            function add(_x) {
                return _ref.apply(this, arguments);
            }

            return add;
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
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var groupInst, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                groupInst = _yapi2.default.getInst(_group2.default);
                                _context2.next = 4;
                                return groupInst.list();

                            case 4:
                                result = _context2.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context2.next = 11;
                                break;

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context2.t0.message);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 8]]);
            }));

            function list(_x2) {
                return _ref2.apply(this, arguments);
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
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var groupInst, projectInst, id, count, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(this.getRole() !== 'admin')) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '没有权限'));

                            case 2:
                                _context3.prev = 2;
                                groupInst = _yapi2.default.getInst(_group2.default);
                                projectInst = _yapi2.default.getInst(_project2.default);
                                id = ctx.request.body.id;

                                if (id) {
                                    _context3.next = 8;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, 'id不能为空'));

                            case 8:
                                count = projectInst.countByGroupId(id);

                                if (!(count > 0)) {
                                    _context3.next = 11;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 403, '请先删除该分组下的项目'));

                            case 11:
                                _context3.next = 13;
                                return groupInst.del(id);

                            case 13:
                                result = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 20;
                                break;

                            case 17:
                                _context3.prev = 17;
                                _context3.t0 = _context3['catch'](2);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 20:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[2, 17]]);
            }));

            function del(_x3) {
                return _ref3.apply(this, arguments);
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
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var groupInst, id, data, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(this.getRole() !== 'admin')) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '没有权限'));

                            case 2:
                                _context4.prev = 2;
                                groupInst = _yapi2.default.getInst(_group2.default);
                                id = ctx.request.body.id;
                                data = {};

                                ctx.request.body.group_name && (data.group_name = ctx.request.body.group_name);
                                ctx.request.body.group_desc && (data.group_desc = ctx.request.body.group_desc);
                                if ((0, _keys2.default)(data).length === 0) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 404, '分组名和分组描述不能为空');
                                }
                                _context4.next = 11;
                                return groupInst.up(id, data);

                            case 11:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 18;
                                break;

                            case 15:
                                _context4.prev = 15;
                                _context4.t0 = _context4['catch'](2);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 18:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 15]]);
            }));

            function up(_x4) {
                return _ref4.apply(this, arguments);
            }

            return up;
        }()
    }]);
    return groupController;
}(_base2.default);

module.exports = groupController;