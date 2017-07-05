'use strict';

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = {
    user_name: String,
    user_pwd: String,
    add_time: Number,
    up_time: Number
};

var userModel = _yapi2.default.db('user', userSchema);

module.exports = {
    save: function save(data) {
        var user = new userModel(data);
        return user.save();
    },
    checkRepeat: function checkRepeat(name) {
        return userModel.count({
            user_name: name
        });
    },
    list: function list() {
        return userModel.find().select("user_name_id user_name user_pwd add_time up_time").exec();
    },
    del: function del(name) {
        return userModel.find({ "user_name": name }).remove();
    },
    up: function up(id, data) {
        return userModel.update({
            _id: id
        }, {
            user_name: data.user_name,
            user_pwd: data.user_pwd,
            up_time: _yapi2.default.commons.time()
        });
    }

};