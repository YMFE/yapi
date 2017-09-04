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

var interfaceCol = function (_baseModel) {
    (0, _inherits3.default)(interfaceCol, _baseModel);

    function interfaceCol() {
        (0, _classCallCheck3.default)(this, interfaceCol);
        return (0, _possibleConstructorReturn3.default)(this, (interfaceCol.__proto__ || (0, _getPrototypeOf2.default)(interfaceCol)).apply(this, arguments));
    }

    (0, _createClass3.default)(interfaceCol, [{
        key: 'getName',
        value: function getName() {
            return 'interface_col';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                name: { type: String, required: true },
                uid: { type: Number, required: true },
                project_id: { type: Number, required: true },
                desc: String,
                add_time: Number,
                up_time: Number
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
        key: 'checkRepeat',
        value: function checkRepeat(name) {
            return this.model.count({
                name: name
            });
        }
    }, {
        key: 'list',
        value: function list(project_id) {
            return this.model.find({
                project_id: project_id
            }).exec();
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
            data.up_time = yapi.commons.time();
            return this.model.update({
                _id: id
            }, data);
        }
    }]);
    return interfaceCol;
}(baseModel);

module.exports = interfaceCol;