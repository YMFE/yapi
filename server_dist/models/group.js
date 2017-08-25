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

var groupModel = function (_baseModel) {
    (0, _inherits3.default)(groupModel, _baseModel);

    function groupModel() {
        (0, _classCallCheck3.default)(this, groupModel);
        return (0, _possibleConstructorReturn3.default)(this, (groupModel.__proto__ || (0, _getPrototypeOf2.default)(groupModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(groupModel, [{
        key: 'getName',
        value: function getName() {
            return 'group';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: Number,
                group_name: String,
                group_desc: String,
                add_time: Number,
                up_time: Number,
                members: [{
                    uid: Number,
                    role: { type: String, enum: ['owner', 'dev'] },
                    username: String,
                    email: String
                }]
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
        key: 'getGroupById',
        value: function getGroupById(id) {
            return this.model.findOne({
                _id: id
            }).select("uid group_name group_desc add_time up_time").exec();
        }
    }, {
        key: 'checkRepeat',
        value: function checkRepeat(name) {
            return this.model.count({
                group_name: name
            });
        }
    }, {
        key: 'addMember',
        value: function addMember(id, data) {
            return this.model.update({
                _id: id
            }, {
                $push: { members: data }
            });
        }
    }, {
        key: 'delMember',
        value: function delMember(id, uid) {
            return this.model.update({
                _id: id
            }, {
                $pull: { members: { uid: uid } }
            });
        }
    }, {
        key: 'changeMemberRole',
        value: function changeMemberRole(id, uid, role) {
            return this.model.update({
                _id: id,
                "members.uid": uid
            }, {
                "$set": { "members.$.role": role }
            });
        }
    }, {
        key: 'checkMemberRepeat',
        value: function checkMemberRepeat(id, uid) {
            return this.model.count({
                _id: id,
                "members.uid": uid
            });
        }
    }, {
        key: 'list',
        value: function list() {
            return this.model.find().select('group_name _id group_desc add_time up_time').exec();
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
            return this.model.update({
                _id: id
            }, {
                group_name: data.group_name,
                group_desc: data.group_desc,
                up_time: _yapi2.default.commons.time()
            });
        }
    }, {
        key: 'search',
        value: function search(keyword) {
            return this.model.find({
                group_name: new RegExp(keyword, 'i')
            }).limit(10);
        }
    }]);
    return groupModel;
}(_base2.default);

module.exports = groupModel;