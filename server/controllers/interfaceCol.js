import interfaceColModel from '../models/interfaceCol.js';
import baseController from './base.js';
import yapi from '../yapi.js';

class interfaceColController extends baseController{
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(interfaceColModel);
    }

    async list(ctx){
        try {
            let id = ctx.query.project_id;
            let inst = yapi.getInst(interfaceColModel);
            let result = await inst.list(id);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    async up(ctx){
        
    }

    async del(ctx){
        
    }


}