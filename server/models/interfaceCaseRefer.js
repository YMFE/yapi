const yapi = require('../yapi.js');
const baseModel = require('./base.js');

/**
 * 测试用例引用表
 */
class interfaceCaseRefer extends baseModel {
  getName() {
    return 'interface_case_refer';
  }

  getSchema() {
    return {
      uid: { type: Number, required: true },
      refer_caseid: { type: Number, required: true },
      col_id: { type: Number, required: true },
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 }
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  checkRepeat(name) {
    return this.model.countDocuments({
      name: name
    });
  }

  list(project_id, parent_id = -1) {
    return this.model
      .find({
        project_id,
        parent_id
      })
      .sort({ index: 1 })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  upCatIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
}

module.exports = interfaceCaseRefer;
