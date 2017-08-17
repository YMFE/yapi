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

var projectModel = function (_baseModel) {
    (0, _inherits3.default)(projectModel, _baseModel);

    function projectModel() {
        (0, _classCallCheck3.default)(this, projectModel);
        return (0, _possibleConstructorReturn3.default)(this, (projectModel.__proto__ || (0, _getPrototypeOf2.default)(projectModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(projectModel, [{
        key: 'getName',
        value: function getName() {
            return 'project';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                name: { type: String, required: true },
                basepath: { type: String },
                desc: String,
                group_id: { type: Number, required: true },
                project_type: { type: String, required: true, enum: ['public', 'private'] },
                members: [{ uid: Number, role: { type: String, enum: ['owner', 'dev'] }, username: String, email: String }],
                env: [{ name: String, domain: String }],
                icon: String,
                color: String,
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
        key: 'getByDomain',
        value: function getByDomain(domain) {
            return this.model.find({
                prd_host: domain
            }).exec();
        }
    }, {
        key: 'checkNameRepeat',
        value: function checkNameRepeat(name) {
            return this.model.count({
                name: name
            });
        }
    }, {
        key: 'checkDomainRepeat',
        value: function checkDomainRepeat(domain, basepath) {
            return this.model.count({
                prd_host: domain,
                basepath: basepath
            });
        }
    }, {
        key: 'list',
        value: function list(group_id, auth) {
            var params = { group_id: group_id };
            if (!auth) params.project_type = 'public';
            return this.model.find(params).select("_id uid name basepath desc group_id project_type color icon env add_time up_time").sort({ _id: -1 }).exec();
        }
    }, {
        key: 'listWithPaging',
        value: function listWithPaging(group_id, page, limit) {
            page = parseInt(page);
            limit = parseInt(limit);
            return this.model.find({
                group_id: group_id
            }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).exec();
        }
    }, {
        key: 'listCount',
        value: function listCount(group_id) {
            return this.model.count({
                group_id: group_id
            });
        }
    }, {
        key: 'countByGroupId',
        value: function countByGroupId(group_id) {
            return this.model.count({
                group_id: group_id
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
        key: 'delByGroupid',
        value: function delByGroupid(groupId) {
            return this.model.deleteMany({
                group_id: groupId
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
        key: 'checkMemberRepeat',
        value: function checkMemberRepeat(id, uid) {
            return this.model.count({
                _id: id,
                "members.uid": uid
            });
        }
    }, {
        key: 'changeMemberRole',
        value: function changeMemberRole(id, uid, role) {
            return this.model.update({
                _id: id,
                "members.uid": uid
            }, {
                "$set": { "members.$.uid": role }
            });
        }
    }, {
        key: 'search',
        value: function search(keyword) {
            return this.model.find({
                name: new RegExp(keyword, 'ig')
            }).limit(10);
        }
    }, {
        key: 'download',
        value: function download(id) {
            console.log('models in download');
            // return this.model.find({
            //     name: new RegExp(id, 'ig')
            // })
            //     .limit(10);
        }
    }]);
    return projectModel;
}(_base2.default);

module.exports = projectModel;