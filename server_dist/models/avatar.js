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

var avatarModel = function (_baseModel) {
    (0, _inherits3.default)(avatarModel, _baseModel);

    function avatarModel() {
        (0, _classCallCheck3.default)(this, avatarModel);
        return (0, _possibleConstructorReturn3.default)(this, (avatarModel.__proto__ || (0, _getPrototypeOf2.default)(avatarModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(avatarModel, [{
        key: 'getName',
        value: function getName() {
            return 'avatar';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                basecode: String,
                type: String
            };
        }
    }, {
        key: 'get',
        value: function get(uid) {

            return this.model.findOne({
                uid: uid
            });
        }
    }, {
        key: 'up',
        value: function up(uid, basecode, type) {
            return this.model.update({
                uid: uid
            }, {
                type: type,
                basecode: basecode
            }, {
                upsert: true
            });
        }
    }]);
    return avatarModel;
}(_base2.default);

module.exports = avatarModel;