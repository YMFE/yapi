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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userModel = function (_baseModel) {
    (0, _inherits3.default)(userModel, _baseModel);

    function userModel() {
        (0, _classCallCheck3.default)(this, userModel);
        return (0, _possibleConstructorReturn3.default)(this, (userModel.__proto__ || (0, _getPrototypeOf2.default)(userModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(userModel, [{
        key: 'getName',
        value: function getName() {
            return 'user';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                username: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                passsalt: String,
                role: String,
                add_time: Number,
                up_time: Number
            };
        }
    }, {
        key: 'save',
        value: function save(data) {
            var user = new this.model(data);
            return user.save();
        }
    }, {
        key: 'checkRepeat',
        value: function checkRepeat(email) {
            return this.model.count({
                email: email
            });
        }
    }, {
        key: 'list',
        value: function list() {
            return this.model.find().select("_id username email role  add_time up_time").exec(); //显示id name email role 
        }
    }, {
        key: 'listWithPaging',
        value: function listWithPaging(page, limit) {
            page = parseInt(page);
            limit = parseInt(limit);
            return this.model.find().skip((page - 1) * limit).limit(limit).select("_id username email role  add_time up_time").exec();
        }
    }, {
        key: 'listCount',
        value: function listCount() {
            return this.model.count();
        }
    }, {
        key: 'findByEmail',
        value: function findByEmail(email) {
            return this.model.findOne({ email: email });
        }
    }, {
        key: 'findById',
        value: function findById(id) {
            return this.model.findById({
                _id: id
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
        key: 'update',
        value: function update(id, data) {
            return this.model.update({
                _id: id
            }, data);
        }
    }, {
        key: 'search',
        value: function search(keyword) {
            return this.model.find({
                $or: [{ email: new RegExp(keyword, 'i') }, { username: new RegExp(keyword, 'i') }]
            }, {
                passsalt: 0,
                password: 0
            }).limit(10);
        }
    }]);
    return userModel;
}(_base2.default);

module.exports = userModel;