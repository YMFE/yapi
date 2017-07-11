import yapi from '../yapi.js'
import  projectModel from '../models/project.js'
class baseController{
    constructor(ctx){
        // console.log('baseControler init...')
        // let router;
        // if(router === 'user/reg' || 'router/login'){

        // }else{
        //     var a = this.getLoginStatus()
        //     if(a === false){
        //         return ctx.body = {};

        //     }
        // }
        // this.auth = false;
    }

    getUid(){
        return 0
    }

    getLoginStatus(){
        // let token = getCookie('_yapi_token');
        // let uid   = getCookie('_yapi_uid');
        // let usermodel

        // usermode.token === token
        // return true
        return true
    }

    getRole(){
        return 'admin'
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