'use strict';

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupSchema = {
    uid: String,
    group_name: String,
    group_desc: String,
    add_time: Number,
    up_time: Number
};

var groupModel = _yapi2.default.db('group', groupSchema);

module.exports = {
    save: function save(data) {
        var m = new groupModel(data);
        return m.save();
    },
    checkRepeat: function checkRepeat(name) {
        return groupModel.count({
            group_name: name
        });
    },
    list: function list() {
        return groupModel.find().select("group_name _id group_name group_desc add_time up_time").exec(); //增加了group_name
    },
    del: function del(id) {
        return groupModel.deleteOne({
            _id: id
        });
    },
    up: function up(id, data) {
        return groupModel.update({
            _id: id
        }, {
            group_name: data.group_name,
            group_desc: data.group_desc,
            up_time: _yapi2.default.commons.time()
        });
    }
};