const baseController = require('./base.js')
const yapi = require('../yapi.js')
const ruleModel = require('../models/rule.js')

class interfaceTemplateController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.Model = yapi.getInst(ruleModel)
    const commonField = {
      title: 'string',
      desc: 'string',
      username: 'string',
      uid: 'number',
      project_id: 'number',
      mock_script: 'string',
    }
    this.schemaMap = {
      add: Object.assign(
        {
          add_time: 'number',
        },
        commonField,
      ),
      up: Object.assign(
        {
          '*id': 'number',
          up_time: 'number',
        },
        commonField,
      ),
      del: { id: 'number' },
    }
  }
  /**
   * 添加模版接口
   * TODO: 权限相关问题、登陆验证相关问题
   * */
  async add(ctx) {
    let params = ctx.params
    if (!this.$tokenAuth) {
      let auth = await this.checkAuth(params.project_id, 'project', 'edit')
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 40033, '没有权限'))
      }
    }

    if (!params.title || !params.mock_script) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '参数错误'))
    }
    params.uid = this.getUid()
    params.username = this.getUsername()

    params.add_time = yapi.commons.time()
    params.up_time = yapi.commons.time()

    //判断是否名字相同
    let getNameResult = await this.Model.findTitle(params.title)
    if (getNameResult.length > 0) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '模版名称不能重复'))
    }
    let result = await this.Model.save(params)
    ctx.body = yapi.commons.resReturn(result)
  }
  /* 模版列表接口
   * project_id必传
   *
   */
  async list(ctx) {
    let project_id = ctx.request.query.project_id
    //project_id必传
    if (!project_id) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        400,
        'project_id不能为空',
      ))
    }
    let result = await this.Model.list(project_id)
    ctx.body = yapi.commons.resReturn(result)
  }
  /**
   * 删除接口
   */
  async del(ctx) {
    let id = ctx.params.id
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, 'id不能为空'))
    }
    let detail = await this.Model.get(id)
    //删除权限控制
    if (detail.uid != this.getUid()) {
      let auth = await this.checkAuth(detail.project_id, 'project', 'danger')
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'))
      }
    }
    let result = await this.Model.del(id)
    ctx.body = yapi.commons.resReturn(result)
  }
  /**
   * 编辑接口
   */
  async up(ctx) {
    let params = ctx.params
    let detail = await this.Model.get(params.id)
    //编辑权限控制
    if (detail.uid != this.getUid()) {
      let auth = await this.checkAuth(detail.project_id, 'project', 'danger')
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'))
      }
    }

    if (!params.title || !params.mock_script) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '参数错误'))
    }

    params.uid = this.getUid()
    params.username = this.getUsername()
    params.up_time = yapi.commons.time()
    let template_id = params.id
    let result = await this.Model.up(template_id, params)
    ctx.body = yapi.commons.resReturn(result)
  }

  /**
   * 搜索接口
   */
  async search(ctx) {
    const key = ctx.request.query.key
    let result = await this.Model.search(key)
    ctx.body = yapi.commons.resReturn(result)
  }
}
module.exports = interfaceTemplateController
