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

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _follow = require('../models/follow');

var _follow2 = _interopRequireDefault(_follow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var followController = function (_baseController) {
    (0, _inherits3.default)(followController, _baseController);

    function followController(ctx) {
        (0, _classCallCheck3.default)(this, followController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (followController.__proto__ || (0, _getPrototypeOf2.default)(followController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_follow2.default);
        // try{
        //     var res = this.Model.save({
        //         uid: 107,
        //         projectid: 221,
        //         projectname: 'Flight',
        //         icon: 'code'
        //     });
        //     // var res = this.Model.del(107);
        //     ctx.body = yapi.commons.resReturn(null, 200,res);
        // }catch(err){
        //     ctx.body = yapi.commons.resReturn(null, 402, err.message);
        // }


        return _this;
    }

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

    (0, _createClass3.default)(followController, [{
        key: 'list',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var uid, page, limit, result, count;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                uid = ctx.request.query.uid, page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10;

                                if (uid) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户id不能为空'));

                            case 3:
                                _context.prev = 3;
                                _context.next = 6;
                                return this.Model.listWithPaging(uid, page, limit);

                            case 6:
                                result = _context.sent;
                                _context.next = 9;
                                return this.Model.listCount(uid);

                            case 9:
                                count = _context.sent;


                                ctx.body = _yapi2.default.commons.resReturn({
                                    total: Math.ceil(count / limit),
                                    list: result
                                });
                                _context.next = 16;
                                break;

                            case 13:
                                _context.prev = 13;
                                _context.t0 = _context['catch'](3);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 13]]);
            }));

            function list(_x) {
                return _ref.apply(this, arguments);
            }

            return list;
        }()
    }, {
        key: 'del',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
                var params, result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                params = ctx.request.body;

                                if (!params.followid) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '关注id不能为空'));

                            case 3:
                                _context2.prev = 3;
                                _context2.next = 6;
                                return this.Model.del(params.id);

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

            function del(_x2) {
                return _ref2.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'add',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
                var params, checkRepeat, data, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                params = ctx.request.body;

                                params = _yapi2.default.commons.handleParams(params, {
                                    uid: 'number',
                                    projectid: 'number',
                                    projectname: 'string',
                                    icon: 'string'
                                });

                                if (params.uid) {
                                    _context3.next = 4;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '用户id不为空'));

                            case 4:
                                if (params.projectid) {
                                    _context3.next = 6;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目id不能为空'));

                            case 6:
                                _context3.next = 8;
                                return this.Model.checkProjectRepeat(params.uid, params.projectid);

                            case 8:
                                checkRepeat = _context3.sent;

                                if (!checkRepeat) {
                                    _context3.next = 11;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 401, '项目已关注'));

                            case 11:
                                if (params.projectname) {
                                    _context3.next = 13;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目名不能为空'));

                            case 13:
                                if (params.icon) {
                                    _context3.next = 15;
                                    break;
                                }

                                return _context3.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, '项目图标标志不能为空'));

                            case 15:
                                data = {
                                    uid: params.uid,
                                    projectid: params.projectid,
                                    projectname: params.projectname,
                                    icon: params.icon
                                };
                                _context3.prev = 16;
                                _context3.next = 19;
                                return this.Model.save(data);

                            case 19:
                                result = _context3.sent;

                                result = _yapi2.default.commons.fieldSelect(result, ['_id', 'uid', 'projectid', 'projectname', 'icon']);
                                ctx.body = _yapi2.default.commons.resReturn(result);
                                _context3.next = 27;
                                break;

                            case 24:
                                _context3.prev = 24;
                                _context3.t0 = _context3['catch'](16);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context3.t0.message);

                            case 27:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[16, 24]]);
            }));

            function add(_x3) {
                return _ref3.apply(this, arguments);
            }

            return add;
        }()
    }]);
    return followController;
}(_base2.default);

module.exports = followController;