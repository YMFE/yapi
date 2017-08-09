import interfaceCaseModel from '../models/interfaceCase.js';
import baseController from './base.js';
import yapi from '../yapi.js';

class interfaceCaseController extends baseController{
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(interfaceCaseModel);
    }

    list(ctx){

    }

    get(ctx){
        
    }

    up(ctx){

    }

    del(ctx){

    }


}