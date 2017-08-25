import yapi from '../yapi.js';
import baseModel from './base.js';
// import userModel from '../models/user.js';

class avatarModel extends baseModel {
    getName() {
        return 'avatar';
    }

    getSchema() {
        return {
            uid: { type: Number, required: true },
            basecode: String,
            type: String
        };
    }
    
    get(uid) {

        return this.model.findOne({
            uid: uid
        });
    }

    up(uid, basecode, type){
        return this.model.update({
            uid: uid
        }, {
            type: type,
            basecode: basecode
        },{
            upsert: true
        })
    }

}

module.exports = avatarModel;