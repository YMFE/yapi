import yapi from '../yapi.js';
import baseModel from './base.js';
// import userModel from '../models/user.js';

class logModel extends baseModel {
    getName() {
        return 'log';
    }

    getSchema() {
        return {
            uid: { type: Number, required: true },
            groupid: { type: Number, required: true },
            type: { type: String,enum:['user', 'group', 'interface','project', 'other', 'interface_col'], required: true },
            content: { type: String, required: true },
            username: { type: String, required: true },
            add_time: Number
        };
    }

    /**
     * @param {String} content log内容
     * @param {Enum} type log类型， ['user', 'group', 'interface', 'project', 'other']
     * @param {Number} uid 用户id
     */
    save(data) {
        let saveData = {
            content: data.content,
            type: data.type,
            uid: data.uid,
            username: data.username,
            groupid: data.groupid,
            add_time: yapi.commons.time()
        };
        let log = new this.model(saveData);

        return log.save();
    }
    
    del(id) {
        return this.model.deleteOne({
            _id: id
        });
    }

    list(groupid) {
        return this.model.find({
            groupid: groupid
        })
            .exec();
    }
    

    listWithPaging(groupid, page, limit) {
        page = parseInt(page);
        limit = parseInt(limit);

        return this.model.find({
            groupid: groupid
        }).skip((page - 1) * limit).limit(limit).exec();
    }

    listCount(groupid) {
        return this.model.count({
            groupid: groupid
        });
    }
}

module.exports = logModel;