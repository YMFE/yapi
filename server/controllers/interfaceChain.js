const yapi = require('yapi')
const baseController = require('./base')
const apiChainModel = require('../models/interfaceChain')
const userModel = require('../models/user')

class apiChainController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.Model = yapi.getInst(apiChainModel)
    this.userModel = yapi.getInst(userModel)
  }

  /**
   * 通过接口 id 获取对应的依赖信息
   * @param {*} ctx
   */
  async getChainById(ctx) {
    let { id } = ctx.request.query
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '接口 id 不能为空'))
    }
    try {
      let list = await this.Model.listByInterface({ interface_id: id })
      ctx.body = yapi.commons.resReturn({
        list,
      })
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 402, err.message)
    }
  }

  /**
   * 新建接口依赖
   * @param {*} ctx
   */
  async addChain(ctx) {
    let params = ctx.request.body
    let uid = this.getUid()
    let { proj_info, api_info, manager, interface_id, stream = 'down' } = params
    if (
      !proj_info ||
      !api_info ||
      !(manager && manager.length !== 0) ||
      !interface_id
    ) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        400,
        '下游接口信息不能为空',
      ))
    }
    let data = {
      uid,
      interface_id,
      proj_info,
      api_info,
      manager,
      stream,
    }
    try {
      let res = await this.Model.add(data)
      return (ctx.body = yapi.commons.resReturn({
        res,
      }))
    } catch (err) {
      return (ctx.body = yapi.commons.resReturn(null, 402, err.message))
    }
  }

  /**
   * 更新接口依赖
   * @param {*} ctx
   */
  async updateChain(ctx) {
    let params = ctx.request.body
    let { proj_info, api_info, manager, id } = params

    if (!(id && proj_info && api_info && manager && manager.length)) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '接口 id 不能为空'))
    }
    let data = {
      proj_info,
      api_info,
      manager,
    }
    try {
      let res = this.Model.update(id, data)
      return (ctx.body = yapi.commons.resReturn({
        res,
      }))
    } catch (err) {
      return (ctx.body = yapi.commons.resReturn(null, 402, err.message))
    }
  }

  /**
   * 删除接口依赖
   * @param {*} ctx
   */
  async removeChain(ctx) {
    let { id } = ctx.request.query
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '接口 id 不能为空'))
    }
    try {
      let res = await this.Model.remove(id)
      return (ctx.body = yapi.commons.resReturn({
        res,
      }))
    } catch (err) {
      return (ctx.body = yapi.commons.resReturn(null, 402, err.message))
    }
  }
}

module.exports = apiChainController
