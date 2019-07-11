const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class projectModel extends baseModel {
  getName() {
    return 'project';
  }

  constructor(){
    super()
    this.handleEnvNullData = this.handleEnvNullData.bind(this)
  }

  getSchema() {
    return {
      uid: { type: Number, required: true },
      name: { type: String, required: true },
      basepath: { type: String },
      switch_notice: { type: Boolean, default: true },
      desc: String,
      group_id: { type: Number, required: true },
      project_type: { type: String, required: true, enum: ['public', 'private'] },
      members: [
        {
          uid: Number,
          role: { type: String, enum: ['owner', 'dev'] },
          username: String,
          email: String,
          email_notice: { type: Boolean, default: true }
        }
      ],
      env: [{ name: String, domain: String, header: Array, global: [{
        name: String,
        value: String
      }] }],
      icon: String,
      color: String,
      add_time: Number,
      up_time: Number,
      pre_script: String,
      after_script: String,
      project_mock_script: String,
      is_mock_open: { type: Boolean, default: false },
      strice: { type: Boolean, default: false },
      is_json5: { type: Boolean, default: true },
      tag: [{name: String, desc: String}]
    };
  }

  updateMember(data) {
    return this.model.update(
      {
        'members.uid': data.uid
      },
      {
        $set: {
          'members.$.username': data.username,
          'members.$.email': data.email
        }
      }
    );
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  handleEnvNullData(data){
    data = data.toObject();
    data.toObject = ()=> data;
    let isFix = false;
    if(Array.isArray(data.env)){
      data.env = data.env.map(item=>{
        item.global = item.global.filter(g=>{
          if(!g || typeof g !== 'object'){
            isFix = true;
            return false;
          }
          return true;
        })
        return item;
      })
    }
    
    if(isFix){
      this.model.update(
        {
          _id: data._id

        },
        {
          $set: { env: data.env }
        },
        { runValidators: true }
      );
    }
    return data;
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec().then(this.handleEnvNullData)
  }

  getByEnv(id) {
    return this.model
      .findOne({
        _id: id
      })
      .select('env')
      .exec().then(this.handleEnvNullData);
  }

  getProjectWithAuth(group_id, uid) {
    return this.model.countDocuments({
      group_id: group_id,
      'members.uid': uid
    });
  }

  getBaseInfo(id, select) {
    select =
      select ||
      '_id uid name basepath switch_notice desc group_id project_type env icon color add_time up_time pre_script after_script project_mock_script is_mock_open strice is_json5 tag';
    return this.model
      .findOne({
        _id: id
      })
      .select(select)
      .exec().then(this.handleEnvNullData);
  }

  getByDomain(domain) {
    return this.model
      .find({
        prd_host: domain
      })
      .exec().then(this.handleEnvNullData);
  }

  checkNameRepeat(name, groupid) {
    return this.model.countDocuments({
      name: name,
      group_id: groupid
    });
  }

  checkDomainRepeat(domain, basepath) {
    return this.model.countDocuments({
      prd_host: domain,
      basepath: basepath
    });
  }

  list(group_id) {
    let params = { group_id: group_id };
    return this.model
      .find(params)
      .select(
        '_id uid name basepath switch_notice desc group_id project_type color icon env add_time up_time'
      )
      .sort({ _id: -1 })
      .exec();
  }

  // 获取项目数量统计
  getProjectListCount() {
    return this.model.countDocuments();
  }

  countWithPublic(group_id) {
    let params = { group_id: group_id, project_type: 'public' };
    return this.model.countDocuments(params);
  }

  listWithPaging(group_id, page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model
      .find({
        group_id: group_id
      })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  listCount(group_id) {
    return this.model.countDocuments({
      group_id: group_id
    });
  }

  countByGroupId(group_id) {
    return this.model.countDocuments({
      group_id: group_id
    });
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByGroupid(groupId) {
    return this.model.remove({
      group_id: groupId
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data,
      { runValidators: true }
    );
  }

  addMember(id, data) {
    return this.model.update(
      {
        _id: id
      },
      {
        // $push: { members: data }
        $push: { members: { $each: data } }
      }
    );
  }

  delMember(id, uid) {
    return this.model.update(
      {
        _id: id
      },
      {
        $pull: { members: { uid: uid } }
      }
    );
  }

  checkMemberRepeat(id, uid) {
    return this.model.countDocuments({
      _id: id,
      'members.uid': uid
    });
  }

  changeMemberRole(id, uid, role) {
    return this.model.update(
      {
        _id: id,
        'members.uid': uid
      },
      {
        $set: { 'members.$.role': role }
      }
    );
  }

  changeMemberEmailNotice(id, uid, notice) {
    return this.model.update(
      {
        _id: id,
        'members.uid': uid
      },
      {
        $set: { 'members.$.email_notice': notice }
      }
    );
  }

  search(keyword) {
    return this.model
      .find({
        name: new RegExp(keyword, 'ig')
      })
      .limit(10);
  }
}

module.exports = projectModel;
