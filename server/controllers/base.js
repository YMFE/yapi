import yapi from '../yapi.js'
class baseController{
    constructor(ctx){
        console.log('baseControler init...')
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