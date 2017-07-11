import userModel from '../models/user.js'
import yapi from '../yapi.js'
import baseController from './base.js'
import mongoose from 'mongoose'

const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

class userController extends baseController{
    constructor(ctx){
        super(ctx)
        console.log('constructor...')
    }
    /**
     * 添加项目分组
     * @interface /user/login
     * @method POST
     * @category user
     * @foldnumber 10
     * @param {String} username 用户名称，不能为空
     * @param  {String} password 密码，不能为空
     * @returns {Object} 
     * @example ./api/user/login.json
     */
    async login(ctx){   //登录
        var userInst = yapi.getInst(userModel); //创建user实体
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        let result = await userInst.findByName(username);

        var token = jwt.sign(result._id,'qunar',{expiresIn: 24 * 60 * 60  /* 1 days */});
       console.log(token);
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
        }else if(sha1(result.password)===password){    //用户名存在，判断密码是否正确，正确则可以登录
            console.log('密码一致');   //是不是还需要把用户名密码一些东西写到session

        //生成一个新的token,并存到数据库
       // var token = jwt.sign(result._id,'qunar',{expiresIn: 24 * 60 * 60  /* 1 days */});
       // console.log(token);
        //result.token = token;
            // setCookie('token', sha1(username+password));
            // userInst.update({_id, result._id}, {token: sha1(username+password)})
            // return ctx.body = {username: ''}
            return ctx.body = yapi.commons.resReturn(null,200,'ok'); 
        }else{
             return ctx.body = yapi.commons.resReturn(null,400,'密码错误'); 
        }
    }



    async reg(ctx){  //注册
        var userInst = yapi.getInst(userModel); 
        let params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码
        //let result = await userInst.findByName(params.username);
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

        //var token = jwt.sign(result._id,'qunar',{expiresIn: 24 * 60 * 60  /* 1 days */});
        //console.log(111)
        let data = {
            username: params.username,
            password: sha1(params.password),//加密
            email: params.email,
            //token: token, //创建token并存入数据库
            role: params.role,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let user = await userInst.save(data);
            user = yapi.commons.fieldSelect(user,['id','username','password','email'])
            ctx.body = yapi.commons.resReturn(user);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 401, e.message);
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
    async findById(ctx){    //根据id获取用户信息
         try{
            var userInst = yapi.getInst(userModel);
            let id = ctx.request.body.id;
            let result = await userInst.findById(id);
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