const moment = require('moment');
const baseModel = require('./base.js');

const schema = {
  /** 创建的用户 ID */
  uid: { type: Number, required: true },
  /** 导入数据合并模式：普通、智能、覆盖 */
  mode: { type: String, enum: ['normal', 'good', 'merge'], required: true },
  /** 导入数据来源 */
  source: {
    /** 数据类型，暂时只有 swagger */
    type: { type: String, enum: ['swagger'], required: true },
    /** 数据地址 */
    url: { type: String, required: true }
  },
  /** 导入目标 */
  target: {
    /** 项目 ID */
    project_id: { type: Number, required: true },
    /** 分类 ID */
    cat_id: { type: Number, required: true }
  },
  /** 每隔 x 秒执行一次，目前至少应为 60，即一分钟 */
  interval: { type: Number, min: 60, required: true },
  /** 定时的直观描述 */
  interval_human: { type: String, required: true },
  /** 下一次运行时间，以 unix 时间戳表示 */
  next_run_at: { type: Number, required: true },
  /** 是否正在运行 */
  running: { type: Boolean, default: false },
  /** 是否禁用 */
  disabled: { type: Boolean, default: false }
};

const allFields = '_id ' + Object.keys(schema).join(' ');

class importDataCronJobModel extends baseModel {
  getName() {
    return 'import_data_cron_job';
  }

  getSchema() {
    return schema;
  }

  save(data) {
    const m = new this.model(data);
    return m.save();
  }

  getJobsByProjectId(project_id) {
    return this.model
      .find({
        'target.project_id': project_id
      })
      .sort({ _id: -1 })
      .select(allFields)
      .exec();
  }

  getRunnableJobs() {
    const now = moment().unix();
    return this.model
      .find({
        running: false,
        disabled: false,
        next_run_at: { $lte: now }
      })
      .select(allFields)
      .exec();
  }

  update(id, data) {
    return this.model.update(
      { _id: id },
      data
    );
  }

  delete(id) {
    return this.model.remove({
      _id: id
    });
  }

  updateDisabled(id, disabled) {
    return this.model.update(
      { _id: id },
      { disabled }
    );
  }
}

module.exports = importDataCronJobModel;