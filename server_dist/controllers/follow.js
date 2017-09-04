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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('../yapi.js');
var baseController = require('./base.js');
var followModel = require('../models/follow');
var projectModel = require('../models/project');

var followController = function (_baseController) {
    (0, _inherits3.default)(followController, _baseController);

    function followController(ctx) {
        (0, _classCallCheck3.default)(this, followController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (followController.__proto__ || (0, _getPrototypeOf2.default)(followController)).call(this, ctx));

        _this.Model = yapi.getInst(followModel);
        _this.projectModel = yapi.getInst(projectModel);
        return _this;
    }

    /**
     * 获取关注项目列表
     * @interface /follow/list
     * @method GET
     * @category follow
     * @foldnumber 10
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example /follow/list
     */

    (0, _createClass3.default)(followController, [{
        key: 'list',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var uid, page, limit, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                uid = this.getUid(), page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10;

                                if (uid) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '用户id不能为空'));

                            case 3:
                                _context.prev = 3;
                                _context.next = 6;
                                return this.Model.list(uid);

                            case 6:
                                result = _context.sent;


                                ctx.body = yapi.commons.resReturn({
                                    list: result
                                });
                                _context.next = 13;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](3);

                                ctx.body = yapi.commons.resReturn(null, 402, _context.t0.message);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 10]]);
            }));

            function list(_x) {
                return _ref.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 取消关注
         * @interface /follow/del
         * @method POST
         * @category follow
         * @foldnumber 10
         * @param {Number} projectid 
         * @returns {Object}
         * @example /follow/del
         */

    }, {
        key: 'del',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var params, uid, checkRepeat, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                params = ctx.request.body, uid = this.getUid();

                                if (params.projectid) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context2.next = 5;
                                return this.Model.checkProjectRepeat(uid, params.projectid);

                            case 5:
                                checkRepeat = _context2.sent;

                                if (!(checkRepeat == 0)) {
                                    _context2.next = 8;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = yapi.commons.resReturn(null, 401, '项目未关注'));

                            case 8:
                                _context2.prev = 8;
                                _context2.next = 11;
                                return this.Model.del(params.projectid, this.getUid());

                            case 11:
                                result = _context2.sent;

                                ctx.body = yapi.commons.resReturn(result);
                                _context2.next = 18;
                                break;

                            case 15:
                                _context2.prev = 15;
                                _context2.t0 = _context2['catch'](8);

                                ctx.body = yapi.commons.resReturn(null, 402, _context2.t0.message);

                            case 18:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[8, 15]]);
            }));

            function del(_x2) {
                return _ref2.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 添加关注
         * @interface /follow/add
         * @method GET
         * @category follow
         * @foldnumber 10
         * @param {Number} projectid 项目id
         * @param {String} projectname 项目名
         * @param {String} icon 项目icon
         * @returns {Object}
         * @example /follow/add
         */

    }, {
        key: 'add',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var params, uid, checkRepeat, project, data, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                params = ctx.request.body;

                                params = yapi.commons.handleParams(params, {
                                    projectid: 'number'
                                });

                                uid = this.getUid();

                                if (params.projectid) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context3.next = 7;
                                return this.Model.checkProjectRepeat(uid, params.projectid);

                            case 7:
                                checkRepeat = _context3.sent;

                                if (!checkRepeat) {
                                    _context3.next = 10;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = yapi.commons.resReturn(null, 401, '项目已关注'));

                            case 10:
                                _context3.prev = 10;
                                _context3.next = 13;
                                return this.projectModel.get(params.projectid);

                            case 13:
                                project = _context3.sent;
                                data = {
                                    uid: uid,
                                    projectid: params.projectid,
                                    projectname: project.name,
                                    icon: project.icon,
                                    color: project.color
                                };
                                _context3.next = 17;
                                return this.Model.save(data);

                            case 17:
                                result = _context3.sent;

                                result = yapi.commons.fieldSelect(result, ['_id', 'uid', 'projectid', 'projectname', 'icon', 'color']);
                                ctx.body = yapi.commons.resReturn(result);
                                _context3.next = 25;
                                break;

                            case 22:
                                _context3.prev = 22;
                                _context3.t0 = _context3['catch'](10);

                                ctx.body = yapi.commons.resReturn(null, 402, _context3.t0.message);

                            case 25:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[10, 22]]);
            }));

            function add(_x3) {
                return _ref3.apply(this, arguments);
            }

            return add;
        }()
    }]);
    return followController;
}(baseController);

module.exports = followController;