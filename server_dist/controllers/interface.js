'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _interfaceCat = require('../models/interfaceCat.js');

var _interfaceCat2 = _interopRequireDefault(_interfaceCat);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _project = require('../models/project.js');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interfaceController = function (_baseController) {
    (0, _inherits3.default)(interfaceController, _baseController);

    function interfaceController(ctx) {
        (0, _classCallCheck3.default)(this, interfaceController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (interfaceController.__proto__ || (0, _getPrototypeOf2.default)(interfaceController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_interface2.default);
        _this.catModel = _yapi2.default.getInst(_interfaceCat2.default);
        _this.projectModel = _yapi2.default.getInst(_project2.default);
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
     * @param {Array} [req_params] name, desc两个参数
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
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
                var params, auth, checkRepeat, data, result, username, cate;
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
                                    desc: 'string',
                                    catid: 'number'
                                });

                                _context.next = 4;
                                return this.checkAuth(params.project_id, 'project', 'edit');

                            case 4:
                                auth = _context.sent;

                                if (auth) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 7:
                                params.method = params.method || 'GET';
                                params.method = params.method.toUpperCase();
                                params.res_body_type = params.res_body_type ? params.res_body_type.toLowerCase() : 'json';

                                if (params.project_id) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 12:
                                if (params.path) {
                                    _context.next = 14;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口请求路径不能为空'));

                            case 14:
                                if (_yapi2.default.commons.verifyPath(params.path)) {
                                    _context.next = 16;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 16:
                                _context.next = 18;
                                return this.Model.checkRepeat(params.project_id, params.path, params.method);

                            case 18:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat > 0)) {
                                    _context.next = 21;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 21:
                                _context.prev = 21;
                                data = {
                                    project_id: params.project_id,
                                    catid: params.catid,
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


                                if (params.req_query) {
                                    data.req_query = params.req_query;
                                }

                                if (params.req_body_form) {
                                    data.req_body_form = params.req_body_form;
                                }
                                if (params.req_params && Array.isArray(params.req_params) && params.req_params.length > 0) {
                                    data.type = 'var';
                                    data.req_params = params.req_params;
                                } else {
                                    data.type = 'static';
                                }
                                if (params.req_body_other) {
                                    data.req_body_other = params.req_body_other;
                                }

                                _context.next = 29;
                                return this.Model.save(data);

                            case 29:
                                result = _context.sent;
                                username = this.getUsername();
                                // let project = await this.projectModel.get(params.project_id);

                                _context.next = 33;
                                return this.catModel.get(params.catid);

                            case 33:
                                cate = _context.sent;

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u4E3A\u5206\u7C7B "' + cate.name + '" \u6DFB\u52A0\u4E86\u63A5\u53E3 "' + data.title + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: params.project_id
                                });
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 41;
                                break;

                            case 38:
                                _context.prev = 38;
                                _context.t0 = _context['catch'](21);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 41:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[21, 38]]);
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
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
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
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(ctx) {
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
    }, {
        key: 'listByCat',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx) {
                var catid, result;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                catid = ctx.request.query.catid;

                                if (catid) {
                                    _context4.next = 3;
                                    break;
                                }

                                return _context4.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'catid不能为空'));

                            case 3:
                                _context4.prev = 3;
                                _context4.next = 6;
                                return this.Model.listByCatid(catid);

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

            function listByCat(_x4) {
                return _ref4.apply(this, arguments);
            }

            return listByCat;
        }()
    }, {
        key: 'listByMenu',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx) {
                var project_id, result, newResult, i, item, list, j;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                project_id = ctx.request.query.project_id;

                                if (project_id) {
                                    _context5.next = 3;
                                    break;
                                }

                                return _context5.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context5.prev = 3;
                                _context5.next = 6;
                                return this.catModel.list(project_id);

                            case 6:
                                result = _context5.sent;
                                newResult = [];
                                i = 0;

                            case 9:
                                if (!(i < result.length)) {
                                    _context5.next = 20;
                                    break;
                                }

                                item = result[i].toObject();
                                _context5.next = 13;
                                return this.Model.listByCatid(item._id, '_id title method path');

                            case 13:
                                list = _context5.sent;

                                for (j = 0; j < list.length; j++) {
                                    list[j] = list[j].toObject();
                                }
                                item.list = list;
                                newResult[i] = item;

                            case 17:
                                i++;
                                _context5.next = 9;
                                break;

                            case 20:
                                ctx.body = _yapi2.default.commons.resReturn(newResult);
                                _context5.next = 26;
                                break;

                            case 23:
                                _context5.prev = 23;
                                _context5.t0 = _context5['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context5.t0.message);

                            case 26:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[3, 23]]);
            }));

            function listByMenu(_x5) {
                return _ref5.apply(this, arguments);
            }

            return listByMenu;
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
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx) {
                var params, id, interfaceData, auth, checkRepeat, data, result, username, cate, inter;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                params = ctx.request.body;


                                params = _yapi2.default.commons.handleParams(params, {
                                    title: 'string',
                                    path: 'string',
                                    method: 'string',
                                    desc: 'string',
                                    catid: 'number'
                                });

                                params.method = params.method || 'GET';
                                params.method = params.method.toUpperCase();

                                id = ctx.request.body.id;

                                if (id) {
                                    _context6.next = 7;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 7:
                                _context6.next = 9;
                                return this.Model.get(id);

                            case 9:
                                interfaceData = _context6.sent;
                                _context6.next = 12;
                                return this.checkAuth(interfaceData.project_id, 'project', 'edit');

                            case 12:
                                auth = _context6.sent;

                                if (auth) {
                                    _context6.next = 15;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 15:
                                if (!(params.path && !_yapi2.default.commons.verifyPath(params.path))) {
                                    _context6.next = 17;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 17:
                                if (!(params.path && params.path !== interfaceData.path && params.method !== interfaceData.method)) {
                                    _context6.next = 23;
                                    break;
                                }

                                _context6.next = 20;
                                return this.Model.checkRepeat(interfaceData.project_id, params.path, params.method);

                            case 20:
                                checkRepeat = _context6.sent;

                                if (!(checkRepeat > 0)) {
                                    _context6.next = 23;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 23:
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

                                if (params.catid) {
                                    data.catid = params.catid;
                                }

                                if (params.req_headers) {
                                    data.req_headers = params.req_headers;
                                }

                                if (params.req_body_form) {
                                    data.req_body_form = params.req_body_form;
                                }
                                if (params.req_params && Array.isArray(params.req_params) && params.req_params.length > 0) {
                                    data.type = 'var';
                                    data.req_params = params.req_params;
                                } else {
                                    data.type = 'static';
                                }

                                if (params.req_query) {
                                    data.req_query = params.req_query;
                                }
                                if (params.req_body_other) {
                                    data.req_body_other = params.req_body_other;
                                }

                                if (params.req_body_type) {
                                    data.req_body_type = params.req_body_type;
                                }

                                if (params.res_body_type) {
                                    data.res_body_type = params.res_body_type;
                                }
                                if (params.res_body) {
                                    data.res_body = params.res_body;
                                }

                                if (params.status) {
                                    data.status = params.status;
                                }

                                _context6.prev = 38;
                                _context6.next = 41;
                                return this.Model.up(id, data);

                            case 41:
                                result = _context6.sent;
                                username = this.getUsername();
                                cate = void 0;

                                if (!params.catid) {
                                    _context6.next = 50;
                                    break;
                                }

                                _context6.next = 47;
                                return this.catModel.get(+params.catid);

                            case 47:
                                cate = _context6.sent;
                                _context6.next = 54;
                                break;

                            case 50:
                                _context6.next = 52;
                                return this.Model.get(id);

                            case 52:
                                inter = _context6.sent;

                                cate = interfaceData.catid;

                            case 54:

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u66F4\u65B0\u4E86\u5206\u7C7B "' + cate.name + '" \u4E0B\u7684\u63A5\u53E3 "' + data.title + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: cate.project_id
                                });
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 61;
                                break;

                            case 58:
                                _context6.prev = 58;
                                _context6.t0 = _context6['catch'](38);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 61:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[38, 58]]);
            }));

            function up(_x6) {
                return _ref6.apply(this, arguments);
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
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx) {
                var id, data, auth, inter, result, username, cate;
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

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 4:
                                _context7.next = 6;
                                return this.Model.get(ctx.request.body.id);

                            case 6:
                                data = _context7.sent;

                                if (!(data.uid != this.getUid())) {
                                    _context7.next = 13;
                                    break;
                                }

                                _context7.next = 10;
                                return this.checkAuth(data.project_id, 'project', 'danger');

                            case 10:
                                auth = _context7.sent;

                                if (auth) {
                                    _context7.next = 13;
                                    break;
                                }

                                return _context7.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 13:
                                _context7.next = 15;
                                return this.Model.get(id);

                            case 15:
                                inter = _context7.sent;
                                _context7.next = 18;
                                return this.Model.del(id);

                            case 18:
                                result = _context7.sent;
                                username = this.getUsername();
                                _context7.next = 22;
                                return this.catModel.get(inter.catid);

                            case 22:
                                cate = _context7.sent;

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u5206\u7C7B "' + cate.name + '" \u4E0B\u7684\u63A5\u53E3 "' + inter.title + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: cate.project_id
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 30;
                                break;

                            case 27:
                                _context7.prev = 27;
                                _context7.t0 = _context7['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context7.t0.message);

                            case 30:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 27]]);
            }));

            function del(_x7) {
                return _ref7.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'solveConflict',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx) {
                var _this2 = this;

                var id, result, userInst, userinfo, data;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                id = parseInt(ctx.query.id, 10), result = void 0, userInst = void 0, userinfo = void 0, data = void 0;

                                if (id) {
                                    _context8.next = 4;
                                    break;
                                }

                                return _context8.abrupt('return', ctx.websocket.send("id 参数有误"));

                            case 4:
                                _context8.next = 6;
                                return this.Model.get(id);

                            case 6:
                                result = _context8.sent;
                                userinfo;

                                if (!(result.edit_uid !== 0 && result.edit_uid !== this.getUid())) {
                                    _context8.next = 16;
                                    break;
                                }

                                userInst = _yapi2.default.getInst(_user2.default);
                                _context8.next = 12;
                                return userInst.findById(result.edit_uid);

                            case 12:
                                userinfo = _context8.sent;

                                data = {
                                    errno: result.edit_uid,
                                    data: { uid: result.edit_uid, username: userinfo.username }
                                };
                                _context8.next = 18;
                                break;

                            case 16:
                                this.Model.upEditUid(id, this.getUid()).then();
                                data = {
                                    errno: 0,
                                    data: result
                                };

                            case 18:
                                ctx.websocket.send((0, _stringify2.default)(data));
                                ctx.websocket.on('close', function () {
                                    _this2.Model.upEditUid(id, 0).then();
                                });
                                _context8.next = 25;
                                break;

                            case 22:
                                _context8.prev = 22;
                                _context8.t0 = _context8['catch'](0);

                                _yapi2.default.commons.log(_context8.t0, 'error');

                            case 25:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 22]]);
            }));

            function solveConflict(_x8) {
                return _ref8.apply(this, arguments);
            }

            return solveConflict;
        }()
    }, {
        key: 'addCat',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx) {
                var params, auth, result, username;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                params = ctx.request.body;

                                params = _yapi2.default.commons.handleParams(params, {
                                    name: 'string',
                                    project_id: 'number',
                                    desc: 'string'
                                });

                                if (params.project_id) {
                                    _context9.next = 5;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 5:
                                _context9.next = 7;
                                return this.checkAuth(params.project_id, 'project', 'edit');

                            case 7:
                                auth = _context9.sent;

                                if (auth) {
                                    _context9.next = 10;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 10:
                                if (params.name) {
                                    _context9.next = 12;
                                    break;
                                }

                                return _context9.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '名称不能为空'));

                            case 12:
                                _context9.next = 14;
                                return this.catModel.save({
                                    name: params.name,
                                    project_id: params.project_id,
                                    desc: params.desc,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                });

                            case 14:
                                result = _context9.sent;
                                username = this.getUsername();

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u6DFB\u52A0\u4E86\u5206\u7C7B "' + params.name + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: params.project_id
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);

                                _context9.next = 23;
                                break;

                            case 20:
                                _context9.prev = 20;
                                _context9.t0 = _context9['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context9.t0.message);

                            case 23:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 20]]);
            }));

            function addCat(_x9) {
                return _ref9.apply(this, arguments);
            }

            return addCat;
        }()
    }, {
        key: 'upCat',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(ctx) {
                var params, result, username, cate, auth;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                params = ctx.request.body;
                                _context10.next = 4;
                                return this.catModel.up(params.catid, {
                                    name: params.name,
                                    desc: params.desc,
                                    up_time: _yapi2.default.commons.time()
                                });

                            case 4:
                                result = _context10.sent;
                                username = this.getUsername();
                                _context10.next = 8;
                                return this.catModel.get(params.catid);

                            case 8:
                                cate = _context10.sent;
                                _context10.next = 11;
                                return this.checkAuth(cate.project_id, 'project', 'edit');

                            case 11:
                                auth = _context10.sent;

                                if (auth) {
                                    _context10.next = 14;
                                    break;
                                }

                                return _context10.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 14:
                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u66F4\u65B0\u4E86\u5206\u7C7B "' + cate.name + '"',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: cate.project_id
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context10.next = 21;
                                break;

                            case 18:
                                _context10.prev = 18;
                                _context10.t0 = _context10['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 400, _context10.t0.message);

                            case 21:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 18]]);
            }));

            function upCat(_x10) {
                return _ref10.apply(this, arguments);
            }

            return upCat;
        }()
    }, {
        key: 'delCat',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(ctx) {
                var id, catData, auth, cate, result, r, username;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.prev = 0;
                                id = ctx.request.body.catid;
                                _context11.next = 4;
                                return this.catModel.get(id);

                            case 4:
                                catData = _context11.sent;

                                if (!catData) {
                                    ctx.body = _yapi2.default.commons.resReturn(null, 400, "不存在的分类");
                                }

                                if (!(catData.uid !== this.getUid())) {
                                    _context11.next = 12;
                                    break;
                                }

                                _context11.next = 9;
                                return this.checkAuth(catData.project_id, 'project', 'danger');

                            case 9:
                                auth = _context11.sent;

                                if (auth) {
                                    _context11.next = 12;
                                    break;
                                }

                                return _context11.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 12:
                                _context11.next = 14;
                                return this.catModel.get(id);

                            case 14:
                                cate = _context11.sent;
                                _context11.next = 17;
                                return this.catModel.del(id);

                            case 17:
                                result = _context11.sent;
                                _context11.next = 20;
                                return this.Model.delByCatid(id);

                            case 20:
                                r = _context11.sent;
                                username = this.getUsername();


                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u5206\u7C7B "' + cate.name + '" \u53CA\u8BE5\u5206\u7C7B\u4E0B\u7684\u63A5\u53E3',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: cate.project_id
                                });

                                return _context11.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(r));

                            case 26:
                                _context11.prev = 26;
                                _context11.t0 = _context11['catch'](0);

                                _yapi2.default.commons.resReturn(null, 400, _context11.t0.message);

                            case 29:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 26]]);
            }));

            function delCat(_x11) {
                return _ref11.apply(this, arguments);
            }

            return delCat;
        }()
    }]);
    return interfaceController;
}(_base2.default);

module.exports = interfaceController;