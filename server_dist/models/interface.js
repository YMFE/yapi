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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('../yapi.js');
var baseModel = require('./base.js');

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
                catid: { type: Number, required: true },
                edit_uid: { type: Number, default: 0 },
                status: { type: String, enum: ['undone', 'done'], default: 'undone' },
                desc: String,
                add_time: Number,
                up_time: Number,
                type: { type: String, enum: ['static', 'var'], default: 'static' },
                req_query: [{
                    name: String, value: String, desc: String, required: {
                        type: String,
                        enum: ["1", "0"],
                        default: "1"
                    }
                }],
                req_headers: [{
                    name: String, value: String, desc: String, required: {
                        type: String,
                        enum: ["1", "0"],
                        default: "1"
                    }
                }],
                req_params: [{
                    name: String,
                    desc: String
                }],
                req_body_type: {
                    type: String,
                    enum: ['form', 'json', 'text', 'file', 'raw']
                },
                req_body_form: [{
                    name: String, type: { type: String, enum: ['text', 'file'] }, desc: String, required: {
                        type: String,
                        enum: ["1", "0"],
                        default: "1"
                    }
                }],
                req_body_other: String,
                res_body_type: {
                    type: String,
                    enum: ['json', 'text', 'xml', 'raw']
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
        key: 'getBaseinfo',
        value: function getBaseinfo(id) {
            return this.model.findOne({
                _id: id
            }).select('path method uid title project_id cat_id status').exec();
        }
    }, {
        key: 'getVar',
        value: function getVar(project_id, method) {
            return this.model.find({
                type: 'var',
                method: method
            }).select('_id path').exec();
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
        value: function list(project_id, select) {
            select = select || '_id title uid path method project_id catid edit_uid status desc add_time up_time';
            return this.model.find({
                project_id: project_id
            }).select(select).sort({ _id: -1 }).exec();
        }
    }, {
        key: 'listByCatid',
        value: function listByCatid(catid, select) {
            select = select || '_id title uid path method project_id catid edit_uid status desc add_time up_time';
            return this.model.find({
                catid: catid
            }).select(select).exec();
        }
    }, {
        key: 'del',
        value: function del(id) {
            return this.model.deleteOne({
                _id: id
            });
        }
    }, {
        key: 'delByCatid',
        value: function delByCatid(id) {
            return this.model.deleteMany({
                catid: id
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
            data.up_time = yapi.commons.time();
            return this.model.update({
                _id: id
            }, data, { runValidators: true });
        }
    }, {
        key: 'upEditUid',
        value: function upEditUid(id, uid) {
            return this.model.update({
                _id: id
            }, { edit_uid: uid }, { runValidators: true });
        }
    }]);
    return interfaceModel;
}(baseModel);

module.exports = interfaceModel;