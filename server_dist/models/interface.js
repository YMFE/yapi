'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var interfaceSchema = new Schema({
    title: String,
    content: String,
    uid: String
});

var interfaceModel = _mongoose2.default.model('interface', interfaceSchema);

function save(data) {
    var m = new interfaceModel(data);
    return m.save();
}

function findById(id) {
    return interfaceModel.findOne({
        _id: id
    }, 'title content');
}

function find() {
    return interfaceModel.find({ title: 2222 }).exec();
}

module.exports = {
    save: save,
    findById: findById,
    find: find
};