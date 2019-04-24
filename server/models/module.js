const baseModel = require('./base.js');

class moduleModel extends baseModel {
  getName() {
    return 'module';
  }

  constructor(){
    super()
  }

  getSchema() {
    return {
      project_id: { type: Number, required: true },
      name: { type: String, required: true }
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  checkNameRepeat(data) {
    return this.model.countDocuments({
      name: data.name,
      project_id: data.project_id
    });
  }

  list(project_id) {
    let params = {project_id: project_id};
    return this.model
      .find(params)
      .select(
        '_id name'
      )
      .sort({ _id: 1 })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  up(id, data) {
    return this.model.update(
      {
        _id: id
      },
      data,
      { runValidators: true }
    );
  }

  search(keyword) {
    return this.model
      .find({
        name: new RegExp(keyword, 'ig')
      });
  }
}

module.exports = moduleModel;
