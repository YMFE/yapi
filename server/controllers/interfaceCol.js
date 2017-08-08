import interfaceColModel from '../models/interfaceCol.js';
import baseController from './base.js';
import yapi from '../yapi.js';

class interfaceColController extends baseController{
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(interfaceColModel);
    }

    list(ctx){

    }

    up(ctx){
        
    }

    del(ctx){

    }


}