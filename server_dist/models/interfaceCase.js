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

var interfaceCase = function (_baseModel) {
    (0, _inherits3.default)(interfaceCase, _baseModel);

    function interfaceCase() {
        (0, _classCallCheck3.default)(this, interfaceCase);
        return (0, _possibleConstructorReturn3.default)(this, (interfaceCase.__proto__ || (0, _getPrototypeOf2.default)(interfaceCase)).apply(this, arguments));
    }

    (0, _createClass3.default)(interfaceCase, [{
        key: 'getName',
        value: function getName() {
            return 'interface_case';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                casename: { type: String, required: true },
                uid: { type: Number, required: true },
                col_id: { type: Number, required: true },
                index: { type: Number, default: 0 },
                project_id: { type: Number, required: true },
                add_time: Number,
                up_time: Number,
                env: { type: String },
                domain: { type: String },
                path: { type: String },
                method: { type: String },
                req_params: [{
                    name: String, value: String
                }],
                req_query: [{
                    name: String, value: String
                }],
                req_headers: [{
                    name: String, value: String
                }],
                req_body_type: {
                    type: String,
                    enum: ['form', 'json', 'text', 'xml']
                },
                res_body_form: [{
                    name: String, value: String
                }],
                res_body_other: String

            };
        }
    }, {
        key: 'save',
        value: function save(data) {
            var m = new this.model(data);
            return m.save();
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
        value: function list(col_id) {
            return this.model.find({
                col_id: col_id
            }).select("casename uid col_id _id index").exec();
        }
    }, {
        key: 'del',
        value: function del(id) {
            return this.model.deleteOne({
                _id: id
            });
        }
    }, {
        key: 'delByProjectId',
        value: function delByProjectId(id) {
            return this.model.deleteMany({
                project_id: id
            });
        }
    }, {
        key: 'up',
        value: function up(id, data) {
            data.up_time = _yapi2.default.commons.time();
            return this.model.update({ _id: id }, data);
        }
    }, {
        key: 'upCaseIndex',
        value: function upCaseIndex(id, index) {
            return this.model.update({
                _id: id
            }, {
                index: index
            });
        }
    }]);
    return interfaceCase;
}(_base2.default);

module.exports = interfaceCase;