const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceCol extends baseModel {
  getName() {
    return 'interface_col';
  }

  getSchema() {
    return {
      name: { type: String, required: true },
      uid: { type: Number, required: true },
      project_id: { type: Number, required: true },
      parent_id: { type: Number, required: true },
      desc: String,
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 },
      test_report: { type: String, default: '{}' },
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

  checkRepeat(name) {
    return this.model.countDocuments({
      name: name
    });
  }

  list(project_id, parent_id = -1, query_text) {
    if (!query_text) {
      return this.model
      .find({
        project_id,
        parent_id,

      })
      .sort({ index: 1 })
      .select('name uid project_id desc add_time up_time, index, parent_id')
      .exec();
    }
    return this.model
      .find({
        project_id,
        parent_id,
        name: new RegExp(query_text + "+", "g"),
      })
      .sort({ index: 1 })
      .select('name uid project_id desc add_time up_time, index, parent_id')
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

module.exports = interfaceCol;
