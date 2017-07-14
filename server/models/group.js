import yapi from '../yapi.js'
import mongoose from 'mongoose'
import baseModel from './base.js'

class groupModel extends baseModel{
    getName(){
        return 'group'
    }

    getSchema(){
        return {
            uid: Number,
            group_name: String,
            group_desc: String,
            add_time: Number,
            up_time: Number
        }
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }
    checkRepeat(name)  {
        return this.model.count({
            group_name: name
        })
    }
    list(){
        return this.model.find().select("group_name _id group_desc add_time up_time").exec()
    }
    del (id) {
        return this.model.deleteOne({
            _id: id
        })
    }
    up (id, data) {
        return this.model.update({
            _id: id,
        }, {
            group_name: data.group_name,
            group_desc: data.group_desc,
            up_time: yapi.commons.time()
        })
    }

    search(keyword) {
        return this.model.find({
            name: new RegExp(keyword, 'ig')
        })
        .limit(10)
    }

}


module.exports= groupModel