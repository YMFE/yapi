'use strict';

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

        _this.Model = _yapi2.default.getInst(_interfaceCol2.default);
        return _this;
    }

    (0, _createClass3.default)(interfaceColController, [{
        key: 'list',
        value: function list(ctx) {}
    }, {
        key: 'up',
        value: function up(ctx) {}
    }, {
        key: 'del',
        value: function del(ctx) {}
    }]);
    return interfaceColController;
}(_base2.default);