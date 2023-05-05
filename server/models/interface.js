const yapi = require('../yapi.js')
const baseModel = require('./base.js')

class interfaceModel extends baseModel {
  getName() {
    return 'interface'
  }

  getSchema() {
    return {
      title: { type: String, required: true },
      uid: { type: Number, required: true, ref: 'user' },
      path: { type: String },
      method: { type: String },
      project_id: { type: Number, required: true },
      catid: { type: Number, required: true },
      edit_uid: { type: Number, default: 0 },
      status: { type: String, enum: ['undone', 'done'], default: 'undone' },
      desc: String,
      markdown: String,
      ancestors: { type: String, default: '' },
      parent_id: { type: String, default: '' },
      // 0 interface, 1 doc, 2 directory
      record_type: { type: Number, default: 0 },
      // 'http','dubbo'
      interface_type: { type: String, default: 'http' },
      add_time: Number,
      up_time: Number,
      type: { type: String, enum: ['static', 'var'], default: 'static' },
      query_path: {
        path: String,
        params: [
          {
            name: String,
            value: String,
          },
        ],
      },
      req_query: [
        {
          name: String,
          value: String,
          example: String,
          desc: String,
          required: {
            type: String,
            enum: ['1', '0'],
            default: '1',
          },
        },
      ],
      req_headers: [
        {
          name: String,
          value: String,
          example: String,
          desc: String,
          required: {
            type: String,
            enum: ['1', '0'],
            default: '1',
          },
        },
      ],
      req_params: [
        {
          name: String,
          desc: String,
          example: String,
        },
      ],
      req_body_type: {
        type: String,
        enum: ['form', 'json', 'text', 'file', 'raw'],
      },
      req_body_is_json_schema: { type: Boolean, default: false },
      req_body_form: [
        {
          name: String,
          type: { type: String, enum: ['text', 'file'] },
          example: String,
          value: String,
          desc: String,
          required: {
            type: String,
            enum: ['1', '0'],
            default: '1',
          },
        },
      ],
      req_body_other: String,
      res_body_type: {
        type: String,
        enum: ['json', 'text', 'xml', 'raw', 'json-schema'],
      },
      res_body: String,
      res_body_text: String,
      res_body_is_json_schema: { type: Boolean, default: false },
      custom_field_value: String,
      field2: String,
      field3: String,
      api_opened: { type: Boolean, default: false },
      index: { type: Number, default: 0 },
      tag: Array,
      r_facade: String,
      r_method: String,
      pre_script: String,
      after_script: String,
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

  getBaseinfo(id) {
    return this.model
      .findOne({
        _id: id,
      })
      .select('path method uid title project_id cat_id status ')
      .exec()
  }

  getVar(project_id, method) {
    return this.model
      .find({
        project_id: project_id,
        type: 'var',
        method: method,
      })
      .select('_id path')
      .exec()
  }

  getByQueryPath(project_id, path, method) {
    return this.model
      .find({
        project_id: project_id,
        'query_path.path': path,
        method: method,
      })
      .exec()
  }

  getByPath(project_id, path, method, select) {
    select =
      select ||
      '_id title uid path method project_id catid status add_time up_time type query_path req_query req_headers req_params req_body_type req_body_form req_body_other res_body_type res_body_text custom_field_value res_body res_body_is_json_schema req_body_is_json_schema'
    return this.model
      .find({
        project_id: project_id,
        path: path,
        method: method,
      })
      .select(select)
      .exec()
  }

  getIdByProIdCatId(project_id, catid, path, method, select) {
    select =
      select ||
      '_id title uid path method project_id catid status add_time up_time type query_path req_query req_headers req_params req_body_type req_body_form req_body_other res_body_type res_body_text custom_field_value res_body res_body_is_json_schema req_body_is_json_schema'
    return this.model
      .find({
        project_id: project_id,
        catid: catid,
        path: path,
        method: method,
      })
      .select(select)
      .exec()
  }

  getAllByProIdCatId(project_id, catid, select) {
    select =
      select ||
      '_id title uid path method project_id catid status add_time up_time type query_path req_query req_headers req_params req_body_type req_body_form req_body_other res_body_type res_body_text custom_field_value res_body res_body_is_json_schema req_body_is_json_schema'
    return this.model
      .find({
        project_id: project_id,
        catid: catid,
      })
      .select(select)
      .exec()
  }

  checkRepeat(condition) {
    return this.model.countDocuments(condition)
  }

  countByProjectId(id) {
    return this.model.countDocuments({
      project_id: id,
    })
  }

  list(condition, select) {
    select =
      select ||
      '_id title uid path method project_id catid status add_time up_time record_type interface_type r_method r_facade index'
    return this.model
      .find(condition, select)
      .populate({ path: 'uid', select: 'username email' })
      .sort({ index: 1 })
      .exec()
  }

  listWithPage(condition, page, limit) {
    page = parseInt(page)
    limit = parseInt(limit)
    return this.model
      .find(condition)
      .sort({ path: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        '_id title uid path method project_id catid api_opened status add_time up_time tag record_type interface_type r_facade r_method',
      )
      .exec()
  }

  listByPid(project_id) {
    return this.model
      .find({
        project_id: project_id,
      })
      .sort({ title: 1 })
      .exec()
  }

  //获取全部接口信息
  getInterfaceListCount() {
    return this.model.countDocuments({
      record_type: 0,
    })
  }

  listByCatid(catid, select) {
    select =
      select ||
      '_id title uid path method project_id catid status add_time up_time index tag parent_id record_type interface_type r_facade r_method'
    return this.model
      .find({
        catid: catid,
        ancestors: '',
      })
      .select(select)
      .sort({ index: 1 })
      .exec()
  }

  listByParentId(parentId) {
    return this.model
      .find({
        parent_id: `${parentId}`,
      })
      .select(
        '_id title uid path method project_id catid api_opened status add_time up_time index parent_id tag record_type interface_type r_facade r_method',
      )
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

  listByCatidWithPage(condition, page, limit) {
    page = parseInt(page)
    limit = parseInt(limit)
    return this.model
      .find(condition)
      .sort({ index: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        '_id title uid path method project_id catid api_opened status add_time up_time index parent_id tag record_type interface_type r_facade r_method',
      )
      .exec()
  }

  listByInterStatus(catid, status) {
    let option = {}
    if (status === 'open') {
      option = {
        catid: catid,
        api_opened: true,
      }
    } else {
      option = {
        catid: catid,
      }
    }
    return this.model
      .find(option)
      .select()
      .sort({ title: 1 })
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

  delByCatid(id) {
    return this.model.remove({
      catid: id,
    })
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id,
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

  upEditUid(id, uid) {
    return this.model.update(
      {
        _id: id,
      },
      { edit_uid: uid },
      { runValidators: true },
    )
  }
  getcustomFieldValue(id, value) {
    return this.model
      .find({
        project_id: id,
        custom_field_value: value,
      })
      .select(
        'title uid path method status desc add_time up_time type query_path req_query req_headers req_params req_body_type req_body_form req_body_other res_body_type custom_field_value',
      )
      .exec()
  }

  listCount(option) {
    return this.model.countDocuments(option)
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

  search(keyword) {
    return this.model
      .find({
        $or: [
          {
            title: new RegExp(keyword, 'ig'),
          },
          {
            path: new RegExp(keyword, 'ig'),
          },
          {
            r_facade: new RegExp(keyword, 'ig'),
          },
        ],
      })
      .limit(5)
  }
}

module.exports = interfaceModel
