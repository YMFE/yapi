const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class tokenModel extends baseModel {
  getName() {
    return 'token';
  }

  getSchema() {
    return {
      project_id: { type: Number, required: true },
      token: String
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(project_id) {
    return this.model.findOne({
      project_id: project_id
    });
  }

  findId(token) {
    return this.model
      .findOne({
        token: token
      })
      .select('project_id')
      .exec();
  }

  up(project_id, token) {
    return this.model.update(
      {
        project_id: project_id
      },
      {
        token: token
      }
    );
  }
}

module.exports = tokenModel;
