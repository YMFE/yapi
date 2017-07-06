import  projectModel from '../models/project.js'
import yapi from '../yapi.js'

module.exports = {
    async add(ctx) {
        let params = ctx.request.body;
        if(!params.project_name){
            return ctx.body = yapi.commons.resReturn(null, 400, '组名不能为空');
        }
        var checkRepeat = await projectModel.checkRepeat(params.project_name);
        if(checkRepeat > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '组名已存在');
        }
        let data = {
            project_name: params.project_name,
            project_desc: params.project_desc,
            uid: '0',
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let result = await projectModel.save(data);
            result = yapi.commons.fieldSelect(result, ['_id', 'project_name', 'project_desc', 'uid']);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
        
    },

    async list(ctx) {
        try{
            let result = await projectModel.list();
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    },

    async del(ctx){   
        try{
            let id = ctx.request.body.id;
            let result = await projectModel.del(id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    },

    async up(ctx){
        try{
            let id = ctx.request.body.id;
            let data = {};
            ctx.request.body.project_name && (data.project_name = ctx.request.body.project_name)
            ctx.request.body.project_desc && (data.project_desc = ctx.request.body.project_desc)
            if(Object.keys(data).length ===0){
                ctx.body = yapi.commons.resReturn(null, 404, '分组名和分组描述都为空');
            }
            let result = await projectModel.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }
}
