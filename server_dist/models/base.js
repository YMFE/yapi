'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 所有的model都需要继承baseModel, 且需要 getSchema和getName方法，不然会报错
 */

var baseModel = function () {
    function baseModel() {
        (0, _classCallCheck3.default)(this, baseModel);

        this.schema = new _mongoose2.default.Schema(this.getSchema());
        this.name = this.getName();
        this.schema.plugin(_mongooseAutoIncrement2.default.plugin, this.name);
        this.model = _yapi2.default.db(this.name, this.schema);
    }

    /**
     * 获取collection的schema结构
     */

    (0, _createClass3.default)(baseModel, [{
        key: 'getSchema',
        value: function getSchema() {
            _yapi2.default.commons.log('Model Class need getSchema function', 'error');
        }
    }, {
        key: 'getName',
        value: function getName() {
            _yapi2.default.commons.log('Model Class need name', 'error');
        }
    }]);
    return baseModel;
}();

module.exports = baseModel;