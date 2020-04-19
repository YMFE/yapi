const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceAutoReport extends baseModel {
  getName() {
    return 'interface_auto_report';
  }

  getSchema() {
    return {
      uid: { type: Number, required: true },
      desc: String,
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 },
      report: { type: String, default: '{}' },
      checkHttpCodeIs200: {
        type:Boolean,
        default: false
      },
      checkResponseSchema: {
        type:Boolean,
        default: false
      },
      checkResponseField: {
        name: {
          type: String,
          required: true,
          default: "code"
        },
        value: {
          type: String,
          required: true,
          default: "0"
        },
        enable: {
          type: Boolean,
          default: false
        }
      },
      checkScript: {
        content: {
          type: String
        },
        enable: {
          type: Boolean,
          default: false
        }
      }
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


  list(col_id) {
    return this.model
      .find({
        col_id: col_id
      })
      .select('name uid col_id desc add_time up_time, index')
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

  upColIndex(id, index) {
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

module.exports = interfaceAutoReport;
