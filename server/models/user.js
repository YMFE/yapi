const baseModel = require('./base.js');

class userModel extends baseModel {
  getName() {
    return 'user';
  }

  getSchema() {
    return {
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      passsalt: String,
      study: { type: Boolean, default: false },
      role: String,
      add_time: Number,
      up_time: Number,
      type: { type: String, enum: ['site', 'third'], default: 'site' } //site用户是网站注册用户, third是第三方登录过来的用户
    };
  }

  save(data) {
    let user = new this.model(data);
    return user.save();
  }

  checkRepeat(email) {
    return this.model.countDocuments({
      email: email
    });
  }

  list() {
    return this.model
      .find()
      .select('_id username email role type  add_time up_time study')
      .exec(); //显示id name email role
  }

  findByUids(uids) {
    return this.model
      .find({
        _id: { $in: uids }
      })
      .select('_id username email role type  add_time up_time study')
      .exec();
  }

  listWithPaging(page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model
      .find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('_id username email role type  add_time up_time study')
      .exec();
  }

  listCount() {
    return this.model.countDocuments();
  }

  findByEmail(email) {
    return this.model.findOne({ email: email });
  }

  findById(id) {
    return this.model.findOne({
      _id: id
    });
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  update(id, data) {
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  search(keyword) {
    return this.model
      .find(
        {
          $or: [{ email: new RegExp(keyword, 'i') }, { username: new RegExp(keyword, 'i') }]
        },
        {
          passsalt: 0,
          password: 0
        }
      )
      .limit(10);
  }
}

module.exports = userModel;
