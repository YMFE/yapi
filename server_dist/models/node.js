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

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeModel = function (_baseModel) {
    (0, _inherits3.default)(nodeModel, _baseModel);

    function nodeModel() {
        (0, _classCallCheck3.default)(this, nodeModel);
        return (0, _possibleConstructorReturn3.default)(this, (nodeModel.__proto__ || (0, _getPrototypeOf2.default)(nodeModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(nodeModel, [{
        key: 'getName',
        value: function getName() {
            return 'node';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                title: { type: String, required: true },
                content: { type: String, required: true },
                is_read: { type: Boolean, required: true },
                add_time: Number
            };
        }
    }, {
        key: 'save',
        value: function save(data) {
            var node = new this.model(data);
            return node.save();
        }
    }, {
        key: 'get',
        value: function get(id) {
            return this.model.findOne({
                _id: id
            }).exec();
        }
    }, {
        key: 'list',
        value: function list(uid) {
            return this.model.find({
                uid: uid
            }).exec();
        }
    }, {
        key: 'listWithPaging',
        value: function listWithPaging(uid, page, limit) {
            page = parseInt(page);
            limit = parseInt(limit);
            return this.model.find({
                uid: uid
            }).skip((page - 1) * limit).limit(limit).exec();
        }
    }, {
        key: 'listCount',
        value: function listCount(uid) {
            return this.model.count({
                uid: uid
            });
        }
    }, {
        key: 'del',
        value: function del(id) {
            return this.model.deleteOne({
                _id: id
            });
        }
    }, {
        key: 'up',
        value: function up(id, data) {
            data.up_time = _yapi2.default.commons.time();
            return this.model.update({
                _id: id
            }, data, { runValidators: true });
        }
    }]);
    return nodeModel;
}(_base2.default);

module.exports = nodeModel;