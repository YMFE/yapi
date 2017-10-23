const yapi = require('../yapi.js');
const baseModel = require('./base.js');

/**
 * 接口分类
 */
class interfaceCat extends baseModel {
    getName() {
        return 'interface_cat';
    }

    getSchema() {
        return {
            name: { type: String, required: true },
            uid: { type: Number, required: true },
            project_id: { type: Number, required: true },
            desc: String,
            add_time: Number,
            up_time: Number
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
        return this.model.remove({
            _id: id
        });
    }

    delByProjectId(id){
        return this.model.remove({
            project_id: id
        })
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

module.exports = interfaceCat;