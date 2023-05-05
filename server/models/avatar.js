const yapi = require('../yapi.js')
const baseModel = require('./base.js')

class avatarModel extends baseModel {
  static get ImageTypePNG() {
    return 'image/png'
  }
  static get ImageTypeJPG() {
    return 'image/jpeg'
  }
  static get ImageTypeUrl() {
    return 'image/url'
  }

  getName() {
    return 'avatar'
  }

  getSchema() {
    return {
      uid: { type: Number, required: true },
      basecode: String,
      type: String,
    }
  }

  get(uid) {
    return this.model.findOne({
      uid: uid,
    })
  }

  up(uid, basecode, type) {
    return this.model.update(
      {
        uid: uid,
      },
      {
        type: type,
        basecode: basecode,
      },
      {
        upsert: true,
      },
    )
  }
}

module.exports = avatarModel
