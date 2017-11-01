const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class projectModel extends baseModel {
    getName() {
        return 'project';
    }

    getSchema() {
        return {
            uid: {type: Number, required: true},
            name: {type: String, required: true},
            basepath: {type: String},
            desc: String,
            group_id: {type: Number, required: true},
            project_type: {type: String, required: true, enum: ['public', 'private']},
            members: [
                {uid: Number, role: {type: String, enum: ['owner', 'dev']}, username: String, email: String}
            ],
            env: [
                {name: String, domain: String}
            ],
            icon: String,
            color: String,
            add_time: Number,
            up_time: Number
        };
    }

    updateMember(data) {
        return this.model.update(
            {
                'members.uid': data.uid
            }, {
                "$set": {
                    "members.$.username": data.username,
                    "members.$.email": data.email
                }
            }
        );
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

    getProjectWithAuth(group_id, uid) {
        return this.model.count({
            "group_id": group_id,
            "members.uid": uid
        })
    }

    getBaseInfo(id) {
        return this.model.findOne({
            _id: id
        }).select('_id uid name basepath desc group_id project_type env icon color add_time up_time')
            .exec()
    }

    getByDomain(domain) {
        return this.model.find({
            prd_host: domain
        }).exec();
    }

    checkNameRepeat(name) {
        return this.model.count({
            name: name
        });
    }

    checkDomainRepeat(domain, basepath) {
        return this.model.count({
            prd_host: domain,
            basepath: basepath
        });
    }

    list(group_id) {
        let params = {group_id: group_id}
        return this.model.find(params).select("_id uid name basepath desc group_id project_type color icon env add_time up_time").sort({_id: -1}).exec();
    }

    // 获取项目数量统计
    getProjectListCount() {
        return this.model.count();
    }

    countWithPublic(group_id) {
        let params = {group_id: group_id, project_type: 'public'};
        return this.model.count(params);
    }

    listWithPaging(group_id, page, limit) {
        page = parseInt(page);
        limit = parseInt(limit);
        return this.model.find({
            group_id: group_id
        }).sort({_id: -1}).skip((page - 1) * limit).limit(limit).exec();
    }

    listCount(group_id) {
        return this.model.count({
            group_id: group_id
        });
    }

    countByGroupId(group_id) {
        return this.model.count({
            group_id: group_id
        });
    }

    del(id) {
        return this.model.remove({
            _id: id
        });
    }

    delByGroupid(groupId) {
        return this.model.remove({
            group_id: groupId
        })
    }

    up(id, data) {
        data.up_time = yapi.commons.time();
        return this.model.update({
            _id: id
        }, data, {runValidators: true});
    }

    addMember(id, data) {
        return this.model.update(
            {
                _id: id
            }, {
                // $push: { members: data }
                $push: {members: {$each: data}}
            }
        );
    }

    delMember(id, uid) {
        return this.model.update(
            {
                _id: id
            }, {
                $pull: {members: {uid: uid}}
            }
        );
    }

    checkMemberRepeat(id, uid) {
        return this.model.count({
            _id: id,
            "members.uid": uid
        });
    }

    changeMemberRole(id, uid, role) {
        return this.model.update(
            {
                _id: id,
                "members.uid": uid
            }, {
                "$set": {"members.$.role": role}
            }
        );
    }

    search(keyword) {
        return this.model.find({
            name: new RegExp(keyword, 'ig')
        })
            .limit(10);
    }

    download(id) {
        console.log('models in download');
        // return this.model.find({
        //     name: new RegExp(id, 'ig')
        // })
        //     .limit(10);
    }
}

module.exports = projectModel;
