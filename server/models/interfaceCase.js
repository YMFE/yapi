import yapi from '../yapi.js';
import baseModel from './base.js';

class interfaceCase extends baseModel {
    getName() {
        return 'interface_case';
    }

    getSchema() {
        return {
            casename: { type: String, required: true },
            uid: { type: Number, required: true },
            col_id: { type: Number, required: true },
            index: { type: Number, default: 0 },
            project_id: { type: Number, required: true },
            interface_id: { type: Number, required: true },
            add_time: Number,
            up_time: Number,
            env: { type: String },
            // path: { type: String },
            // method: { type: String },
            req_params: [{
                name: String, value: String
            }],
            req_query: [{
                name: String, value: String
            }],
            // req_headers: [{
            //     name: String, value: String
            // }],
            // req_body_type: {
            //     type: String,
            //     enum: ['form', 'json', 'text', 'xml']
            // },
            req_body_form: [{
                name: String, value: String
            }],
            req_body_other: String

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

    list(col_id, select) {
        select = select || 'casename uid col_id _id index'
        if (select === 'all') {
            return this.model.find({
                col_id: col_id
            }).exec();
        }
        return this.model.find({
            col_id: col_id
        }).select("casename uid col_id _id index").exec();
    }

    del(id) {
        return this.model.deleteOne({
            _id: id
        });
    }

    delByProjectId(id) {
        return this.model.deleteMany({
            project_id: id
        })
    }

    delByInterfaceId(id){
        return this.model.deleteMany({
            interface_id: id
        })
    }

    delByCol(id) {
        return this.model.deleteMany({
            col_id: id
        })
    }

    up(id, data) {
        data.up_time = yapi.commons.time()
        return this.model.update(
            { _id: id },
            data
        );
    }

    upCaseIndex(id, index) {
        return this.model.update({
            _id: id
        }, {
                index: index
            })
    }
}

module.exports = interfaceCase;
