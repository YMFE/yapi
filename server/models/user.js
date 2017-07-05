import yapi from '../yapi.js'
const userSchema = {
    user_name: String,
    user_pwd: String,  
    add_time: Number,
    up_time: Number
}

var userModel = yapi.db('user',userSchema);

module.exports = {
    save: (data)=>{
        let user = new userModel(data);
        return user.save();
    },
    checkRepeat:(name)=>{
        return userModel.count({
            user_name: name
        })
    },
    list:()=>{
        return userModel.find().select("user_name_id user_name user_pwd add_time up_time").exec()
    },
    del:(name)=>{
        return userModel.find({"user_name":name}).remove()
    },
    up:(id,data)=>{
        return userModel.update({
            _id: id,
        },{
            user_name: data.user_name,
            user_pwd: data.user_pwd,
            up_time: yapi.commons.time()
        })
    }

}

