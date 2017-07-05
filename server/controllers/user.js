import userModel from '../models/user.js'
import yapi from '../yapi.js'

module.exports = {
    async login(ctx){
        let params = ctx.request.body;
        if(!params.user_name){
            return ctx.body = yapi.commons.resReturn(null,400,'用户名不能为空');
        }
        if(!params.user_pwd){
            return ctx.body = yapi.commons.resReturn(null,400,'密码不能为空');
        }
        //输入一个不存在的用户名

        //用户名存在，判断密码是否正确
        var checkRepeat = await userModel.checkRepeat(params.user_name);
        if(checkRepeat>0){
             let name = ctx.request.body.user_name;
        }
        
    },
    async add(ctx){  //增加一个用户，即注册
        let params = ctx.request.body; //获取请求的参数
        if(!params.user_name){
            return ctx.body = yapi.commons.resReturn(null,400,'用户名不能为空');
        }
        var checkRepeat = await userModel.checkRepeat(params.user_name);
        if(checkRepeat>0){
            return ctx.body = yapi.commons.resReturn(null,401,'用户已存在');
        }
        let data = {
            user_name: params.user_name,
            user_pwd: params.user_pwd,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let user = await userModel.save(data);
            user = yapi.commons.fieldSelect(user,['id','user_name','user_pwd'])
            ctx.body = yapi.commons.resReturn(user);
        }catch(e){
            ctx.body = yapi.commons.resReturn(e.message);
        }
    },
    async list(ctx){
        try{
            let user = await userModel.list();
            return ctx.body = yapi.commons.resReturn(user);
        }catch(e){
            return ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    },
    async del(ctx){
        try{
            let name = ctx.request.body.user_name;
            let result = await userModel.del(name);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    },
    async up(ctx){
        try{
            let id = ctx.request.body.id;
            let data ={};
            ctx.request.body.user_name && (data.user_name = ctx.request.body.user_name)
            ctx.request.body.user_pwd && (data.user_pwd = ctx.request.body.user_pwd)
            if (Object.keys(data).length===0){
                 ctx.body = yapi.commons.resReturn(null,404,'用户名和用户描述为空');
            }
            let result = await userModel.up(id,data);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    }
}