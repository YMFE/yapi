import userModel from '../models/user.js'
import yapi from '../yapi.js'
import baseController from './base.js'

class userController extends baseController{
    constructor(){
        super()
        console.log('constructor...')
    }
    async login(ctx){   //登录
        var userInst = yapi.getInst(userModel); //创建user实体
        let username = ctx.request.body.username;
        let password = sha1(ctx.request.body.password);
        let id = ctx.request.body.id;
        let result = await userInst.getUser(id);  //获取登录用户的id
        if(!username){
            return ctx.body = yapi.commons.resReturn(null,400,'用户名不能为空');
        }
        if(!password){
            return ctx.body = yapi.commons.resReturn(null,400,'密码不能为空');
        }
        //输入一个不存在的用户名
        var checkRepeat = await userInst.checkRepeat(username);//然后检查是否已经存在该用户
        if(checkRepeat==0){
            return ctx.body = yapi.commons.resReturn(null,404,'该用户不存在');  //返回的错误码对吗？？？？
        }else if(result.password===password){    //用户名存在，判断密码是否正确，正确则可以登录
            console.log('密码一致');   //是不是还需要把用户名密码一些东西写到session
            
        }else{
             return ctx.body = yapi.commons.resReturn(null,400,'密码错误'); 
        }
    }
    async reg(ctx){  //注册
        var userInst = yapi.getInst(userModel); 
        let params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码
        if(!params.username){
            return ctx.body = yapi.commons.resReturn(null,400,'用户名不能为空');
        }
        if(!params.password){
            return ctx.body = yapi.commons.resReturn(null,400,'密码不能为空'); 
        }
        if(!params.email){
            return ctx.body = yapi.commons.resReturn(null,400,'邮箱不能为空'); 
        }
        
        var checkRepeat = await userInst.checkRepeat(params.username);//然后检查是否已经存在该用户
        if(checkRepeat>0){
            return ctx.body = yapi.commons.resReturn(null,401,'该用户名已经注册');
        }
        var checkRepeat = await userInst.checkRepeat(params.email);//然后检查是否已经存在该用户
        if(checkRepeat>0){
            return ctx.body = yapi.commons.resReturn(null,401,'该邮箱已经注册');
        }
        let data = {
            username: params.username,
            password: sha1(params.password),//加密
            email: params.email,
            role: params.role,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let user = await userInst.save(data);
            user = yapi.commons.fieldSelect(user,['id','username','password','email','role'])
            ctx.body = yapi.commons.resReturn(user);
        }catch(e){
            ctx.body = yapi.commons.resReturn(e.message);
        }
    }
    async list(ctx){  //获取用户列表并分页 
        var userInst = yapi.getInst(userModel);
        try{
            let user = await  userInst.list();
            return ctx.body = yapi.commons.resReturn(user);
        }catch(e){
            return ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    }
    async getUser(ctx){    //根据id获取用户信息
         try{
            var userInst = yapi.getInst(userModel);
            let id = ctx.request.body.id;
            let result = await userInst.getUser(id);
            return ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            return ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    }
    async del(ctx){   //根据id删除一个用户
        try{
            var userInst = yapi.getInst(userModel);
            let id = ctx.request.body.id;
            let result = await userInst.del(id);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    }
    async update(ctx){    //更新用户信息
        try{
            var userInst = yapi.getInst(userModel);
            let id = ctx.request.body.id;
            let data ={};
            ctx.request.body.username && (data.username = ctx.request.body.username)
            ctx.request.body.password && (data.password = ctx.request.body.password)
            ctx.request.body.email && (data.email = ctx.request.body.email)
            ctx.request.body.role && (data.role = ctx.request.body.role)
            if (Object.keys(data).length===0){
                 ctx.body = yapi.commons.resReturn(null,404,'用户名、密码、Email、role都为空');
            }
            let result = await userInst.update(id,data);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null,402,e.message);
        }
    }
}

module.exports = userController