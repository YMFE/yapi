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

var _node = require('../models/node.js');

var _node2 = _interopRequireDefault(_node);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeController = function (_baseController) {
    (0, _inherits3.default)(nodeController, _baseController);

    function nodeController(ctx) {
        (0, _classCallCheck3.default)(this, nodeController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (nodeController.__proto__ || (0, _getPrototypeOf2.default)(nodeController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_node2.default);
        _this.groupModel = _yapi2.default.getInst(_group2.default);
        return _this;
    }

    /**
     * 添加记录节点
     * @interface /node/add
     * @method POST
     * @category node
     * @foldnumber 10
     * @param {String} title 节点名称，不能为空
     * @param {String} content 节点内容，不能为空
     * @returns {Object}
     * @example ./api/node/add.json
     */


    (0, _createClass3.default)(nodeController, [{
        key: 'add',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var params, data, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                params = ctx.request.body;

                                if (params.title) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'title不能为空'));

                            case 3:
                                if (params.content) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'content不能为空'));

                            case 5:
                                data = {
                                    title: params.title,
                                    content: params.content,
                                    is_read: false,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time()
                                };
                                _context.prev = 6;
                                _context.next = 9;
                                return this.Model.save(data);

                            case 9:
                                result = _context.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 16;
                                break;

                            case 13:
                                _context.prev = 13;
                                _context.t0 = _context['catch'](6);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[6, 13]]);
            }));

            function add(_x) {
                return _ref.apply(this, arguments);
            }

            return add;
        }()

        /**
         * 获取节点
         * @interface /node/get
         * @method GET
         * @category node
         * @foldnumber 10
         * @param {Number} id 节点id，不能为空
         * @returns {Object}
         * @example ./api/node/get.json
         */

    }, {
        key: 'get',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var params, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                params = ctx.request.query;

                                if (params.id) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '节点id不能为空'));

                            case 3:
                                _context2.prev = 3;
                                _context2.next = 6;
                                return this.Model.get(params.id);

                            case 6:
                                result = _context2.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context2.next = 13;
                                break;

                            case 10:
                                _context2.prev = 10;
                                _context2.t0 = _context2['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context2.t0.message);

                            case 13:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[3, 10]]);
            }));

            function get(_x2) {
                return _ref2.apply(this, arguments);
            }

            return get;
        }()

        /**
         * 获取节点列表
         * @interface /node/list
         * @method GET
         * @category node
         * @foldnumber 10
         * @param {Number} uid 用户id， 不能为空
         * @param {Number} [page] 分页页码
         * @param {Number} [limit] 分页大小
         * @returns {Object}
         * @example ./api/project/list.json
         */

    }, {
        key: 'list',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var uid, page, limit, result, count;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                uid = ctx.request.query.uid, page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10;

                                if (uid) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户id不能为空'));

                            case 3:
                                _context3.prev = 3;
                                _context3.next = 6;
                                return this.Model.listWithPaging(uid, page, limit);

                            case 6:
                                result = _context3.sent;
                                _context3.next = 9;
                                return this.Model.listCount(uid);

                            case 9:
                                count = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn({
                                    total: Math.ceil(count / limit),
                                    list: result
                                });
                                _context3.next = 16;
                                break;

                            case 13:
                                _context3.prev = 13;
                                _context3.t0 = _context3['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 16:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[3, 13]]);
            }));

            function list(_x3) {
                return _ref3.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 删除节点
         * @interface /node/del
         * @method POST
         * @category node
         * @foldnumber 10
         * @param {Number} id 节点id，不能为空
         * @returns {Object}
         * @example ./api/project/del.json
         */

    }, {
        key: 'del',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var id, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                id = ctx.request.body.id;

                                if (id) {
                                    _context4.next = 4;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '节点id不能为空'));

                            case 4:
                                _context4.next = 6;
                                return this.Model.del(id);

                            case 6:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 13;
                                break;

                            case 10:
                                _context4.prev = 10;
                                _context4.t0 = _context4['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

                            case 13:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 10]]);
            }));

            function del(_x4) {
                return _ref4.apply(this, arguments);
            }

            return del;
        }()

        /**
         * 编辑节点
         * @interface /node/up
         * @method POST
         * @category node
         * @foldnumber 10
         * @param {Number} id 节点id，不能为空
         * @param {String} [title]
         * @param {String} [content] 节点描述
         * @param {Boolean} [is_read] 是否阅读
         * @returns {Object}
         * @example ./api/node/up.json
         */

    }, {
        key: 'up',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var id, params, data, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                id = ctx.request.body.id;
                                params = ctx.request.body;
                                _context5.next = 5;
                                return this.jungeMemberAuth(id, this.getUid());

                            case 5:
                                _context5.t0 = _context5.sent;

                                if (!(_context5.t0 !== true)) {
                                    _context5.next = 8;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 8:
                                if (id) {
                                    _context5.next = 10;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 402, '节点id不能为空'));

                            case 10:
                                data = {
                                    uid: this.getUid(),
                                    up_time: _yapi2.default.commons.time()
                                };


                                if (params.title) data.title = params.title;
                                if (params.content) data.content = params.content;
                                if (params.is_read) data.is_read = params.is_read;

                                _context5.next = 16;
                                return this.Model.up(id, data);

                            case 16:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 23;
                                break;

                            case 20:
                                _context5.prev = 20;
                                _context5.t1 = _context5['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t1.message);

                            case 23:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 20]]);
            }));

            function up(_x5) {
                return _ref5.apply(this, arguments);
            }

            return up;
        }()
    }]);
    return nodeController;
}(_base2.default);

module.exports = nodeController;