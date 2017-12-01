const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceModel extends baseModel {
    getName() {
        return 'interface';
    }

    getSchema() {
        return {
            title: {type: String, required: true},
            uid: {type: Number, required: true},
            path: {type: String, required: true},
            method: {type: String, required: true},
            project_id: {type: Number, required: true},
            catid: {type: Number, required: true},
            edit_uid: {type: Number, default: 0},
            status: {type: String, enum: ['undone', 'done'], default: 'undone'},
            desc: String,
            add_time: Number,
            up_time: Number,
            type: {type: String, enum: ['static', 'var'], default: 'static'},
            query_path: {
                path: String,
                params: [{
                    name: String, value: String
                }]
            },
            req_query: [{
                name: String, value: String, example: String, desc: String, required: {
                    type: String,
                    enum: ["1", "0"],
                    default: "1"
                }
            }],
            req_headers: [{
                name: String, value: String, example: String, desc: String, required: {
                    type: String,
                    enum: ["1", "0"],
                    default: "1"
                }
            }],
            req_params: [{
                name: String,
                desc: String,
                example: String
            }],
            req_body_type: {
                type: String,
                enum: ['form', 'json', 'text', 'file', 'raw']
            },
            req_body_form: [{
                name: String, type: {type: String, enum: ['text', 'file']}, example: String, desc: String, required: {
                    type: String,
                    enum: ["1", "0"],
                    default: "1"
                }
            }],
            req_body_other: String,
            res_body_type: {
                type: String,
                enum: ['json', 'text', 'xml', 'raw']
            },
            res_body: String
        };
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }

    get(id) {
        return this.model.findOne({
            _id: id
        })
            .exec();
    }

    getBaseinfo(id) {
        return this.model.findOne({
            _id: id
        }).select('path method uid title project_id cat_id status req_body_other req_body_type').exec()
    }

    getVar(project_id, method) {
        return this.model.find({
            project_id: project_id,
            type: 'var',
            method: method
        }).select('_id path').exec()
    }

    getByQueryPath(project_id, path, method) {
        return this.model.find({
            project_id: project_id,
            "query_path.path": path,
            method: method
        })
            .exec();
    }

    getByPath(project_id, path, method) {
        return this.model.find({
            project_id: project_id,
            path: path,
            method: method
        })
            .exec();
    }

    checkRepeat(id, path, method) {
        return this.model.count({
            project_id: id,
            path: path,
            method: method
        });
    }

    countByProjectId(id) {
        return this.model.count({
            project_id: id
        });
    }

    list(project_id, select) {
        select = select || '_id title uid path method project_id catid edit_uid status add_time up_time'
        return this.model.find({
            project_id: project_id
        })
            .select(select)
            .sort({_id: -1})
            .exec();
    }
    
    listByPid(project_id){
        return this.model.find({
            project_id: project_id
        })
        .sort({_id: -1})
        .exec();
    }

    //获取全部接口信息
    getInterfaceListCount() {
        return this.model.count({});
    }

    listByCatid(catid) {
        return this.model.find({
            catid: catid
        }).exec();
    }

    del(id) {
        return this.model.remove({
            _id: id
        });
    }

    delByCatid(id) {
        return this.model.remove({
            catid: id
        })
    }

    delByProjectId(id) {
        return this.model.remove({
            project_id: id
        })
    }

    up(id, data) {
        data.up_time = yapi.commons.time();
        return this.model.update({
            _id: id
        }, data, {runValidators: true});
    }

    upEditUid(id, uid) {
        return this.model.update({
                _id: id
            },
            {edit_uid: uid},
            {runValidators: true});
    }
}

module.exports = interfaceModel;
