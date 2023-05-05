const baseModel = require('models/base.js')

class statisMockModel extends baseModel {
  getName() {
    // 和yapi自带的wiki进行区分
    return 'ke-wiki'
  }

  getSchema() {
    return {
      project_id: { type: Number, required: true },
      username: String,
      uid: { type: Number, required: true },
      title: { type: String, required: true },
      ancestors: { type: String, default: '' },
      parent_id: { type: String, default: '' },
      index: { type: Number, default: 0 },
      edit_uid: { type: Number, default: 0 },
      desc: String,
      markdown: String,
      add_time: Number,
      up_time: Number,
      file: [
        {
          name: { type: String, default: '' },
          path: { type: String, default: '' },
          size: { type: String, default: '' },
        },
      ],
    }
  }

  save(data) {
    let m = new this.model(data)
    return m.save()
  }

  get(project_id, title) {
    return this.model
      .findOne({
        project_id: project_id,
        title: title,
      })
      .exec()
  }

  getById(wiki_id) {
    return this.model
      .findOne({
        _id: wiki_id,
      })
      .exec()
  }

  delByAncestor(ancestorId) {
    let regex = new RegExp(`,${ancestorId}`)
    return this.model.deleteMany({
      ancestors: regex,
    })
  }

  listByAncestor(ancestorId) {
    let regex = new RegExp(`,${ancestorId}`)
    return this.model
      .find({
        ancestors: regex,
      })
      .exec()
  }

  delById(id) {
    return this.model.deleteOne({
      _id: id,
    })
  }

  upIndex(id, index) {
    return this.model.update(
      {
        _id: id,
      },
      {
        index: index,
      },
    )
  }

  /**
   * 获取全部页面列表(只返回title/project_id/_id字段)
   * @param {*} project_id
   */
  getListByProjectid(project_id) {
    return this.model
      .find(
        {
          project_id: project_id,
          parent_id: '',
        },
        {
          _id: 1,
          index: 1,
          title: 1,
          parent_id: 1,
          project_id: 1,
        },
      )
      .sort({ index: 1 })
      .exec()
  }

  //获取页面所有wiki
  getAllListByProjectid(project_id) {
    return this.model
      .find({
        project_id: project_id,
      })
      .sort({ index: 1 })
      .exec()
  }

  listByParentId(parentId) {
    return this.model
      .find({
        parent_id: `${parentId}`,
      })
      .select('title _id index project_id usename')
      .sort({ index: 1 })
      .exec()
  }

  listCount(option) {
    return this.model.countDocuments(option)
  }

  up(id, data) {
    return this.model.updateOne(
      {
        _id: id,
      },
      data,
      { runValidators: true },
    )
  }

  upFile(id, file) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          file: {
            path: file.path,
            name: file.name,
            size: file.size,
          },
        },
      },
      { upsert: true },
    )
  }

  delFile(id, file) {
    return this.model.updateOne(
      {
        _id: id,
      },
      { $pull: { file: { _id: file.id } } },
      { safe: true },
    )
  }

  upEditUid(id, uid) {
    return this.model.updateOne(
      {
        _id: id,
      },
      { edit_uid: uid },
      { runValidators: true },
    )
  }

  remove(project_id, title) {
    return this.model.deleteOne({
      project_id,
      title,
    })
  }

  search(keyword) {
    return this.model
      .find({
        title: new RegExp(keyword, 'i'),
      })
      .select('title project_id')
      .limit(5)
  }
}

module.exports = statisMockModel
