const baseModel = require('./base')

class interfaceChain extends baseModel {
  getName() {
    return 'interface_chain'
  }
  getSchema() {
    return {
      interface_id: {
        type: Number,
        required: true,
      },
      stream: {
        type: String,
        enum: ['up', 'down'],
        default: 'down',
      },
      uid: {
        type: Number,
      },
      proj_info: {
        type: String,
      },
      api_info: {
        type: String,
      },
      manager: [
        {
          uid: Number,
          name: String,
          email: String,
        },
      ],
    }
  }

  add(data) {
    let interfaceChain = this.model(data)
    return interfaceChain.save()
  }

  update(_id, data) {
    return this.model.update({ _id }, data)
  }
  remove(_id) {
    return this.model.remove({
      _id,
    })
  }
  listByInterface({ interface_id, stream = 'down' }) {
    return this.model
      .find({
        interface_id,
        stream,
      })
      .exec()
  }
}

module.exports = interfaceChain
