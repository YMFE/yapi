const yapi = require('yapi.js');
const baseModel = require('models/base.js');
const  mongoose = require('mongoose');

class caseModel extends baseModel {
  getName() {
    return 'adv_mock_case';
  }

  getSchema() {
    return {
      interface_id: { type: Number, required: true },
      project_id: {type: Number, required: true},
      ip: {type: String},
      ip_enable: {type: Boolean,  default: false},
      name: {type: String, required: true},
      code: {type: Number, default: 200},
      delay: {type: Number,  default: 0},
      headers: [{
        name: {type: String, required: true},
        value: {type: String}
      }],
      params: mongoose.Schema.Types.Mixed,
      uid: String,
      up_time: Number,
      res_body: {type: String, required: true},
      case_enable: {type: Boolean,  default: true}
    };
  }

  get(data) {
    return this.model.findOne(data);
  }

  list(id){
    return this.model.find({
      interface_id: id
    })
  }

  delByInterfaceId(interface_id) {
    return this.model.remove({
      interface_id: interface_id
    });
  }

  delByProjectId(project_id){
    return this.model.remove({
      project_id: project_id
    })
  }

  save(data) {
    data.up_time = yapi.commons.time();
    let m = new this.model(data);
    return m.save();
  }

  up(data) {
    let id = data.id;
    delete data.id;
    data.up_time = yapi.commons.time();
    return this.model.update({
      _id: id
    }, data)
  }

  del(id){
    return this.model.remove({
      _id: id
    })
  }

}

module.exports = caseModel;