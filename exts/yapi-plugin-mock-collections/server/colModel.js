const yapi = require('yapi.js');
const baseModel = require('models/base.js');

class colModel extends baseModel {
  getName() {
    return 'mock_collections';
  }

  getSchema() {
    return {
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
      uid: String,
      up_time: Number
    };
  }

  get(data) {
    return this.model.findOne(data);
  }

  delByProjectId(project_id){
    return this.model.remove({
      project_id: project_id
    })
  }

  save(data) {
    
  }

  up(data) {
  
  }

}

module.exports = colModel;