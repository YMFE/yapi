const yapi = require('../yapi.js');
const baseModel = require('./base.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class logModel extends baseModel {
  getName() {
    return 'log';
  }

  getSchema() {
    return {
      uid: { type: Number, required: true },
      typeid: { type: Number, required: true },
      type: {
        type: String,
        enum: ['user', 'group', 'interface', 'project', 'other', 'interface_col'],
        required: true
      },
      content: { type: String, required: true },
      username: { type: String, required: true },
      add_time: Number,
      data: Schema.Types.Mixed //用于原始数据存储
    };
  }

  /**
   * @param {String} content log内容
   * @param {Enum} type log类型， ['user', 'group', 'interface', 'project', 'other']
   * @param {Number} uid 用户id
   * @param {String} username 用户名
   * @param {Number} typeid 类型id
   * @param {Number} add_time 时间
   */
  save(data) {
    let saveData = {
      content: data.content,
      type: data.type,
      uid: data.uid,
      username: data.username,
      typeid: data.typeid,
      add_time: yapi.commons.time(),
      data: data.data
    };

    let log = new this.model(saveData);

    return log.save();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  list(typeid, type) {
    return this.model
      .find({
        typeid: typeid,
        type: type
      })
      .exec();
  }

  listWithPaging(typeid, type, page, limit, selectValue) {
    page = parseInt(page);
    limit = parseInt(limit);
    const params = {
      type: type,
      typeid: typeid
    };

    if (selectValue === 'wiki') {
      params['data.type'] = selectValue;
    }
    if (selectValue && !isNaN(selectValue)) {
      params['data.interface_id'] = +selectValue;
    }
    return this.model
      .find(params)
      .sort({ add_time: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
  listWithPagingByGroup(typeid, pidList, page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model
      .find({
        $or: [
          {
            type: 'project',
            typeid: { $in: pidList }
          },
          {
            type: 'group',
            typeid: typeid
          }
        ]
      })
      .sort({ add_time: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
  listCountByGroup(typeid, pidList) {
    return this.model.countDocuments({
      $or: [
        {
          type: 'project',
          typeid: { $in: pidList }
        },
        {
          type: 'group',
          typeid: typeid
        }
      ]
    });
  }
  listCount(typeid, type, selectValue) {
    const params = {
      type: type,
      typeid: typeid
    };

    if (selectValue === 'wiki') {
      params['data.type'] = selectValue;
    }

    if (selectValue && !isNaN(selectValue)) {
      params['data.interface_id'] = +selectValue;
    }
    return this.model.countDocuments(params);
  }

  listWithCatid(typeid, type, interfaceId) {
    const params = {
      type: type,
      typeid: typeid
    };
    if (interfaceId && !isNaN(interfaceId)) {
      params['data.interface_id'] = +interfaceId;
    }
    return this.model
      .find(params)
      .sort({ add_time: -1 })
      .limit(1)
      .select('uid content type username typeid add_time')
      .exec();
  }
}

module.exports = logModel;
