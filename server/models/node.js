import yapi from '../yapi.js';
import baseModel from './base.js';

class nodeModel extends baseModel {
    getName() {
        return 'node';
    }

    getSchema() {
        return {
            uid: {type: Number, required: true},
            title: {type: String, required: true},
            content: {type: String, required: true},
            is_read: {type: Boolean, required: true},
            add_time: Number
        }
    }

    save(data) {
        let node = new this.model(data);
        return node.save();
    }

    get(id){
        return this.model.findOne({
            _id: id
        }).exec()
    }

    list (uid){
        return this.model.find({
            uid: uid
        }).exec()
    }

    listWithPaging(uid, page, limit) {
        page = parseInt(page);
        limit = parseInt(limit);
        return this.model.find({
            uid: uid
        }).skip((page - 1) * limit).limit(limit).exec();
    }

    listCount(uid) {
        return this.model.count({
            uid: uid
        });
    }

    del(id){
        return this.model.deleteOne({
            _id: id
        })
    }
    up(id, data){
        data.up_time = yapi.commons.time();
        return this.model.update({
            _id: id,
        }, data, { runValidators: true })
    }
}

module.exports = nodeModel;