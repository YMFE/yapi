'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('../yapi.js');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

/**
 * 所有的model都需要继承baseModel, 且需要 getSchema和getName方法，不然会报错
 */

var baseModel = function () {
    function baseModel() {
        (0, _classCallCheck3.default)(this, baseModel);

        this.schema = new mongoose.Schema(this.getSchema());
        this.name = this.getName();

        if (this.isNeedAutoIncrement() === true) {
            this.schema.plugin(autoIncrement.plugin, {
                model: this.name,
                field: this.getPrimaryKey(),
                startAt: 11,
                incrementBy: yapi.commons.rand(1, 10)
            });
        }

        this.model = yapi.db(this.name, this.schema);
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
            yapi.commons.log('Model Class need getSchema function', 'error');
        }
    }, {
        key: 'getName',
        value: function getName() {
            yapi.commons.log('Model Class need name', 'error');
        }
    }]);
    return baseModel;
}();

module.exports = baseModel;