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

// import userModel from '../models/user.js';

var logModel = function (_baseModel) {
    (0, _inherits3.default)(logModel, _baseModel);

    function logModel() {
        (0, _classCallCheck3.default)(this, logModel);
        return (0, _possibleConstructorReturn3.default)(this, (logModel.__proto__ || (0, _getPrototypeOf2.default)(logModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(logModel, [{
        key: 'getName',
        value: function getName() {
            return 'log';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                typeid: { type: Number, required: true },
                type: { type: String, enum: ['user', 'group', 'interface', 'project', 'other', 'interface_col'], required: true },
                content: { type: String, required: true },
                username: { type: String, required: true },
                add_time: Number
            };
        }

        /**
         * @param {String} content log内容
         * @param {Enum} type log类型， ['user', 'group', 'interface', 'project', 'other']
         * @param {Number} uid 用户id
         * @param {String} username 用户名
         * @param {Number} typeid 类型id
         * @param {Number} add_time 时间
         */

    }, {
        key: 'save',
        value: function save(data) {
            var saveData = {
                content: data.content,
                type: data.type,
                uid: data.uid,
                username: data.username,
                typeid: data.typeid,
                add_time: _yapi2.default.commons.time()
            };
            var log = new this.model(saveData);

            return log.save();
        }
    }, {
        key: 'del',
        value: function del(id) {
            return this.model.deleteOne({
                _id: id
            });
        }
    }, {
        key: 'list',
        value: function list(typeid, type) {
            return this.model.find({
                typeid: typeid,
                type: type
            }).exec();
        }
    }, {
        key: 'listWithPaging',
        value: function listWithPaging(typeid, type, page, limit) {
            page = parseInt(page);
            limit = parseInt(limit);

            return this.model.find({
                type: type,
                typeid: typeid
            }).sort({ add_time: -1 }).skip((page - 1) * limit).limit(limit).exec();
        }
    }, {
        key: 'listCount',
        value: function listCount(typeid, type) {
            return this.model.count({
                typeid: typeid,
                type: type
            });
        }
    }]);
    return logModel;
}(_base2.default);

module.exports = logModel;