const yapi = require('../yapi.js')
const baseModel = require('./base.js')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

class interfaceCase extends baseModel {
  getName() {
    return 'interface_case'
  }

  getSchema() {
    return {
      casename: { type: String, required: true },
      uid: { type: Number, required: true },
      col_id: { type: Number, required: true },
      index: { type: Number, default: 0 },
      project_id: { type: Number, required: true },
      interface_id: { type: Number },
      ancestors: { type: String, default: '' },
      parent_id: { type: String, default: '' },
      // 0 interface case, 2 directory
      record_type: { type: Number, default: 0 },
      add_time: Number,
      up_time: Number,
      case_env: { type: String },
      dubbo_params: { type: String },
      req_params: [
        {
          name: String,
          value: String,
        },
      ],
      req_headers: [
        {
          name: String,
          value: String,
        },
      ],
      req_query: [
        {
          name: String,
          value: String,
          enable: { type: Boolean, default: true },
        },
      ],

      req_body_form: [
        {
          name: String,
          value: String,
          enable: { type: Boolean, default: true },
        },
      ],
      req_body_other: String,
      test_res_body: String,
      test_status: { type: String, enum: ['ok', 'invalid', 'error', ''] },
      test_res_header: Schema.Types.Mixed,
      mock_verify: { type: Boolean, default: false },
      enable_script: { type: Boolean, default: false },
      test_script: String,
    }
  }

  save(data) {
    let m = new this.model(data)
    return m.save()
  }

  //获取全部测试接口信息
  getInterfaceCaseListCount() {
    return this.model.countDocuments({})
  }

  get(id) {
    return this.model
      .findOne({
        _id: id,
      })
      .exec()
  }

  list(col_id, select) {
    select =
      select ||
      'casename uid col_id _id index interface_id project_id record_type'
    if (select === 'all') {
      return this.model
        .find({
          col_id: col_id,
        })
        .exec()
    }
    return this.model
      .find({
        col_id: col_id,
      })
      .select(select)
      .exec()
  }

  listCaseByCol(col_id) {
    return this.model
      .find({
        col_id: col_id,
        record_type: 0,
      })
      .exec()
  }

  listByParent(parent_id, col_id) {
    let select =
      'casename uid col_id _id index interface_id project_id parent_id record_type'
    let params = {
      parent_id: parent_id,
    }
    if (col_id) {
      params['col_id'] = col_id
    }
    return this.model
      .find(params)
      .select(select)
      .sort({ index: 1 })
      .exec()
  }

  listByAncestor(ancestorId) {
    let regex = new RegExp(`,${ancestorId}`)
    return this.model
      .find({
        ancestors: regex,
      })
      .exec()
  }

  del(id) {
    return this.model.remove({
      _id: id,
    })
  }

  delByAncestor(ancestorId) {
    let regex = new RegExp(`,${ancestorId}`)
    return this.model.remove({
      ancestors: regex,
    })
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id,
    })
  }

  delByInterfaceId(id) {
    return this.model.remove({
      interface_id: id,
    })
  }

  delByCol(id) {
    return this.model.remove({
      col_id: id,
    })
  }

  up(id, data) {
    data.up_time = yapi.commons.time()
    return this.model.update({ _id: id }, data)
  }

  upCaseIndex(id, index) {
    return this.model.update(
      {
        _id: id,
      },
      {
        index: index,
      },
    )
  }
}

module.exports = interfaceCase
