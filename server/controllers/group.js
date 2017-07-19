import  groupModel from '../models/group.js'
import yapi from '../yapi.js'
import baseController from './base.js'
import  projectModel from '../models/project.js'

// 
class groupController extends baseController{
    constructor(ctx){
        super(ctx)
    }
  

    /**
     * 添加项目分组
     * @interface /group/add
     * @method POST
     * @category group
     * @foldnumber 10
     * @param {String} group_name 项目分组名称，不能为空
     * @param  {String} [group_desc] 项目分组描述 
     * @returns {Object} 
     * @example ./api/group/add.json
     */
    async add(ctx) {
        let params = ctx.request.body;
        if(this.getRole() !== 'admin'){
            return ctx.body = yapi.commons.resReturn(null,401,'没有权限');
        }
        if(!params.group_name){
            return ctx.body = yapi.commons.resReturn(null, 400, '项目分组名不能为空');
        }
        var groupInst = yapi.getInst(groupModel);
        
        var checkRepeat = await groupInst.checkRepeat(params.group_name);
        if(checkRepeat > 0){
            return ctx.body =  yapi.commons.resReturn(null, 401, '项目分组名已存在');
        }
        let data = {
            group_name: params.group_name,
            group_desc: params.group_desc,
            uid: '0',
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        }
        try{
            let result = await groupInst.save(data);
            result = yapi.commons.fieldSelect(result, ['_id', 'group_name', 'group_desc', 'uid']);
            ctx.body = yapi.commons.resReturn(result);
        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
        
    }

    /**
     * 获取项目分组列表
     * @interface /group/list
     * @method get
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/list.json
     */

    async list(ctx) {
        try{
            var groupInst = yapi.getInst(groupModel);
            let result = await groupInst.list();
            ctx.body = yapi.commons.resReturn(result)
        }catch(e){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 删除项目分组
     * @interface /group/del
     * @method post
     * @param {String} id 项目分组id
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/del.json
     */

    async del(ctx){
        if(this.getRole() !== 'admin'){
            return ctx.body = yapi.commons.resReturn(null,401,'没有权限');
        }   
        try{
            var groupInst = yapi.getInst(groupModel);
            var projectInst = yapi.getInst(projectModel);
            let id = ctx.request.body.id;            
            if(!id){
                return ctx.body = yapi.commons.resReturn(null, 402, 'id不能为空');
            }
            let count = await  projectInst.countByGroupId(id);
            if(count > 0){
                return ctx.body = yapi.commons.resReturn(null, 403, '请先删除该分组下的项目');
            }

            let result = await groupInst.del(id);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }

    /**
     * 更新项目分组
     * @interface /group/up
     * @method post
     * @param {String} id 项目分组id
     * @param {String} group_name 项目分组名称
     * @param {String} group_desc 项目分组描述
     * @category group
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/group/up.json
     */

    async up(ctx){
        if(this.getRole() !== 'admin'){
            return ctx.body = yapi.commons.resReturn(null,401,'没有权限');
        }
        try{
            var groupInst = yapi.getInst(groupModel);
            let id = ctx.request.body.id;
            let data = {};
            ctx.request.body.group_name && (data.group_name = ctx.request.body.group_name)
            ctx.request.body.group_desc && (data.group_desc = ctx.request.body.group_desc)
            if(Object.keys(data).length === 0 ){
                ctx.body = yapi.commons.resReturn(null, 404, '分组名和分组描述不能为空');
            }
            let result = await groupInst.up(id, data);
            ctx.body = yapi.commons.resReturn(result)
        }catch(err){
             ctx.body = yapi.commons.resReturn(null, 402, e.message)
        }
    }
}


module.exports = groupController
