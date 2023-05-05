const baseController = require('controllers/base.js')
const advModel = require('./advMockModel.js')
const yapi = require('yapi.js')
const caseModel = require('./caseModel.js')
const userModel = require('models/user.js')
const interfaceModel = require('models/interface.js')
const interfaceCatModel = require('models/interfaceCat.js')
const config = require('./index.js')
const jsondiffpatch = require('jsondiffpatch')
const formattersHtml = jsondiffpatch.formatters.html
const showDiffMsg = require('../../common/diff-view.js')

class advMockController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.Model = yapi.getInst(advModel)
    this.caseModel = yapi.getInst(caseModel)
    this.userModel = yapi.getInst(userModel)
    this.interfaceModel = yapi.getInst(interfaceModel)
    this.interfaceCatModel = yapi.getInst(interfaceCatModel)
    this.textMap = {
      0: '接口',
      1: '文档',
      2: '目录',
    }
  }

  async getMock(ctx) {
    let id = ctx.query.interface_id
    let mockData = await this.Model.get(id)
    if (!mockData) {
      return (ctx.body = yapi.commons.resReturn(null, 408, 'mock脚本不存在'))
    }
    return (ctx.body = yapi.commons.resReturn(mockData))
  }

  async upMock(ctx) {
    let params = ctx.request.body
    try {
      // 判断权限
      const auth = await this.checkAuth(params.project_id, 'project', 'edit')
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 40033, '没有权限'))
      }

      // 判断 interface_id
      if (!params.interface_id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          408,
          '缺少interface_id',
        ))
      }

      // 判断 project_id
      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 408, '缺少project_id'))
      }

      const username = this.getUsername()
      const userUid = this.getUid()
      const interfaceId = params.interface_id
      const mockScript = params.mock_script || ''
      const projectId = params.project_id
      const mockStatus = params.enable === true ? true : false
      let result

      // mock 更新前数据
      const oldMockData = await this.Model.get(interfaceId)
      // mock 新增或更新的数据
      const data = {
        interface_id: interfaceId,
        mock_script: mockScript,
        project_id: projectId,
        uid: userUid,
        enable: mockStatus,
      }
      if (oldMockData) {
        result = await this.Model.up(data)
      } else {
        result = await this.Model.save(data)
      }

      // mock 更新后数据
      const newMockData = await this.Model.get(interfaceId)

      // diff_view 参数，对比更新前后数据变化，返回变化 list
      const diffParams = {
        diffType: 'mock',
        interface_id: interfaceId,
        current: newMockData,
        old: oldMockData,
      }
      const diffList = showDiffMsg(jsondiffpatch, formattersHtml, diffParams)
      // 有变化，入库
      if (diffList.length > 0) {
        const interfaceInfo = await this.interfaceModel.get(interfaceId)
        const interfaceCatInfo = await this.interfaceCatModel.get(
          interfaceInfo.catid,
        )
        const html = `
          <a href="/user/profile/${userUid}">
            ${username}
          </a> 
          更新了分类 
          <a href="/project/${projectId}/interface/api/cat_${
          interfaceInfo.catid
        }">
            ${interfaceCatInfo.name}
          </a> 
          下的${this.textMap[interfaceInfo.record_type]} 
          <a href="/project/${projectId}/interface/api/${interfaceId}">
            ${interfaceInfo.title}
          </a> 的定制 mock`
        diffParams['cat_id'] = interfaceInfo.catid
        yapi.commons.saveLog({
          content: html,
          type: 'project',
          uid: userUid,
          username: username,
          typeid: projectId,
          data: diffParams,
        })
      }
      return (ctx.body = yapi.commons.resReturn(result))
    } catch (e) {
      return (ctx.body = yapi.commons.resReturn(null, 400, e.message))
    }
  }

  async list(ctx) {
    try {
      let id = ctx.query.interface_id
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '缺少 interface_id',
        ))
      }
      let result = await this.caseModel.list(id)
      for (let i = 0, len = result.length; i < len; i++) {
        let userinfo = await this.userModel.findById(result[i].uid)
        result[i] = result[i].toObject()
        // if (userinfo) {
        result[i].username = userinfo.username
        // }
      }

      ctx.body = yapi.commons.resReturn(result)
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  async getCase(ctx) {
    let id = ctx.query.id
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '缺少 id'))
    }
    let result = await this.caseModel.get({
      _id: id,
    })

    ctx.body = yapi.commons.resReturn(result)
  }

  async saveCase(ctx) {
    let params = ctx.request.body

    if (!params.interface_id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少interface_id'))
    }
    if (!params.project_id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少project_id'))
    }

    if (!params.res_body) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        408,
        '请输入 Response Body',
      ))
    }

    let data = {
      interface_id: params.interface_id,
      project_id: params.project_id,
      ip_enable: params.ip_enable,
      name: params.name,
      params: params.params || [],
      uid: this.getUid(),
      code: params.code || 200,
      delay: params.delay || 0,
      headers: params.headers || [],
      up_time: yapi.commons.time(),
      res_body: params.res_body,
      ip: params.ip,
    }

    data.code = isNaN(data.code) ? 200 : +data.code
    data.delay = isNaN(data.delay) ? 0 : +data.delay
    if (config.httpCodes.indexOf(data.code) === -1) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '非法的 httpCode'))
    }

    let findRepeat, findRepeatParams
    findRepeatParams = {
      project_id: data.project_id,
      interface_id: data.interface_id,
      ip_enable: data.ip_enable,
    }

    if (
      data.params &&
      typeof data.params === 'object' &&
      Object.keys(data.params).length > 0
    ) {
      for (let i in data.params) {
        findRepeatParams['params.' + i] = data.params[i]
      }
    }

    if (data.ip_enable) {
      findRepeatParams.ip = data.ip
    }

    findRepeat = await this.caseModel.get(findRepeatParams)

    if (findRepeat && findRepeat._id !== params.id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '已存在的期望'))
    }

    let result
    if (params.id && !isNaN(params.id)) {
      data.id = +params.id
      result = await this.caseModel.up(data)
    } else {
      result = await this.caseModel.save(data)
    }
    return (ctx.body = yapi.commons.resReturn(result))
  }

  async delCase(ctx) {
    let id = ctx.request.body.id
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少 id'))
    }
    let result = await this.caseModel.del(id)
    return (ctx.body = yapi.commons.resReturn(result))
  }

  async hideCase(ctx) {
    let id = ctx.request.body.id
    let enable = ctx.request.body.enable
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少 id'))
    }
    let data = {
      id,
      case_enable: enable,
    }
    let result = await this.caseModel.up(data)
    return (ctx.body = yapi.commons.resReturn(result))
  }
}

module.exports = advMockController
