import yapi from '../yapi.js'
const groupSchema = ({
    uid: String,
    group_name: String,
    group_desc: String,
    add_time: Number,
    up_time: Number
})


var groupModel = yapi.db('group', groupSchema);    


function save(data){
    let m = new groupModel(data);
    return m.save();
}

function checkRepeat(name){
    return groupModel.count({
        group_name: name
    })    
}

function list(){
    return groupModel.list().exec()
}

module.exports = {   
    save: save,
    checkRepeat: checkRepeat,
    list: list
}   