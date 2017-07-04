import  groupModel from '../models/group.js'
import yapi from '../yapi.js'

module.exports = {
    async add(ctx) {
        let params = ctx.request.body;
        if(!params.group_name){
            return ctx.body = yapi.commons.resReturn(null, 400, '组名不能为空');
        }
        var checkRepeat = await groupModel.checkRepeat(params.group_name);
        if(checkRepeat > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '组名已存在');
        }
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
        try{
            let result = await groupModel.list();
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    },

    async del(ctx){   
        try{
            let id = ctx.request.body.id;
            let result = await groupModel.del(id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    },

    async up(ctx){
        try{
            let id = ctx.request.body.id;
            let data = {};
            ctx.request.body.group_name && (data.group_name = ctx.request.body.group_name)
            ctx.request.body.group_desc && (data.group_desc = ctx.request.body.group_desc)
            if(Object.keys(data).length ===0){
                ctx.body = yapi.commons.resReturn(null, 404, '分组名和分组描述都为空');
            }
            let result = await groupModel.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }
}
