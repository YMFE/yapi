import yapi from '../yapi.js'
const projectSchema = {
    uid: Number,
    name: String,
    basepath: String,
    desc: String,
    group_id: Number,
    members: Array,
    prd_host: String,
    env: Object,
    add_time: Number,
    up_time: Number
}


var projectModel = yapi.db('project', projectSchema);


module.exports = {
    save: (data) => {
        let m = new projectModel(data);
        return m.save();
    },
    checkRepeat: (name, basepath) => {
        return projectModel.count({
            project_name: name,
            basepath: basepath
        })
    },
    list: () => {
        return projectModel.find().exec()
    },
    del: (id) => {
        return projectModel.deleteOne({
            _id: id
        })
    },
    up: (id, data) => {
        data.up_time = yapi.commons.time();
        return projectModel.update({
            _id: id,
        }, data)
    }
}   