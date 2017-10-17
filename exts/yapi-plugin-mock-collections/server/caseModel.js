const yapi = require('yapi.js');
const baseModel = require('models/base.js');

class caseModel extends baseModel {
  getName() {
    return 'mock_collections';
  }

  getSchema() {
    return {
      interface_id: { type: Number, required: true },
      project_id: {type: Number, required: true},
      ip: {type: String, required: true,
        validate: {
          validator: function(v) {
            return /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(v);
          },
          message: '{VALUE} is not a valid Ip!'
        },
      },
      name: {type: String, required: true},
      code: {type: Number, required: true, default: 200},
      deplay: {type: Number,  default: 0},
      headers: [{
        name: {type: String, required: true},
        value: {type: String}
      }],
      uid: String,
      up_time: Number
    };
  }

  get(data) {
    return this.model.findOne(data);
  }

  delByInterfaceId(interface_id) {
    return this.model.deleteOne({
      interface_id: interface_id
    });
  }

  delByProjectId(project_id){
    return this.model.deleteMany({
      project_id: project_id
    })
  }

  save(data) {
    
  }

  up(data) {
  
  }

}

module.exports = caseModel;