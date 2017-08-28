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

var _log = require('../models/log.js');

var _log2 = _interopRequireDefault(_log);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _group = require('../models/group');

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logController = function (_baseController) {
    (0, _inherits3.default)(logController, _baseController);

    function logController(ctx) {
        (0, _classCallCheck3.default)(this, logController);

        var _this = (0, _possibleConstructorReturn3.default)(this, (logController.__proto__ || (0, _getPrototypeOf2.default)(logController)).call(this, ctx));

        _this.Model = _yapi2.default.getInst(_log2.default);
        _this.groupModel = _yapi2.default.getInst(_group2.default);
        return _this;
    }

    /**
     * 获取动态列表
     * @interface /log/list
     * @method GET
     * @category log
     * @foldnumber 10
     * @param {Number} typeid 动态类型id， 不能为空
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小
     * @returns {Object}
     * @example /log/list
     */

    (0, _createClass3.default)(logController, [{
        key: 'list',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
                var typeid, page, limit, type, result, count;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                typeid = ctx.request.query.typeid, page = ctx.request.query.page || 1, limit = ctx.request.query.limit || 10, type = ctx.request.query.type;

                                if (typeid) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'typeid不能为空'));

                            case 3:
                                if (type) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', ctx.body = _yapi2.default.commons.resReturn(null, 400, 'type不能为空'));

                            case 5:
                                _context.prev = 5;
                                _context.next = 8;
                                return this.Model.listWithPaging(typeid, type, page, limit);

                            case 8:
                                result = _context.sent;
                                _context.next = 11;
                                return this.Model.listCount(typeid, type);

                            case 11:
                                count = _context.sent;


                                ctx.body = _yapi2.default.commons.resReturn({
                                    total: Math.ceil(count / limit),
                                    list: result
                                });
                                _context.next = 18;
                                break;

                            case 15:
                                _context.prev = 15;
                                _context.t0 = _context['catch'](5);

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, _context.t0.message);

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 15]]);
            }));

            function list(_x) {
                return _ref.apply(this, arguments);
            }

            return list;
        }()
    }]);
    return logController;
}(_base2.default);

module.exports = logController;