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

function save(data) {
    var m = new groupModel(data);
    return m.save();
}

function checkRepeat(name) {
    return groupModel.count({
        group_name: name
    });
}

function list() {
    return groupModel.list().exec();
}

module.exports = {
    save: save,
    checkRepeat: checkRepeat,
    list: list
};