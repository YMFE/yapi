import yapi from '../yapi.js'
import  projectModel from '../models/project.js'
import userModel from '../models/user.js'
const jwt = require('jsonwebtoken');


class baseController{
    constructor(ctx){
        this.ctx = ctx;
        //网站上线后，role对象key是不能修改的，value可以修改
        this.roles = {
            admin: 'Admin',
            member: '网站会员'
        }
    }

    async init(ctx){
        this.$user = null;
        let ignoreRouter = [
            '/user/login_by_token',
            '/user/login',
            '/user/reg',
            '/user/status',
            '/user/logout'
        ]
        if(ignoreRouter.indexOf(ctx.path) > -1){
            this.$auth = true;
        }else{
            await this.checkLogin(ctx)
        }
        
    }

    getUid(ctx){
        return parseInt(this.$uid, 10);
    }

    async checkLogin(ctx){
        let token = ctx.cookies.get('_yapi_token');
        let uid   = ctx.cookies.get('_yapi_uid');
        try{
            if(!token || !uid) return false;
            let userInst = yapi.getInst(userModel); //创建user实体
            let result = await userInst.findById(uid);
            let decoded = jwt.verify(token, result.passsalt)
            if(decoded.uid == uid){
                this.$uid = uid;
                this.$auth = true;
                this.$user = result;             
                return true;
            }
            return false;
        }catch(e){
            return false;
        }

    }

    async getLoginStatus(ctx){
        if(await this.checkLogin(ctx) === true){            
            return ctx.body = yapi.commons.resReturn(yapi.commons.fieldSelect(this.$user,['_id','username','email', 'up_time', 'add_time']));
        }
        return ctx.body = yapi.commons.resReturn(null, 300 , 'Please login.');

    }

    getRole(){
        return this.$user.role;
    }

    async jungeProjectAuth(id){
        let model = yapi.getInst(projectModel);
        if(this.getRole() === 'admin') return true;
        if(!id) return false;
        let result =  await model.get(id);
        if(result.uid === this.getUid()){
            return true;
        }
        return false;
    }

    async jungeMemberAuth(id, member_uid){
        let model = yapi.getInst(projectModel);
        if(this.getRole() === 'admin') return true;
        if(!id || !member_uid) return false;
        let result =  await model.checkMemberRepeat(id, member_uid);
        if(result > 0){
            return true;
        }
        return false;
    }
}

module.exports = baseController