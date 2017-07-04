import yapi from '../yapi.js'
const groupSchema = {
    uid: String,
    group_name: String,
    group_desc: String,
    add_time: Number,
    up_time: Number
}


var groupModel = yapi.db('group', groupSchema);


module.exports = {
    save: (data) => {
        let m = new groupModel(data);
        return m.save();
    },
    checkRepeat: (name) => {
        return groupModel.count({
            group_name: name
        })
    },
    list: () => {
        return groupModel.find().select("group_name _id group_desc add_time up_time").exec()
    },
    del: (id) => {
        return groupModel.deleteOne({
            _id: id
        })
    },
    up: (id, data) => {
        return groupModel.update({
            _id: id,
        }, {
            group_name: data.group_name,
            group_desc: data.group_desc,
            up_time: yapi.commons.time()
        })
    }
}   