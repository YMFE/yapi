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

    (0, _createClass3.default)(logController, [{
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

                                ctx.body = _yapi2.default.commons.resReturn(null, 402, e.message);

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
    }]);
    return logController;
}(_base2.default);

module.exports = logController;