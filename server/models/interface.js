import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const interfaceSchema = new Schema({
    title: String,
    content: String,
    uid: String
})

var interfaceModel = mongoose.model('interface', interfaceSchema);


function save(data){
    let m = new interfaceModel(data);
    return m.save();
}

function findById(id){
    return interfaceModel.findOne({
        _id: id
    }, 'title content')
}

function find(){
    return interfaceModel.find({title: 2222}).exec()
}

module.exports = {
    save: save,
    findById: findById,
    find: find
}