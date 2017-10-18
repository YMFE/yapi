const yapi = require('yapi.js');
const baseModel = require('models/base.js');

class advMockModel extends baseModel {
  getName() {
    return 'adv_mock';
  }

  getSchema() {
    return {
      interface_id: { type: Number, required: true },
      project_id: {type: Number, required: true},
      enable: {type: Boolean, default: false}, 
      mock_script: String,
      uid: String,
      up_time: Number
    };
  }

  get(interface_id) {

    return this.model.findOne({
      interface_id: interface_id
    });
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
    data.up_time = yapi.commons.time();
    return this.model.update({
      interface_id: data.interface_id
    }, {
        uid: data.uid,
        up_time: data.up_time,
        mock_script: data.mock_script,
        enable: data.enable
      }, {
        upsert: true
      })
  }

}

module.exports = advMockModel;