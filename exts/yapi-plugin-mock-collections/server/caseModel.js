const yapi = require('yapi.js');
const baseModel = require('models/base.js');

class caseModel extends baseModel {
  getName() {
    return 'mock_collections_cases';
  }

  getSchema() {
    return {
      interface_id: { type: Number, required: true },
      project_id: {type: Number, required: true},
      col_id: {type: Number, required: true},
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
    
  }

  up(data) {
  
  }

}

module.exports = caseModel;