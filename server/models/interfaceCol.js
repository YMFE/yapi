import yapi from '../yapi.js';
import baseModel from './base.js';

class interfaceCol extends baseModel {
    getName() {
        return 'interface_col';
    }

    getSchema() {
        return {
            name: { type: String, required: true },
            uid: { type: Number, required: true },
            project_id: { type: Number, required: true },
            desc: String,
            add_time: Number,
            up_time: Number,
        };
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }

    get(id) {
        return this.model.findOne({
            _id: id
        }).exec();
    }

    checkRepeat(name) {
        return this.model.count({
            name: name
        });
    }

    list(project_id) {
        return this.model.find({
            project_id: project_id
        }).exec();
    }

    del(id) {
        return this.model.deleteOne({
            _id: id
        });
    }

    up(id, data) {
        data.up_time = yapi.commons.time()
        return this.model.update(
            {
                _id: id
            }, 
            data
        );
    }
}

module.exports = interfaceCol;