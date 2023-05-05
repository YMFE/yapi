const yapi = require('../yapi.js')
const baseModel = require('./base.js')

class interfaceTemplateModel extends baseModel {
  getName() {
    return 'interface_template'
  }
  getSchema() {
    return {
      title: { type: String, required: true },
      desc: { type: String },
      username: { type: String },
      uid: { type: Number },
      project_id: { type: Number },
      res_schema: { type: String },
      add_time: Number,
      up_time: Number,
    }
  }
  save(data) {
    data.add_time = yapi.commons.time()
    let m = new this.model(data)
    return m.save()
  }
  list(project_id, select) {
    select =
      select ||
      '_id title uid desc res_schema username project_id add_time up_time'
    return this.model
      .find({
        project_id: project_id,
      })
      .select(select)
      .sort({ add_time: 'desc' })
      .exec()
  }
  del(id) {
    return this.model.remove({
      _id: id,
    })
  }
  get(id) {
    return this.model.findOne({
      _id: id,
    })
  }
  findTitle(title) {
    return this.model.find({
      title: title,
    })
  }
  up(id, data) {
    data.up_time = yapi.commons.time()
    return this.model.update(
      {
        _id: id,
      },
      data,
      { runValidators: true },
    )
  }
  search(keyword) {
    return this.model.find({
      title: new RegExp(keyword, 'ig'),
    })
  }
}
module.exports = interfaceTemplateModel
