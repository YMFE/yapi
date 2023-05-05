const yapi = require('../yapi.js')
const baseModel = require('./base.js')

/**
 * 规则
 */
class rule extends baseModel {
  getName() {
    return 'rule'
  }
  getSchema() {
    return {
      title: { type: String, required: true },
      uid: { type: Number, required: true },
      project_id: { type: Number, required: true },
      desc: String,
      add_time: Number,
      up_time: Number,
      mock_script: { type: String, required: true },
      username: String,
    }
  }

  save(data) {
    let m = new this.model(data)
    return m.save()
  }

  get(id) {
    return this.model
      .findOne({
        _id: id,
      })
      .exec()
  }

  list(project_id) {
    return this.model
      .find({
        project_id: project_id,
      })
      .sort({ index: 1 })
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

module.exports = rule
