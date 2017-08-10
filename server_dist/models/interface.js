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

var interfaceModel = function (_baseModel) {
    (0, _inherits3.default)(interfaceModel, _baseModel);

    function interfaceModel() {
        (0, _classCallCheck3.default)(this, interfaceModel);
        return (0, _possibleConstructorReturn3.default)(this, (interfaceModel.__proto__ || (0, _getPrototypeOf2.default)(interfaceModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(interfaceModel, [{
        key: 'getName',
        value: function getName() {
            return 'interface';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                title: { type: String, required: true },
                uid: { type: Number, required: true },
                path: { type: String, required: true },
                method: { type: String, required: true },
                project_id: { type: Number, required: true },
                desc: String,
                add_time: Number,
                up_time: Number,
                req_query: [{
                    name: String, value: String, desc: String, required: Boolean
                }],
                req_headers: [{
                    name: String, value: String, desc: String, required: Boolean
                }],
                req_params_type: {
                    type: String,
                    enum: ['form', 'json', 'text', 'xml']
                },
                req_params_form: [{
                    name: String, value: String, value_type: { type: String, enum: ['text', 'file'] }, desc: String, required: Boolean
                }],
                req_params_other: String,
                res_body_type: {
                    type: String,
                    enum: ['json', 'text', 'xml']
                },
                res_body: String
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
        key: 'getByPath',
        value: function getByPath(project_id, path, method) {
            return this.model.find({
                project_id: project_id,
                path: path,
                method: method
            }).exec();
        }
    }, {
        key: 'checkRepeat',
        value: function checkRepeat(id, path, method) {
            return this.model.count({
                project_id: id,
                path: path,
                method: method
            });
        }
    }, {
        key: 'countByProjectId',
        value: function countByProjectId(id) {
            return this.model.count({
                project_id: id
            });
        }
    }, {
        key: 'list',
        value: function list(project_id) {
            return this.model.find({
                project_id: project_id
            }).sort({ _id: -1 }).exec();
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
    return interfaceModel;
}(_base2.default);

module.exports = interfaceModel;