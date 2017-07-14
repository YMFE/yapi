import yapi from '../yapi.js'
import mongoose  from 'mongoose'
import baseModel from './base.js'

class userModel extends baseModel{
    getName(){
        return 'user'
    }

    getSchema(){
        return{
           username: String,
           password:{
               type:String,
               required: true
          },
           email: {
               type: String,
               required: true
           },
           passsalt: String,
           role: String,
           add_time: Number,
           up_time: Number 
        }
    }
    save(data){
        let user = new this.model(data);
        return user.save();
    }
    checkRepeat(email){
        return this.model.count({
            email: email
        })
    }
    list(){
        return this.model.find().select("_id username email role  add_time up_time").exec()  //显示id name email role 
    }
    findByEmail(email){
        return this.model.findOne({email: email})
    }
    findById(id){
        return this.model.findById({
            _id: id
        })
    }
    del (id) {
        return this.model.deleteOne({
            _id: id 
        })
    }
    update(id,data){
        return this.model.update({
            _id: id
        },{
            username: data.username,
            email: data.email,
            role: data.role,
            up_time: yapi.commons.time()
        })
    }
    search(keyword) {
        return this.model.find({
            $or: [
                { email: new RegExp(keyword, 'i') },
                { username: new RegExp(keyword, 'i')}
            ]
        }).limit(10)
    }

}

module.exports = userModel
