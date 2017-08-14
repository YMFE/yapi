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

var _interface = require('../models/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interfaceController = function (_baseController) {
    (0, _inherits3.default)(interfaceController, _baseController);

    function interfaceController(ctx) {
        (0, _classCallCheck3.default)(this, interfaceController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (interfaceController.__proto__ || (0, _getPrototypeOf2.default)(interfaceController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_interface2.default);
        return _this;
    }

    /**
     * 添加项目分组
     * @interface /interface/add
     * @method POST
     * @category interface
     * @foldnumber 10
     * @param {Number}   project_id 项目id，不能为空
     * @param {String}   title 接口标题，不能为空
     * @param {String}   path 接口请求路径，不能为空
     * @param {String}   method 请求方式
     * @param {Array}  [req_headers] 请求的header信息
     * @param {String}  [req_headers[].name] 请求的header信息名
     * @param {String}  [req_headers[].value] 请求的header信息值
     * @param {Boolean}  [req_headers[].required] 是否是必须，默认为否
     * @param {String}  [req_headers[].desc] header描述
     * @param {String}  [req_body_type] 请求参数方式，有["form", "json", "text", "xml"]四种
     * @param {Mixed}  [req_body_form] 请求参数,如果请求方式是form，参数是Array数组，其他格式请求参数是字符串
     * @param {String} [req_body_form[].name] 请求参数名
     * @param {String} [req_body_form[].value] 请求参数值，可填写生成规则（mock）。如@email，随机生成一条email
     * @param {String} [req_body_form[].type] 请求参数类型，有["text", "file"]两种
     * @param {String} [req_body_other]  非form类型的请求参数可保存到此字段
     * @param {String}  [res_body_type] 相应信息的数据格式，有["json", "text", "xml"]三种
     * @param {String} [res_body] 响应信息，可填写任意字符串，如果res_body_type是json,则会调用mock功能
     * @param  {String} [desc] 接口描述 
     * @returns {Object} 
     * @example ./api/interface/add.json
     */


    (0, _createClass3.default)(interfaceController, [{
        key: 'add',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var params, checkRepeat, data, result;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                params = ctx.request.body;


                                params = _yapi2.default.commons.handleParams(params, {
                                    project_id: 'number',
                                    title: 'string',
                                    path: 'string',
                                    method: 'string',
                                    desc: 'string'
                                });
                                params.method = params.method || 'GET';
                                params.method = params.method.toUpperCase();
                                params.res_body_type = params.res_body_type ? params.res_body_type.toLowerCase() : 'json';

                                if (params.project_id) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 7:
                                if (params.path) {
                                    _context.next = 9;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口请求路径不能为空'));

                            case 9:
                                if (_yapi2.default.commons.verifyPath(params.path)) {
                                    _context.next = 11;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 11:
                                _context.next = 13;
                                return this.Model.checkRepeat(params.project_id, params.path, params.method);

                            case 13:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat > 0)) {
                                    _context.next = 16;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 16:
                                _context.prev = 16;
                                data = {
                                    project_id: params.project_id,
                                    title: params.title,
                                    path: params.path,
                                    desc: params.desc,
                                    method: params.method,
                                    req_headers: params.req_headers,
                                    req_body_type: params.req_body_type,
                                    res_body: params.res_body,
                                    res_body_type: params.res_body_type,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                };


                                if (params.req_body_form) {
                                    data.req_body_form = params.req_body_form;
                                }
                                if (params.req_body_other) {
                                    data.req_body_other = params.req_body_other;
                                }

                                _context.next = 22;
                                return this.Model.save(data);

                            case 22:
                                result = _context.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 29;
                                break;

                            case 26:
                                _context.prev = 26;
                                _context.t0 = _context['catch'](16);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 29:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[16, 26]]);
            }));

            function add(_x) {
                return _ref.apply(this, arguments);
            }

            return add;
        }()

        /**
         * 添加项目分组
         * @interface /interface/get
         * @method GET
         * @category interface
         * @foldnumber 10
         * @param {Number}   id 接口id，不能为空
         * @returns {Object} 
         * @example ./api/interface/get.json
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

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

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
         * 接口列表
         * @interface /interface/list
         * @method GET
         * @category interface
         * @foldnumber 10
         * @param {Number}   project_id 项目id，不能为空
         * @returns {Object} 
         * @example ./api/interface/list.json
         */

    }, {
        key: 'list',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var project_id, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                project_id = ctx.request.query.project_id;

                                if (project_id) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context3.prev = 3;
                                _context3.next = 6;
                                return this.Model.list(project_id);

                            case 6:
                                result = _context3.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 13;
                                break;

                            case 10:
                                _context3.prev = 10;
                                _context3.t0 = _context3['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message);

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[3, 10]]);
            }));

            function list(_x3) {
                return _ref3.apply(this, arguments);
            }

            return list;
        }()

        /**
         * 编辑接口
         * @interface /interface/up
         * @method POST
         * @category interface
         * @foldnumber 10
         * @param {Number}   id 接口id，不能为空
         * @param {String}   [path] 接口请求路径
         * @param {String}   [method] 请求方式
         * @param {Array}  [req_headers] 请求的header信息
         * @param {String}  [req_headers[].name] 请求的header信息名
         * @param {String}  [req_headers[].value] 请求的header信息值
         * @param {Boolean}  [req_headers[].required] 是否是必须，默认为否
         * @param {String}  [req_headers[].desc] header描述
         * @param {String}  [req_body_type] 请求参数方式，有["form", "json", "text", "xml"]四种
         * @param {Mixed}  [req_body_form] 请求参数,如果请求方式是form，参数是Array数组，其他格式请求参数是字符串
         * @param {String} [req_body_form[].name] 请求参数名
         * @param {String} [req_body_form[].value] 请求参数值，可填写生成规则（mock）。如@email，随机生成一条email
         * @param {String} [req_body_form[].type] 请求参数类型，有["text", "file"]两种
         * @param {String} [req_body_other]  非form类型的请求参数可保存到此字段
         * @param {String}  [res_body_type] 相应信息的数据格式，有["json", "text", "xml"]三种
         * @param {String} [res_body] 响应信息，可填写任意字符串，如果res_body_type是json,则会调用mock功能
         * @param  {String} [desc] 接口描述 
         * @returns {Object} 
         * @example ./api/interface/up.json
         */

    }, {
        key: 'up',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
                var params, id, interfaceData, checkRepeat, data, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                params = ctx.request.body;


                                params = _yapi2.default.commons.handleParams(params, {
                                    title: 'string',
                                    path: 'string',
                                    method: 'string',
                                    desc: 'string'
                                });
                                params.method = params.method || 'GET';
                                params.method = params.method.toUpperCase();

                                id = ctx.request.body.id;

                                if (id) {
                                    _context4.next = 7;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 7:
                                _context4.next = 9;
                                return this.Model.get(id);

                            case 9:
                                interfaceData = _context4.sent;

                                if (!(params.path && !_yapi2.default.commons.verifyPath(params.path))) {
                                    _context4.next = 12;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 12:
                                if (!(params.path && params.path !== interfaceData.path && params.method !== interfaceData.method)) {
                                    _context4.next = 18;
                                    break;
                                }

                                _context4.next = 15;
                                return this.Model.checkRepeat(interfaceData.project_id, params.path, params.method);

                            case 15:
                                checkRepeat = _context4.sent;

                                if (!(checkRepeat > 0)) {
                                    _context4.next = 18;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 18:
                                data = {
                                    up_time: _yapi2.default.commons.time()
                                };


                                if (params.path) {
                                    data.path = params.path;
                                }
                                if (params.title) {
                                    data.title = params.title;
                                }
                                if (params.desc) {
                                    data.desc = params.desc;
                                }
                                if (params.method) {
                                    data.method = params.method;
                                }

                                if (params.req_headers) {
                                    data.req_headers = params.req_headers;
                                }

                                if (params.req_body_form) {
                                    data.req_body_form = params.req_body_form;
                                }
                                if (params.req_body_other) {
                                    data.req_body_other = params.req_body_other;
                                }

                                if (params.res_body_type) {
                                    data.res_body_type = params.res_body_type;
                                }
                                if (params.res_body) {
                                    data.res_body = params.res_body;
                                }

                                _context4.prev = 28;
                                _context4.next = 31;
                                return this.Model.up(id, data);

                            case 31:
                                result = _context4.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context4.next = 38;
                                break;

                            case 35:
                                _context4.prev = 35;
                                _context4.t0 = _context4['catch'](28);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context4.t0.message);

                            case 38:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[28, 35]]);
            }));

            function up(_x4) {
                return _ref4.apply(this, arguments);
            }

            return up;
        }()

        /**
         * 删除接口
         * @interface /interface/del
         * @method GET
         * @category interface
         * @foldnumber 10
         * @param {Number}   id 接口id，不能为空
         * @returns {Object} 
         * @example ./api/interface/del.json
         */

    }, {
        key: 'del',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
                var id, data, result;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                id = ctx.request.body.id;

                                if (id) {
                                    _context5.next = 4;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 4:
                                _context5.next = 6;
                                return this.Model.get(ctx.request.body.id);

                            case 6:
                                data = _context5.sent;

                                if (!(data.uid != this.getUid())) {
                                    _context5.next = 13;
                                    break;
                                }

                                _context5.next = 10;
                                return this.jungeProjectAuth(data.project_id);

                            case 10:
                                _context5.t0 = _context5.sent;

                                if (!(_context5.t0 !== true)) {
                                    _context5.next = 13;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 405, '没有权限'));

                            case 13:
                                _context5.next = 15;
                                return this.Model.del(id);

                            case 15:
                                result = _context5.sent;

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context5.next = 22;
                                break;

                            case 19:
                                _context5.prev = 19;
                                _context5.t1 = _context5['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t1.message);

                            case 22:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 19]]);
            }));

            function del(_x5) {
                return _ref5.apply(this, arguments);
            }

            return del;
        }()
    }]);
    return interfaceController;
}(_base2.default);

module.exports = interfaceController;