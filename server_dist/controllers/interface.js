'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _interfaceCase = require('../models/interfaceCase.js');

var _interfaceCase2 = _interopRequireDefault(_interfaceCase);

var _follow = require('../models/follow.js');

var _follow2 = _interopRequireDefault(_follow);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

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
        _this.caseModel = _yapi2.default.getInst(_interfaceCase2.default);
        _this.followModel = _yapi2.default.getInst(_follow2.default);
        _this.userModel = _yapi2.default.getInst(_user2.default);
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
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var _this2 = this;

                var params, auth, checkRepeat, data, paths, name, i, result;
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
                                params.req_params = params.req_params || [];
                                params.res_body_type = params.res_body_type ? params.res_body_type.toLowerCase() : 'json';

                                if (params.project_id) {
                                    _context.next = 13;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 13:
                                if (params.path) {
                                    _context.next = 15;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口请求路径不能为空'));

                            case 15:
                                if (_yapi2.default.commons.verifyPath(params.path)) {
                                    _context.next = 17;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 17:
                                _context.next = 19;
                                return this.Model.checkRepeat(params.project_id, params.path, params.method);

                            case 19:
                                checkRepeat = _context.sent;

                                if (!(checkRepeat > 0)) {
                                    _context.next = 22;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 22:
                                _context.prev = 22;
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

                                if (params.path.indexOf(":") > 0) {
                                    paths = params.path.split("/"), name = void 0, i = void 0;

                                    for (i = 1; i < paths.length; i++) {
                                        if (paths[i][0] === ':') {
                                            name = paths[i].substr(1);
                                            if (!_underscore2.default.find(params.req_params, { name: name })) {
                                                params.req_params.push({
                                                    name: name,
                                                    desc: ''
                                                });
                                            }
                                        }
                                    }
                                }

                                if (params.req_params.length > 0) {
                                    data.type = 'var';
                                    data.req_params = params.req_params;
                                } else {
                                    data.type = 'static';
                                }
                                if (params.req_body_other) {
                                    data.req_body_other = params.req_body_other;
                                }

                                _context.next = 31;
                                return this.Model.save(data);

                            case 31:
                                result = _context.sent;


                                this.catModel.get(params.catid).then(function (cate) {
                                    var username = _this2.getUsername();
                                    var title = '\u7528\u6237 "' + username + '" \u4E3A\u5206\u7C7B "' + cate.name + '" \u6DFB\u52A0\u4E86\u63A5\u53E3 "' + data.title + '"';
                                    _yapi2.default.commons.saveLog({
                                        content: title,
                                        type: 'project',
                                        uid: _this2.getUid(),
                                        username: username,
                                        typeid: params.project_id
                                    });
                                    //let project = await this.projectModel.getBaseInfo(params.project_id);
                                    // let interfaceUrl = `http://${ctx.request.host}/project/${params.project_id}/interface/api/${result._id}`
                                    // this.sendNotice(params.project_id, {
                                    //     title: `${username} 新增了接口 ${data.title}`,
                                    //     content: `<div><h3>${username}新增了接口(${data.title})</h3>
                                    //     <p>项目名：${project.name}</p>                    
                                    //     <p>修改用户: "${username}"</p>
                                    //     <p>接口名: <a href="${interfaceUrl}">${data.title}</a></p>
                                    //     <p>接口路径: [${data.method}]${data.path}</p></div>`
                                    // })
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context.next = 39;
                                break;

                            case 36:
                                _context.prev = 36;
                                _context.t0 = _context['catch'](22);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 39:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[22, 36]]);
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
    }, {
        key: 'listByCat',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx) {
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
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx) {
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
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx) {
                var _this3 = this;

                var params, id, interfaceData, auth, checkRepeat, data, result, username, cateid, project, interfaceUrl;
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


                                params.message = params.message || '';
                                params.message = params.message.replace(/\n/g, "<br>");

                                if (id) {
                                    _context6.next = 9;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口id不能为空'));

                            case 9:
                                _context6.next = 11;
                                return this.Model.get(id);

                            case 11:
                                interfaceData = _context6.sent;
                                _context6.next = 14;
                                return this.checkAuth(interfaceData.project_id, 'project', 'edit');

                            case 14:
                                auth = _context6.sent;

                                if (auth) {
                                    _context6.next = 17;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 17:
                                if (!(params.path && !_yapi2.default.commons.verifyPath(params.path))) {
                                    _context6.next = 19;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/'));

                            case 19:
                                if (!(params.path && (params.path !== interfaceData.path || params.method !== interfaceData.method))) {
                                    _context6.next = 25;
                                    break;
                                }

                                _context6.next = 22;
                                return this.Model.checkRepeat(interfaceData.project_id, params.path, params.method);

                            case 22:
                                checkRepeat = _context6.sent;

                                if (!(checkRepeat > 0)) {
                                    _context6.next = 25;
                                    break;
                                }

                                return _context6.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '已存在的接口:' + params.path + '[' + params.method + ']'));

                            case 25:
                                data = {
                                    up_time: _yapi2.default.commons.time()
                                };


                                if (!_underscore2.default.isUndefined(params.path)) {
                                    data.path = params.path;
                                }
                                if (!_underscore2.default.isUndefined(params.title)) {
                                    data.title = params.title;
                                }
                                if (!_underscore2.default.isUndefined(params.desc)) {
                                    data.desc = params.desc;
                                }
                                if (!_underscore2.default.isUndefined(params.method)) {
                                    data.method = params.method;
                                }

                                if (!_underscore2.default.isUndefined(params.catid)) {
                                    data.catid = params.catid;
                                }

                                if (!_underscore2.default.isUndefined(params.req_headers)) {
                                    data.req_headers = params.req_headers;
                                }

                                if (!_underscore2.default.isUndefined(params.req_body_form)) {
                                    data.req_body_form = params.req_body_form;
                                }
                                if (params.req_params && Array.isArray(params.req_params) && params.req_params.length > 0) {
                                    data.type = 'var';
                                    data.req_params = params.req_params;
                                } else {
                                    data.type = 'static';
                                    data.req_params = [];
                                }

                                if (!_underscore2.default.isUndefined(params.req_query)) {
                                    data.req_query = params.req_query;
                                }
                                if (!_underscore2.default.isUndefined(params.req_body_other)) {
                                    data.req_body_other = params.req_body_other;
                                }

                                if (!_underscore2.default.isUndefined(params.req_body_type)) {
                                    data.req_body_type = params.req_body_type;
                                }

                                if (!_underscore2.default.isUndefined(params.res_body_type)) {
                                    data.res_body_type = params.res_body_type;
                                }
                                if (!_underscore2.default.isUndefined(params.res_body)) {
                                    data.res_body = params.res_body;
                                }

                                if (!_underscore2.default.isUndefined(params.status)) {
                                    data.status = params.status;
                                }

                                _context6.prev = 40;
                                _context6.next = 43;
                                return this.Model.up(id, data);

                            case 43:
                                result = _context6.sent;
                                username = this.getUsername();

                                if (params.catid) {
                                    this.catModel.get(+params.catid).then(function (cate) {
                                        _yapi2.default.commons.saveLog({
                                            content: '\u7528\u6237 "' + username + '" \u66F4\u65B0\u4E86\u5206\u7C7B "' + cate.name + '" \u4E0B\u7684\u63A5\u53E3 "' + data.title + '"',
                                            type: 'project',
                                            uid: _this3.getUid(),
                                            username: username,
                                            typeid: cate.project_id
                                        });
                                    });
                                } else {
                                    cateid = interfaceData.catid;

                                    this.catModel.get(cateid).then(function (cate) {
                                        _yapi2.default.commons.saveLog({
                                            content: '\u7528\u6237 "' + username + '" \u66F4\u65B0\u4E86\u5206\u7C7B "' + cate.name + '" \u4E0B\u7684\u63A5\u53E3 "' + data.title + '"',
                                            type: 'project',
                                            uid: _this3.getUid(),
                                            username: username,
                                            typeid: cate.project_id
                                        });
                                    });
                                }

                                if (!(params.switch_notice === true)) {
                                    _context6.next = 52;
                                    break;
                                }

                                _context6.next = 49;
                                return this.projectModel.getBaseInfo(interfaceData.project_id);

                            case 49:
                                project = _context6.sent;
                                interfaceUrl = 'http://' + ctx.request.host + '/project/' + interfaceData.project_id + '/interface/api/' + id;

                                this.sendNotice(interfaceData.project_id, {
                                    title: username + ' \u66F4\u65B0\u4E86\u63A5\u53E3',
                                    content: '<div><h3>' + username + '\u66F4\u65B0\u4E86\u63A5\u53E3(' + data.title + ')</h3>\n                    <p>\u9879\u76EE\u540D\uFF1A' + project.name + ' </p>\n                    <p>\u4FEE\u6539\u7528\u6237: ' + username + '</p>\n                    <p>\u63A5\u53E3\u540D: <a href="' + interfaceUrl + '">' + data.title + '</a></p>\n                    <p>\u63A5\u53E3\u8DEF\u5F84: [' + data.method + ']' + data.path + '</p>\n                    <p>\u8BE6\u7EC6\u6539\u52A8\u65E5\u5FD7: ' + params.message + '</p></div>'
                                });

                            case 52:

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context6.next = 58;
                                break;

                            case 55:
                                _context6.prev = 55;
                                _context6.t0 = _context6['catch'](40);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context6.t0.message);

                            case 58:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[40, 55]]);
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
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx) {
                var _this4 = this;

                var id, data, auth, inter, result, username;
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
                                _context7.next = 21;
                                return this.caseModel.delByInterfaceId(id);

                            case 21:
                                username = this.getUsername();

                                this.catModel.get(inter.catid).then(function (cate) {
                                    _yapi2.default.commons.saveLog({
                                        content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u5206\u7C7B "' + cate.name + '" \u4E0B\u7684\u63A5\u53E3 "' + inter.title + '"',
                                        type: 'project',
                                        uid: _this4.getUid(),
                                        username: username,
                                        typeid: cate.project_id
                                    });
                                });

                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context7.next = 29;
                                break;

                            case 26:
                                _context7.prev = 26;
                                _context7.t0 = _context7['catch'](0);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context7.t0.message);

                            case 29:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 26]]);
            }));

            function del(_x7) {
                return _ref7.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'solveConflict',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx) {
                var _this5 = this;

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
                                    _this5.Model.upEditUid(id, 0).then();
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
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx) {
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
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(ctx) {
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
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(ctx) {
                var id, catData, auth, username, result, r;
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
                                username = this.getUsername();

                                _yapi2.default.commons.saveLog({
                                    content: '\u7528\u6237 "' + username + '" \u5220\u9664\u4E86\u5206\u7C7B "' + catData.name + '" \u53CA\u8BE5\u5206\u7C7B\u4E0B\u7684\u63A5\u53E3',
                                    type: 'project',
                                    uid: this.getUid(),
                                    username: username,
                                    typeid: catData.project_id
                                });

                                _context11.next = 16;
                                return this.catModel.del(id);

                            case 16:
                                result = _context11.sent;
                                _context11.next = 19;
                                return this.Model.delByCatid(id);

                            case 19:
                                r = _context11.sent;
                                return _context11.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(r));

                            case 23:
                                _context11.prev = 23;
                                _context11.t0 = _context11['catch'](0);

                                _yapi2.default.commons.resReturn(null, 400, _context11.t0.message);

                            case 26:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[0, 23]]);
            }));

            function delCat(_x11) {
                return _ref11.apply(this, arguments);
            }

            return delCat;
        }()

        /**
        * 接口数据上传
        * @interface /interface/interUpload
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

    }, {
        key: 'interUpload',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(ctx) {
                var _this6 = this;

                var interData, project_id, request, data1, catid, auth, len, successNum, i, path, reg, title, inter, _data, item, queryParams, _item, headerData, _item2, checkRepeat, data, res;

                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                interData = ctx.request.body.interData;
                                project_id = ctx.request.body.project_id;
                                request = interData.requests;
                                data1 = [];
                                catid = ctx.request.body.catid;
                                _context12.next = 7;
                                return this.checkAuth(project_id, 'project', 'danger');

                            case 7:
                                auth = _context12.sent;

                                if (auth) {
                                    _context12.next = 10;
                                    break;
                                }

                                return _context12.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '没有权限'));

                            case 10:
                                if (project_id) {
                                    _context12.next = 12;
                                    break;
                                }

                                return _context12.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 12:
                                if (catid) {
                                    _context12.next = 14;
                                    break;
                                }

                                return _context12.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '分类id不能为空'));

                            case 14:
                                len = request.length;
                                successNum = len;

                                if (!(request && len)) {
                                    _context12.next = 55;
                                    break;
                                }

                                i = 0;

                            case 18:
                                if (!(i < len)) {
                                    _context12.next = 55;
                                    break;
                                }

                                _context12.prev = 19;
                                path = _url2.default.parse(request[i].url.replace(/{{(\w+)}}/, '')).path;
                                reg = /^(\w+):\/\/([^\/:]*)(?::(\d+))?\/([^\/\?]*)(\/.*)/;
                                // let path = request[i].url;
                                // let result = path.match(reg);
                                // if(result){
                                //     path = result[4]+ result[5];
                                //     path = path.split('?')[0].replace(/{{(\w+)}}/,'').replace(/\/$/,'');
                                //     if(path.indexOf("/") > 0){
                                //         path = '/'+ path;
                                //     }
                                // }else{
                                //     // path.replace(/\{\{\ [0-9a-zA-Z-_]* }\}/g,'');
                                //     path = path.replace(/{{(\w+)}}/,'');
                                //     if(path.indexOf("/") > 0){
                                //         path = '/'+ path;
                                //     }
                                // }

                                title = request[i].name;

                                if (reg.test(request[i].name)) {
                                    title = path;
                                }
                                inter = {
                                    project_id: project_id,
                                    title: title,
                                    path: path,
                                    method: request[i].method,
                                    req_headers: '',
                                    // req_body_type: request[i].dataMode,
                                    req_params: '',
                                    req_body_form: '',
                                    req_body_other: '',
                                    res_body_type: 'json',
                                    res_body: '',
                                    desc: request[i].description
                                };

                                console.log(inter.path);
                                //  req_body_type   req_body_form
                                if (request[i].dataMode) {
                                    // console.log(i);
                                    if (request[i].dataMode === 'params' || request[i].dataMode === 'urlencoded') {
                                        inter.req_body_type = 'form';
                                        inter.req_body_form = [];
                                        _data = request[i].data;

                                        for (item in _data) {
                                            inter.req_body_form.push({
                                                name: _data[item].key,
                                                value: _data[item].value,
                                                type: _data[item].type
                                            });
                                        }
                                    } else if (request[i].dataMode === 'raw') {
                                        inter.req_body_form = [];
                                        // console.log(request[i].headers.inedxOf('application/json')>-1);
                                        if (request[i].headers && request[i].headers.indexOf('application/json') > -1) {
                                            inter.req_body_type = 'json';
                                        } else {
                                            inter.req_body_type = 'raw';
                                        }
                                        inter.req_body_other = request[i].rawModeData;
                                    } else if (request[i].dataMode === 'binary') {

                                        inter.req_body_type = 'file';
                                        inter.req_body_other = request[i].rawModeData;
                                    }
                                }
                                // req_params
                                if (request[i].queryParams) {
                                    inter.req_params = [];
                                    queryParams = request[i].queryParams;

                                    for (_item in queryParams) {
                                        inter.req_params.push({
                                            name: queryParams[_item].key,
                                            desc: queryParams[_item].description,
                                            required: queryParams[_item].enable
                                        });
                                    }
                                }

                                // req_headers
                                if (request[i].headerData) {
                                    inter.req_headers = [];
                                    headerData = request[i].headerData;

                                    for (_item2 in headerData) {
                                        inter.req_headers.push({
                                            name: headerData[_item2].key,
                                            value: headerData[_item2].value,
                                            required: headerData[_item2].enable,
                                            desc: headerData[_item2].description
                                        });
                                    }
                                }

                                if (inter.project_id) {
                                    _context12.next = 31;
                                    break;
                                }

                                return _context12.abrupt('continue', 52);

                            case 31:
                                if (inter.path) {
                                    _context12.next = 33;
                                    break;
                                }

                                return _context12.abrupt('continue', 52);

                            case 33:
                                if (_yapi2.default.commons.verifyPath(inter.path)) {
                                    _context12.next = 36;
                                    break;
                                }

                                successNum--;
                                // return ctx.body = yapi.commons.resReturn(null, 400, '接口path第一位必须是/，最后一位不能为/');
                                return _context12.abrupt('continue', 52);

                            case 36:
                                _context12.next = 38;
                                return this.Model.checkRepeat(inter.project_id, inter.path, inter.method);

                            case 38:
                                checkRepeat = _context12.sent;

                                if (!(checkRepeat > 0)) {
                                    _context12.next = 42;
                                    break;
                                }

                                successNum--;
                                // return ctx.body = yapi.commons.resReturn(null, 401, '已存在的接口:' + inter.path + '[' + inter.method + ']');
                                return _context12.abrupt('continue', 52);

                            case 42:
                                data = (0, _extends3.default)({}, inter, {
                                    catid: catid,
                                    uid: this.getUid(),
                                    add_time: _yapi2.default.commons.time(),
                                    up_time: _yapi2.default.commons.time()
                                });

                                if (data.req_params.length > 0) {
                                    data.type = 'var';
                                    data.req_params = data.req_params;
                                } else {
                                    data.type = 'static';
                                }
                                // data1.push(data);
                                // console.log(data);
                                _context12.next = 46;
                                return this.Model.save(data);

                            case 46:
                                res = _context12.sent;
                                _context12.next = 52;
                                break;

                            case 49:
                                _context12.prev = 49;
                                _context12.t0 = _context12['catch'](19);

                                // ctx.body = yapi.commons.resReturn(e.message);
                                successNum--;

                            case 52:
                                i++;
                                _context12.next = 18;
                                break;

                            case 55:

                                try {
                                    if (successNum) {
                                        this.catModel.get(catid).then(function (cate) {
                                            var username = _this6.getUsername();
                                            _yapi2.default.commons.saveLog({
                                                content: '\u7528\u6237 "' + username + '" \u4E3A\u5206\u7C7B "' + cate.name + '" \u6210\u529F\u5BFC\u5165\u4E86 ' + successNum + ' \u4E2A\u63A5\u53E3',
                                                type: 'project',
                                                uid: _this6.getUid(),
                                                username: username,
                                                typeid: project_id
                                            });
                                        });
                                    }
                                } catch (e) {}

                                return _context12.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(successNum));

                            case 57:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[19, 49]]);
            }));

            function interUpload(_x12) {
                return _ref12.apply(this, arguments);
            }

            return interUpload;
        }()
    }, {
        key: 'getCatMenu',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(ctx) {
                var project_id, res;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                project_id = ctx.request.query.project_id;

                                if (project_id) {
                                    _context13.next = 3;
                                    break;
                                }

                                return _context13.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 3:
                                _context13.prev = 3;
                                _context13.next = 6;
                                return this.catModel.list(project_id);

                            case 6:
                                res = _context13.sent;
                                return _context13.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(res));

                            case 10:
                                _context13.prev = 10;
                                _context13.t0 = _context13['catch'](3);

                                _yapi2.default.commons.resReturn(null, 400, _context13.t0.message);

                            case 13:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[3, 10]]);
            }));

            function getCatMenu(_x13) {
                return _ref13.apply(this, arguments);
            }

            return getCatMenu;
        }()
    }, {
        key: 'sendNotice',
        value: function sendNotice(projectId, data) {
            var _this7 = this;

            this.followModel.listByProjectId(projectId).then(function (list) {
                var users = [];
                list.forEach(function (item) {
                    users.push(item.uid);
                });
                _this7.userModel.findByUids(users).then(function (list) {
                    list.forEach(function (item) {
                        _yapi2.default.commons.sendMail({
                            to: item.email,
                            contents: data.content,
                            subject: data.title
                        });
                    });
                });
            });
        }
    }]);
    return interfaceController;
}(_base2.default);

module.exports = interfaceController;