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
      project_id: { type: Number, required: true },
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

  referColList(case_id) {
    return this.model
      .find({
        // project_id,
        refer_caseid: case_id
      })
      .sort({ index: 1 })
      .exec();
  }

  caseReferListByCol(col_id,case_id) {
    let query = {};
    if(case_id) {
      query = {
        col_id,
        refer_caseid: case_id
      }
    } else {
     query = {
        col_id
      }
    }
    return this.model
      .find(query)
      .sort({ index: 1 })
      .exec();
  }
  // 删除该用例的所有映射
  delAllByCaseid(refer_caseid) {
    return this.model.deleteMany({
      refer_caseid
    });
  }
  // 删除该项目的所有映射
  delByProjectId(project_id) {
    return this.model.deleteMany({
      project_id
    });
  }
  // 删除该集合的所有映射
  delByColId(col_id) {
    return this.model.deleteMany({
      col_id
    });
  }
  // 解除单个映射
  del(id) {
    return this.model.deleteOne({
        _id: id
      });
  }
}

module.exports = interfaceCaseRefer;
