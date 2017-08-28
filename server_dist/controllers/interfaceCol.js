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

var _interfaceCol = require('../models/interfaceCol.js');

var _interfaceCol2 = _interopRequireDefault(_interfaceCol);

var _interfaceCase = require('../models/interfaceCase.js');

var _interfaceCase2 = _interopRequireDefault(_interfaceCase);

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interfaceColController = function (_baseController) {
    (0, _inherits3.default)(interfaceColController, _baseController);

    function interfaceColController(ctx) {
        (0, _classCallCheck3.default)(this, interfaceColController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (interfaceColController.__proto__ || (0, _getPrototypeOf2.default)(interfaceColController)).call(this, ctx));

        _this.colModel = _yapi2.default.getInst(_interfaceCol2.default);
        _this.caseModel = _yapi2.default.getInst(_interfaceCase2.default);
        _this.interfaceModel = _yapi2.default.getInst(_interface2.default);
        return _this;
    }

    /**
     * 获取所有接口集
     * @interface /col/list
     * @method GET
     * @category col
     * @foldnumber 10
     * @param {String} project_id email名称，不能为空
     * @returns {Object}
     * @example
     */


    (0, _createClass3.default)(interfaceColController, [{
        key: 'list',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
                var id, result, i;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                id = ctx.query.project_id;
                                _context.next = 4;
                                return this.colModel.list(id);

                            case 4:
                                result = _context.sent;
                                i = 0;

                            case 6:
                                if (!(i < result.length)) {
                                    _context.next = 14;
                                    break;
                                }

                                result[i] = result[i].toObject();
                                _context.next = 10;
                                return this.caseModel.list(result[i]._id);

                            case 10:
                                result[i].caseList = _context.sent;

                            case 11:
                                i++;
                                _context.next = 6;
                                break;

                            case 14:
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 20;
                                break;

                            case 17:
                                _context.prev = 17;
                                _context.t0 = _context['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 20:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 17]]);
            }));

            function list(_x) {
                return _ref.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 增加接口集
         * @interface /col/add_col
         * @method POST
         * @category col
         * @foldnumber 10
         * @param {Number} project_id
         * @param {String} name
         * @param {String} desc
         * @returns {Object}
         * @example
         */

    }, {
        key: 'addCol',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
                var params, auth, result, username;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                params = ctx.request.body;

                                params = _yapi2.default.commons.handleParams(params, {
                                    name: 'string',
                                    project_id: 'number',
                                    desc: 'string'
                                });

                                if (params.project_id) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                if (params.name) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '名称不能为空'));

                            case 7:
                                _context2.next = 9;
                                return this.checkAuth(params.project_id, 'project', 'edit');

                            case 9:
                                auth = _context2.sent;

                                if (auth) {
                                    _context2.next = 12;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 12:
                                _context2.next = 14;
                                return this.colModel.save({
                                    name: params.name,
                                    project_id: params.project_id,
                                    desc: params.desc,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                });

                            case 14:
                                result = _context2.sent;
                                username = this.getUsername();

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u6DFB\u52A0\u4E86\u63A5\u53E3\u96C6 "' + params.name + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: params.project_id
                                });
                                ctx.body = _yapi2.default.commons.resReturn(result);

                                _context2.next = 23;
                                break;

                            case 20:
                                _context2.prev = 20;
                                _context2.t0 = _context2['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context2.t0.message);

                            case 23:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 20]]);
            }));

            function addCol(_x2) {
                return _ref2.apply(this, arguments);
            }

            return addCol;
        }()

        /**
         * 获取一个接口集下的所有的接口用例
         * @interface /col/case_list
         * @method GET
         * @category col
         * @foldnumber 10
         * @param {String} col_id 接口集id
         * @returns {Object}
         * @example
         */

    }, {
        key: 'getCaseList',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(ctx) {
                var id, inst, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                id = ctx.query.col_id;
                                inst = _yapi2.default.getInst(_interfaceCase2.default);
                                _context3.next = 5;
                                return inst.list(id, 'all');

                            case 5:
                                result = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 12;
                                break;

                            case 9:
                                _context3.prev = 9;
                                _context3.t0 = _context3['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message);

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 9]]);
            }));

            function getCaseList(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getCaseList;
        }()

        /**
         * 增加一个接口用例
         * @interface /col/add_case
         * @method POST
         * @category col
         * @foldnumber 10
         * @param {String} casename
         * @param {Number} col_id
         * @param {Number} project_id
         * @param {String} domain
         * @param {String} path
         * @param {String} method
         * @param {Object} req_query
         * @param {Object} req_headers
         * @param {String} req_body_type
         * @param {Array} req_body_form
         * @param {String} req_body_other
         * @returns {Object}
         * @example
         */

    }, {
        key: 'addCase',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx) {
                var _this2 = this;

                var params, auth, result, username;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                params = ctx.request.body;

                                params = _yapi2.default.commons.handleParams(params, {
                                    casename: 'string',
                                    project_id: 'number',
                                    col_id: 'number',
                                    interface_id: 'number',
                                    domain: 'string',
                                    method: 'string'
                                });

                                if (params.project_id) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                if (params.interface_id) {
                                    _context4.next = 7;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 7:
                                _context4.next = 9;
                                return this.checkAuth(params.project_id, 'project', 'edit');

                            case 9:
                                auth = _context4.sent;

                                if (auth) {
                                    _context4.next = 12;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 12:
                                if (params.col_id) {
                                    _context4.next = 14;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口集id不能为空'));

                            case 14:
                                if (params.casename) {
                                    _context4.next = 16;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用例名称不能为空'));

                            case 16:

                                params.uid = this.getUid();
                                params.index = 0;
                                params.add_time = _yapi2.default.commons.time();
                                params.up_time = _yapi2.default.commons.time();
                                _context4.next = 22;
                                return this.caseModel.save(params);

                            case 22:
                                result = _context4.sent;
                                username = this.getUsername();


                                this.colModel.get(params.col_id).then(function (col) {
                                    _yapi2.default.commons.saveLog({
                                        content: '\u7528\u6237 "' + username + '" \u5728\u63A5\u53E3\u96C6 "' + col.name + '" \u4E0B\u6DFB\u52A0\u4E86\u63A5\u53E3\u7528\u4F8B "' + params.casename + '"',
                                        type: 'project',
                                        uid: _this2.getUid(),
                                        username: username,
                                        typeid: params.project_id
                                    });
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);

                                _context4.next = 31;
                                break;

                            case 28:
                                _context4.prev = 28;
                                _context4.t0 = _context4['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 31:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 28]]);
            }));

            function addCase(_x4) {
                return _ref4.apply(this, arguments);
            }

            return addCase;
        }()

        /**
         * 更新一个接口用例
         * @interface /col/up_case
         * @method POST
         * @category col
         * @foldnumber 10
         * @param {number} id
         * @param {String} casename
         * @param {String} domain
         * @param {String} path
         * @param {String} method
         * @param {Object} req_query
         * @param {Object} req_headers
         * @param {String} req_body_type
         * @param {Array} req_body_form
         * @param {String} req_body_other
         * @returns {Object}
         * @example
         */

    }, {
        key: 'upCase',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx) {
                var _this3 = this;

                var params, caseData, auth, result, username;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                params = ctx.request.body;

                                params = _yapi2.default.commons.handleParams(params, {
                                    id: 'number',
                                    casename: 'string'
                                });

                                if (params.id) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用例id不能为空'));

                            case 5:
                                if (params.casename) {
                                    _context5.next = 7;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用例名称不能为空'));

                            case 7:
                                _context5.next = 9;
                                return this.caseModel.get(params.id);

                            case 9:
                                caseData = _context5.sent;
                                _context5.next = 12;
                                return this.checkAuth(caseData.project_id, 'project', 'edit');

                            case 12:
                                auth = _context5.sent;

                                if (auth) {
                                    _context5.next = 15;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 15:

                                params.uid = this.getUid();

                                delete params.interface_id;
                                delete params.project_id;
                                delete params.col_id;

                                _context5.next = 21;
                                return this.caseModel.up(params.id, params);

                            case 21:
                                result = _context5.sent;
                                username = this.getUsername();

                                this.colModel.get(caseData.col_id).then(function (col) {
                                    _yapi2.default.commons.saveLog({
                                        content: '\u7528\u6237 "' + username + '" \u5728\u63A5\u53E3\u96C6 "' + col.name + '" \u66F4\u65B0\u4E86\u63A5\u53E3\u7528\u4F8B "' + params.casename + '"',
                                        type: 'project',
                                        uid: _this3.getUid(),
                                        username: username,
                                        typeid: caseData.project_id
                                    });
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);

                                _context5.next = 30;
                                break;

                            case 27:
                                _context5.prev = 27;
                                _context5.t0 = _context5['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                            case 30:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 27]]);
            }));

            function upCase(_x5) {
                return _ref5.apply(this, arguments);
            }

            return upCase;
        }()

        /**
         * 获取一个接口用例详情
         * @interface /col/case
         * @method GET
         * @category col
         * @foldnumber 10
         * @param {String} caseid
         * @returns {Object}
         * @example
         */

    }, {
        key: 'getCase',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx) {
                var id, result, data;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                id = ctx.query.caseid;
                                _context6.next = 4;
                                return this.caseModel.get(id);

                            case 4:
                                result = _context6.sent;

                                if (result) {
                                    _context6.next = 7;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '不存在的case'));

                            case 7:
                                result = result.toObject();
                                _context6.next = 10;
                                return this.interfaceModel.get(result.interface_id);

                            case 10:
                                data = _context6.sent;

                                result.path = data.path;
                                result.method = data.method;
                                result.req_body_type = data.req_body_type;
                                result.req_headers = data.req_headers;

                                result.req_body_form = this.handleParamsValue(data.req_body_form, result.req_body_form);
                                result.req_query = this.handleParamsValue(data.req_query, result.req_query);
                                result.req_params = this.handleParamsValue(data.req_params, result.req_params);

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 24;
                                break;

                            case 21:
                                _context6.prev = 21;
                                _context6.t0 = _context6['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 400, _context6.t0.message);

                            case 24:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 21]]);
            }));

            function getCase(_x6) {
                return _ref6.apply(this, arguments);
            }

            return getCase;
        }()
    }, {
        key: 'handleParamsValue',
        value: function handleParamsValue(params, val) {
            var value = {};
            if (params.length === 0 || val.length === 0) {
                return params;
            }
            val.forEach(function (item, index) {
                value[item.name] = item;
            });
            params.forEach(function (item, index) {
                params[index].value = value[item.name].value;
            });
            return params;
        }

        /**
         * 更新一个接口集name或描述
         * @interface /col/up_col
         * @method POST
         * @category col
         * @foldnumber 10
         * @param {String} name
         * @param {String} desc
         * @returns {Object}
         * @example
         */

    }, {
        key: 'upCol',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx) {
                var params, id, colData, auth, result, username;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;
                                params = ctx.request.body;
                                id = params.col_id;
                                _context7.next = 5;
                                return this.colModel.get(id);

                            case 5:
                                colData = _context7.sent;
                                _context7.next = 8;
                                return this.checkAuth(colData.project_id, 'project', 'edit');

                            case 8:
                                auth = _context7.sent;

                                if (auth) {
                                    _context7.next = 11;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 11:
                                _context7.next = 13;
                                return this.colModel.up(params.col_id, {
                                    name: params.name,
                                    desc: params.desc,
                                    up_time: _yapi2.default.commons.time()
                                });

                            case 13:
                                result = _context7.sent;
                                username = this.getUsername();

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u66F4\u65B0\u4E86\u63A5\u53E3\u96C6 "' + params.name + '" \u7684\u4FE1\u606F',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: colData.project_id
                                });
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 22;
                                break;

                            case 19:
                                _context7.prev = 19;
                                _context7.t0 = _context7['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 400, _context7.t0.message);

                            case 22:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 19]]);
            }));

            function upCol(_x7) {
                return _ref7.apply(this, arguments);
            }

            return upCol;
        }()

        /**
         * 更新多个接口case index
         * @interface /col/up_col_index
         * @method POST
         * @category col
         * @foldnumber 10
         * @param {Array}  [id, index]
         * @returns {Object}
         * @example
         */

    }, {
        key: 'upCaseIndex',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx) {
                var _this4 = this;

                var params;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                params = ctx.request.body;

                                if (!params || !Array.isArray(params)) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 400, "请求参数必须是数组");
                                }
                                // let caseName = "";
                                params.forEach(function (item) {
                                    if (item.id && item.index) {
                                        _this4.caseModel.upCaseIndex(item.id, item.index).then(function (res) {}, function (err) {
                                            _yapi2.default.commons.log(err.message, 'error');
                                        });
                                    }
                                });

                                // let username = this.getUsername();
                                // yapi.commons.saveLog({
                                //     content: `用户 "${username}" 更新了接口集 "${params.col_name}"`,
                                //     type: 'project',
                                //     uid: this.getUid(),
                                //     username: username,
                                //     typeid: params.project_id
                                // });

                                return _context8.abrupt('return', ctx.body = _yapi2.default.commons.resReturn('success'));

                            case 7:
                                _context8.prev = 7;
                                _context8.t0 = _context8['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 400, _context8.t0.message);

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 7]]);
            }));

            function upCaseIndex(_x8) {
                return _ref8.apply(this, arguments);
            }

            return upCaseIndex;
        }()

        /**
         * 删除一个接口集
         * @interface /col/del_col
         * @method GET
         * @category col
         * @foldnumber 10
         * @param {String}
         * @returns {Object}
         * @example
         */

    }, {
        key: 'delCol',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx) {
                var id, colData, auth, result, username;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                id = ctx.query.col_id;
                                _context9.next = 4;
                                return this.colModel.get(id);

                            case 4:
                                colData = _context9.sent;

                                if (!colData) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 400, "不存在的id");
                                }

                                if (!(colData.uid !== this.getUid())) {
                                    _context9.next = 12;
                                    break;
                                }

                                _context9.next = 9;
                                return this.checkAuth(colData.project_id, 'project', 'danger');

                            case 9:
                                auth = _context9.sent;

                                if (auth) {
                                    _context9.next = 12;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 12:
                                _context9.next = 14;
                                return this.colModel.del(id);

                            case 14:
                                result = _context9.sent;
                                _context9.next = 17;
                                return this.caseModel.delByCol(id);

                            case 17:
                                username = this.getUsername();

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u63A5\u53E3\u96C6 "' + colData.name + '" \u53CA\u5176\u4E0B\u9762\u7684\u63A5\u53E3',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: colData.project_id
                                });
                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(result));

                            case 22:
                                _context9.prev = 22;
                                _context9.t0 = _context9['catch'](0);

                                _yapi2.default.commons.resReturn(null, 400, _context9.t0.message);

                            case 25:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 22]]);
            }));

            function delCol(_x9) {
                return _ref9.apply(this, arguments);
            }

            return delCol;
        }()

        /**
         *
         * @param {*} ctx
         */

    }, {
        key: 'delCase',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(ctx) {
                var _this5 = this;

                var caseid, caseData, auth, result, username;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                caseid = ctx.query.caseid;
                                _context10.next = 4;
                                return this.caseModel.get(caseid);

                            case 4:
                                caseData = _context10.sent;

                                if (!caseData) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 400, "不存在的caseid");
                                }

                                if (!(caseData.uid !== this.getUid())) {
                                    _context10.next = 12;
                                    break;
                                }

                                _context10.next = 9;
                                return this.checkAuth(caseData.project_id, 'project', 'danger');

                            case 9:
                                auth = _context10.sent;

                                if (auth) {
                                    _context10.next = 12;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 12:
                                _context10.next = 14;
                                return this.caseModel.del(caseid);

                            case 14:
                                result = _context10.sent;
                                username = this.getUsername();

                                this.colModel.get(caseData.col_id).then(function (col) {
                                    _yapi2.default.commons.saveLog({
                                        content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u63A5\u53E3\u96C6 "' + col.name + '" \u4E0B\u7684\u63A5\u53E3 "' + caseData.casename + '"',
                                        type: 'project',
                                        uid: _this5.getUid(),
                                        username: username,
                                        typeid: caseData.project_id
                                    });
                                });

                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(result));

                            case 20:
                                _context10.prev = 20;
                                _context10.t0 = _context10['catch'](0);

                                _yapi2.default.commons.resReturn(null, 400, _context10.t0.message);

                            case 23:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 20]]);
            }));

            function delCase(_x10) {
                return _ref10.apply(this, arguments);
            }

            return delCase;
        }()
    }]);
    return interfaceColController;
}(_base2.default);

module.exports = interfaceColController;