import yapi from '../yapi.js'
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
}

module.exports = baseController