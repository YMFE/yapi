const yapi = require('yapi.js');
const baseModel = require('models/base.js');
const  mongoose = require('mongoose');

class syncModel extends baseModel {
  getName() {
    return 'interface_auto_sync';
  }

  getSchema() {
    return {
      uid: { type: Number},
      project_id: { type: Number, required: true },
      //是否开启自动同步
      is_sync_open: { type: Boolean, default: false },
      //自动同步定时任务的cron表达式
      sync_cron: String,
      //自动同步获取json的url
      sync_json_url: String,
      //接口合并模式  good,nomarl等等 意思也就是智能合并,完全覆盖等
      sync_mode: String,
      //上次成功同步接口时间,
      last_sync_time: Number,
      //上次同步的swagger 文档内容
      old_swagger_content: String,
      add_time: Number,
      up_time: Number,
    };
  }

  getByProjectId(id) {
    return this.model.findOne({
      project_id: id
    }) 
  }

  delByProjectId(project_id){
    return this.model.remove({
      project_id: project_id
    })
  }

  save(data) {
    data.up_time = yapi.commons.time();
    let m = new this.model(data);
    return m.save();
  }

  listAll() {
    return this.model
      .find({})
      .select(
        '_id uid project_id add_time up_time is_sync_open sync_cron sync_json_url sync_mode old_swagger_content last_sync_time'
      )
      .sort({ _id: -1 })
      .exec();
  }

  up(data) {
    let id = data.id;
    delete data.id;
    data.up_time = yapi.commons.time();
    return this.model.update({
      _id: id
    }, data)
  }

  upById(id, data) {
    delete data.id;
    data.up_time = yapi.commons.time();
    return this.model.update({
      _id: id
    }, data)
  }

  del(id){
    return this.model.remove({
      _id: id
    })
  }

  delByProjectId(projectId){
    return this.model.remove({
      project_id: projectId
    })
  }

}

module.exports = syncModel;