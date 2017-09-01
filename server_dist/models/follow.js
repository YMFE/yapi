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

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var followModel = function (_baseModel) {
    (0, _inherits3.default)(followModel, _baseModel);

    function followModel() {
        (0, _classCallCheck3.default)(this, followModel);
        return (0, _possibleConstructorReturn3.default)(this, (followModel.__proto__ || (0, _getPrototypeOf2.default)(followModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(followModel, [{
        key: 'getName',
        value: function getName() {
            return 'follow';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                projectid: { type: Number, required: true },
                projectname: { type: String, required: true },
                icon: String,
                color: String
            };
        }

        /**
         * @param {Number} uid 用户id
         * @param {Number} projectid 项目id
         * @param {String} projectname 项目名
         * @param {String} icon 项目图标
         */

    }, {
        key: 'save',
        value: function save(data) {
            //关注
            var saveData = {
                uid: data.uid,
                projectid: data.projectid,
                projectname: data.projectname,
                icon: data.icon,
                color: data.color
            };
            var follow = new this.model(saveData);
            return follow.save();
        }
    }, {
        key: 'del',
        value: function del(projectid, uid) {
            return this.model.deleteOne({
                projectid: projectid,
                uid: uid
            });
        }
    }, {
        key: 'list',
        value: function list(uid) {
            return this.model.find({
                uid: uid
            }).exec();
        }
    }, {
        key: 'listByProjectId',
        value: function listByProjectId(projectid) {
            return this.model.find({
                projectid: projectid
            });
        }
    }, {
        key: 'checkProjectRepeat',
        value: function checkProjectRepeat(uid, projectid) {
            return this.model.count({
                uid: uid,
                projectid: projectid
            });
        }
    }, {
        key: 'updateById',
        value: function updateById(id, typeid, data) {

            return this.model.update({
                uid: id,
                projectid: typeid
            }, data, { runValidators: true });
        }
    }]);
    return followModel;
}(_base2.default);

module.exports = followModel;