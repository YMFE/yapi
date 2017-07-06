import  projectModel from '../models/project.js'
import yapi from '../yapi.js'
import baseController from './base.js'

class projectController extends baseController {

    constructor(ctx){
        super(ctx)
        this.Model = yapi.getInst(projectModel);
    }

    async jungeProjectAuth(id){
        if(this.getRole() === 'admin') return true;
        if(!id) return false;
        let result =  await this.Model.get(params.id);
        if(result.uid === this.getUid()){
            return true;
        }
        return false;
    }

    async jungeMemberAuth(id, member_uid){
        if(this.getRole() === 'admin') return true;
        if(!id || !member_uid) return false;
        let result =  await this.Model.checkMemberRepeat(params.id, member_uid);
        if(result > 0){
            return true;
        }
        return false;
    }

    async add(ctx) {
        let params = ctx.request.body;

        if(!params.group_id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }

        if(!params.name){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目名不能为空');
        }

        let checkRepeat = await this.Model.checkNameRepeat(params.name);
        if(checkRepeat > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '已存在的项目名');
        }

        if(!params.basepath){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目basepath不能为空');
        }
        if(!params.prd_host){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目domain不能为空');
        }

        let checkRepeatDomain = await this.Model.checkDomainRepeat(params.prd_host, params.basepath);
        if(checkRepeatDomain > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '已存在domain和basepath');
        }
        
        let data = {
            name: params.name,
            desc: params.desc,
            prd_host: params.prd_host,
            basepath: params.basepath,
            members: [this.getUid()],
            uid: this.getUid(),
            group_id: params.group_id,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }

        try{
            let result = await this.Model.save(data);           
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
        
    }

    async addMember(ctx){
        let params = ctx.request.body;
        if(!params.member_uid){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if(!params.id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }

        var check = await this.Model.checkMemberRepeat(params.id, params.member_uid);
        if(check > 0){
             return ctx.body = yapi.commons.resReturn(null, 400, '项目成员已存在');
        }
        try{
            let result = await this.Model.addMember(params.id, params.member_uid);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }

    }

    async delMember(ctx){
        let params = ctx.request.body;
        if(!params.member_uid){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目成员uid不能为空');
        }
        if(!params.id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        var check = await this.Model.checkMemberRepeat(params.id, params.member_uid);
        if(check === 0){
             return ctx.body = yapi.commons.resReturn(null, 400, '项目成员不存在');
        }

         try{
            let result = await this.Model.delMember(params.id, params.member_uid);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    async get(ctx){
        let params = ctx.request.query;
        if(!params.id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
        }
        try{
            let result = await this.Model.get(params.id);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    async list(ctx) {
        let group_id = ctx.request.query.group_id;
        if(!group_id){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组id不能为空');
        }
        try{
            let result = await this.Model.list(group_id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    async del(ctx){   
        try{
            let id = ctx.request.body.id;
            if(this.jungeProjectAuth(id) !== true){
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }
            let result = await this.Model.del(id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    async up(ctx){
        try{            
            let id = ctx.request.body.id;
            let params = ctx.request.body;

            if(this.jungeMemberAuth(id, this.getUid()) !== true){
                return ctx.body = yapi.commons.resReturn(null, 405, '没有权限');
            }

            if(!params.name){
                return ctx.body = yapi.commons.resReturn(null, 400, '项目名不能为空');
            }

            let checkRepeat = await this.Model.checkNameRepeat(params.name);
            if(checkRepeat > 0){
                return ctx.body =  yapi.commons.resReturn(null, 401, '已存在的项目名');
            }

            if(!params.basepath){
                return ctx.body = yapi.commons.resReturn(null, 400, '项目basepath不能为空');
            }
            if(!params.prd_host){
                return ctx.body = yapi.commons.resReturn(null, 400, '项目domain不能为空');
            }

            let checkRepeatDomain = await this.Model.checkDomainRepeat(params.prd_host, params.basepath);
            if(checkRepeatDomain > 0){
                return ctx.body =  yapi.commons.resReturn(null, 401, '已存在domain和basepath');
            }
        


            let data= {
                name: params.name,
                desc: params.desc,
                prd_host: params.prd_host,
                basepath: params.basepath,
                uid: this.getUid(),
                up_time: yapi.commons.time(),
                env: params.env
            }
            let result = await this.Model.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }
}

module.exports = projectController;