import yapi from '../yapi.js'
import baseModel from './base.js'

class projectModel extends baseModel{
    getName(){
        return 'project'
    }

    getSchema(){
        return {
            uid: {type: Number, required: true},
            name: {type: String, required: true},
            basepath: {type: String, required: true},
            desc: String,
            group_id: {type: Number, required: true},
            members: Array,
            prd_host: {type: String, required: true},
            env: Object,
            add_time: Number,
            up_time: Number
        }
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }


    get(id){
        return this.model.findOne({
            _id: id
        }).exec()
    }

    checkNameRepeat(name){
        return this.model.count({
            name: name
        })
    }

    checkDomainRepeat(domain, basepath){
        return this.model.count({
            prd_host: domain,
            basepath: basepath
        })
    }


    list (group_id){
        return this.model.find({
            group_id: group_id
        }).exec()
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

    addMember(id, uid){
        console.log(id, uid)
        return this.model.update({
            _id: id
        }, {
            $push: {members: uid}
        })
    }

    delMember(id, uid){
        return this.model.update({
            _id: id
        }, {
            $pull: {members: uid}
        })
    }

    checkMemberRepeat(id, uid){
        return this.model.count({
            _id: id,
            members:[uid]
        })
    }

}

module.exports = projectModel;