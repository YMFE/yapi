import  groupModel from '../models/group.js'
import yapi from '../yapi.js'

module.exports = {
    async add(ctx) {
        let params = ctx.request.body;
        if(!params.group_name){
            return ctx.body = yapi.commons.resReturn(null, 400, 'Group不能为空');
        }
        var checkRepeat = await groupModel.checkRepeat(params.group_name);
        // if(checkRepeat > 0){
        //     return ctx.body =  yapi.commons.resReturn(null, 401, 'group已存在');
        // }
        let data = {
            group_name: params.group_name,
            group_desc: params.group_desc,
            uid: '0',
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let result = await groupModel.save(data);
            result = yapi.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid'])
            ctx.body = yapi.commons.resReturn(result)
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
        
    },

    async list(ctx) {
        console.log(yapi)
        ctx.body = 1;
    },

    async del(ctx){   

    },

    async up(ctx){

    }
}
