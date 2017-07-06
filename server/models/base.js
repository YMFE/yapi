import yapi from '../yapi.js'
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'


/**
 * 所有的model都需要继承baseModel, 且需要 getSchema和getName方法，不然会报错
 */

class baseModel{

    constructor(){
        this.schema = new mongoose.Schema(this.getSchema())
        this.name = this.getName()
        this.schema.plugin(autoIncrement.plugin, this.name)
        this.model = yapi.db(this.name, this.schema);
    }
    
    /**
     * 获取collection的schema结构
     */

    getSchema(){
        yapi.commons.log('Model Class need getSchema function', 'error')
    }

    getName(){
        yapi.commons.log('Model Class need name', 'error')
    }


}

module.exports = baseModel;