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
        if (this.isNeedAutoIncrement() === true) {
            this.schema.plugin(_mongooseAutoIncrement2.default.plugin, {
                model: this.name,
                field: this.getPrimaryKey(),
                startAt: 101,
                incrementBy: _yapi2.default.commons.rand(1, 100)
            });
        }

        this.model = _yapi2.default.db(this.name, this.schema);
    }

    (0, _createClass3.default)(baseModel, [{
        key: 'isNeedAutoIncrement',
        value: function isNeedAutoIncrement() {
            return true;
        }

        /**
         * 可通过覆盖此方法生成其他自增字段
         */

    }, {
        key: 'getPrimaryKey',
        value: function getPrimaryKey() {
            return '_id';
        }

        /**
         * 获取collection的schema结构
         */

    }, {
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