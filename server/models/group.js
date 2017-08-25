import yapi from '../yapi.js';
import baseModel from './base.js';

class groupModel extends baseModel {
    getName() {
        return 'group';
    }

    getSchema() {
        return {
            uid: Number,
            group_name: String,
            group_desc: String,
            add_time: Number,
            up_time: Number,
            members: [
                {
                    uid: Number,
                    role: {type: String, enum:['owner', 'dev']},
                    username: String,
                    email: String
                }
            ]
        };
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }

    get(id) {
        return this.model.findOne({
            _id: id
        }).exec();
    }

    getGroupById(id) {
        return this.model.findOne({
            _id: id
        }).select("uid group_name group_desc add_time up_time").exec();
    }

    checkRepeat(name) {
        return this.model.count({
            group_name: name
        });
    }

    addMember(id, data){
        return this.model.update(
            {
                _id: id
            }, {
                $push: { members: data }
            }
        );
    }

    delMember(id, uid) {
        return this.model.update(
            {
                _id: id
            }, {
                $pull: { members: {uid: uid} }
            }
        );
    }

    changeMemberRole(id, uid, role) {
        return this.model.update(
            {
                _id: id,
                 "members.uid": uid
            }, {
                "$set": { "members.$.role": role}
            }
        );
    }

    checkMemberRepeat(id, uid){
        return this.model.count({
            _id: id,
            "members.uid": uid
        });
    }

    list() {
        return this.model.find().select('group_name _id group_desc add_time up_time').exec();
    }

    del(id) {
        return this.model.deleteOne({
            _id: id
        });
    }

    up(id, data) {
        return this.model.update(
            {
                _id: id
            }, {
                group_name: data.group_name,
                group_desc: data.group_desc,
                up_time: yapi.commons.time()
            }
        );
    }

    search(keyword) {
        return this.model.find({
            group_name: new RegExp(keyword, 'i')
        })
            .limit(10);
    }
}

module.exports = groupModel;
