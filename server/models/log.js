import yapi from '../yapi.js';
import baseModel from './base.js';
import userModel from '../models/user.js';

class logModel extends baseModel {
    getName() {
        return 'log';
    }

    getSchema() {
        return {
            uid: {type: Number, required: true},
            title: {type: String, required: true},
            type: {type: String, enum:['user', 'group', 'interface', 'project', 'other'], required: true},
            content: {type: String, required: true},
            username: {type: String, required: true},
            add_time: Number
        }
    }

    async save(data) {
        let userInst = yapi.getInst(userModel);
        let username = await userInst.findById(data.uid);
        let saveData = {
            title: data.title,
            content: data.content,
            type: data.type,
            uid: data.uid,
            username: username,
            add_time: yapi.commons.time()
        };
        let log = new this.model(saveData);
        return log.save();
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
}

module.exports = logModel;