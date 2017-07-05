'use strict';

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectSchema = {
    uid: Number,
    name: String,
    basepath: String,
    desc: String,
    group_id: Number,
    members: Array,
    prd_host: String,
    env: Object,
    add_time: Number,
    up_time: Number
};

var projectModel = _yapi2.default.db('project', projectSchema);

module.exports = {
    save: function save(data) {
        var m = new projectModel(data);
        return m.save();
    },
    checkRepeat: function checkRepeat(name, basepath) {
        return projectModel.count({
            project_name: name,
            basepath: basepath
        });
    },
    list: function list() {
        return projectModel.find().exec();
    },
    del: function del(id) {
        return projectModel.deleteOne({
            _id: id
        });
    },
    up: function up(id, data) {
        data.up_time = _yapi2.default.commons.time();
        return projectModel.update({
            _id: id
        }, data);
    }
};