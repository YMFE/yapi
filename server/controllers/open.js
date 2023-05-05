const projectModel = require('../models/project.js')
const groupModel = require('../models/group.js')
const interfaceColModel = require('../models/interfaceCol.js')
const interfaceCaseModel = require('../models/interfaceCase.js')
const interfaceModel = require('../models/interface.js')
const interfaceCatModel = require('../models/interfaceCat.js')
const followModel = require('../models/follow.js')
const userModel = require('../models/user.js')
const docModel = require('../../exts/yapi-plugin-ke-wiki/wikiModel.js')
const yapi = require('../yapi.js')
const baseController = require('./base.js')
const {
  handleParams,
  crossRequest,
  handleCurrDomain,
  checkNameIsExistInArray,
} = require('../../common/postmanLib')
const commons = require('../utils/commons.js')
const { handleParamsValue, ArrayToObject } = require('../../common/utils.js')
const renderToHtml = require('../utils/reportHtml')
// const axios = require('axios');
const HanldeImportData = require('../../common/HandleImportData')
const _ = require('underscore')

/**
 * {
 *    postman: require('./m')
 * }
 */
const importDataModule = {}
yapi.emitHook('import_data', importDataModule)

class openController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.projectModel = yapi.getInst(projectModel)
    this.groupModel = yapi.getInst(groupModel)
    this.interfaceColModel = yapi.getInst(interfaceColModel)
    this.interfaceCaseModel = yapi.getInst(interfaceCaseModel)
    this.interfaceModel = yapi.getInst(interfaceModel)
    this.interfaceCatModel = yapi.getInst(interfaceCatModel)
    this.followModel = yapi.getInst(followModel)
    this.userModel = yapi.getInst(userModel)
    this.docModel = yapi.getInst(docModel)
    this.handleValue = this.handleValue.bind(this)
    this.schemaMap = {
      runAutoTest: {
        '*id': 'number',
        project_id: 'string',
        token: 'string',
        mode: {
          type: 'string',
          default: 'html',
        },
        email: {
          type: 'boolean',
          default: false,
        },
        download: {
          type: 'boolean',
          default: false,
        },
        closeRemoveAdditional: true,
      },
      importData: {
        '*type': 'string',
        url: 'string',
        '*token': 'string',
        json: 'string',
        project_id: 'string',
        merge: {
          type: 'string',
          default: 'normal',
        },
      },
    }
  }

  async importData(ctx) {
    let type = ctx.params.type
    let content = ctx.params.json
    let project_id = ctx.params.project_id
    let dataSync = ctx.params.merge
    let token = ctx.params.token
    if (!type || !importDataModule[type]) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        40022,
        '不存在的导入方式',
      ))
    }

    if (!content && !ctx.params.url) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        40022,
        'json 或 url 参数不能为空',
      ))
    }
    try {
      let request = require('request') // let Promise = require('Promise');
      let syncGet = function(url) {
        return new Promise(function(resolve, reject) {
          request.get({ url: url }, function(error, response, body) {
            if (error) {
              reject(error)
            } else {
              resolve(body)
            }
          })
        })
      }
      if (ctx.params.url) {
        content = await syncGet(ctx.params.url)
      } else if (
        content.indexOf('http://') === 0 ||
        content.indexOf('https://') === 0
      ) {
        content = await syncGet(content)
      }
      content = JSON.parse(content)
    } catch (e) {
      return (ctx.body = yapi.commons.resReturn(null, 40022, 'json 格式有误'))
    }

    let menuList = await this.interfaceCatModel.list(project_id)
    let selectCatid = menuList[0]._id
    let projectData = await this.projectModel.get(project_id)
    let res = await importDataModule[type](content)

    let successMessage
    let errorMessage = []
    await HanldeImportData(
      res,
      project_id,
      selectCatid,
      menuList,
      [],
      projectData.basePath,
      dataSync,
      'example',
      err => {
        errorMessage.push(err)
      },
      msg => {
        successMessage = msg
      },
      () => {},
      token,
      yapi.WEBCONFIG.port,
    )

    if (errorMessage.length > 0) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        404,
        errorMessage.join('\n'),
      ))
    }
    ctx.body = yapi.commons.resReturn(null, 0, successMessage)
  }

  async projectInterfaceData(ctx) {
    ctx.body = 'projectInterfaceData'
  }

  handleValue(val, global) {
    let globalValue = ArrayToObject(global)
    let context = Object.assign({}, { global: globalValue }, this.records)
    return handleParamsValue(val, context)
  }

  handleEvnParams(params) {
    let result = []
    Object.keys(params).map(item => {
      if (/env_/gi.test(item)) {
        let curEnv = yapi.commons.trim(params[item])
        let value = { curEnv, project_id: item.split('_')[1] }
        result.push(value)
      }
    })
    return result
  }
  async runAutoTest(ctx) {
    if (!this.$tokenAuth) {
      return (ctx.body = yapi.commons.resReturn(null, 40022, 'token 验证失败'))
    }
    // console.log(1231312)
    const token = ctx.query.token

    const projectId = ctx.params.project_id
    const startTime = new Date().getTime()
    const records = (this.records = {})
    const reports = (this.reports = {})
    const testList = []
    let id = ctx.params.id
    let curEnvList = this.handleEvnParams(ctx.params)

    let colData = await this.interfaceColModel.get(id)
    if (!colData) {
      return (ctx.body = yapi.commons.resReturn(null, 40022, 'id值不存在'))
    }

    let projectData = await this.projectModel.get(projectId)

    let caseList = await yapi.commons.getCaseList(id)
    if (caseList.errcode !== 0) {
      ctx.body = caseList
    }
    caseList = caseList.data
    for (let i = 0, l = caseList.length; i < l; i++) {
      let item = caseList[i]
      let projectEvn = await this.projectModel.getByEnv(item.project_id)

      item.id = item._id
      let curEnvItem = _.find(curEnvList, key => {
        return key.project_id == item.project_id
      })

      item.case_env = curEnvItem
        ? curEnvItem.curEnv || item.case_env
        : item.case_env
      item.req_headers = this.handleReqHeader(
        item.req_headers,
        projectEvn.env,
        item.case_env,
      )
      item.pre_script = projectData.pre_script
      item.after_script = projectData.after_script
      item.env = projectEvn.env
      let result
      // console.log('item',item.case_env)
      try {
        result = await this.handleTest(item)
      } catch (err) {
        result = err
      }

      reports[item.id] = result
      records[item.id] = {
        params: result.params,
        body: result.res_body,
      }
      testList.push(result)
    }

    function getMessage(testList) {
      let successNum = 0,
        failedNum = 0,
        len = 0,
        msg = ''
      testList.forEach(item => {
        len++
        if (item.code === 0) {
          successNum++
        } else {
          failedNum++
        }
      })
      if (failedNum === 0) {
        msg = `一共 ${len} 测试用例，全部验证通过`
      } else {
        msg = `一共 ${len} 测试用例，${successNum} 个验证通过， ${failedNum} 个未通过。`
      }

      return { msg, len, successNum, failedNum }
    }

    const endTime = new Date().getTime()
    const executionTime = (endTime - startTime) / 1000

    let reportsResult = {
      message: getMessage(testList),
      runTime: executionTime + 's',
      numbs: testList.length,
      list: testList,
    }

    if (ctx.params.email === true && reportsResult.message.failedNum !== 0) {
      let autoTestUrl = `${ctx.request.origin}/api/open/run_auto_test?id=${id}&token=${token}&mode=${ctx.params.mode}`
      yapi.commons.sendNotice(projectId, {
        title: `落兵台自动化测试报告`,
        content: `
        <html>
        <head>
        <title>测试报告</title>
        <meta charset="utf-8" />
        <body>
        <div>
        <h3>测试结果：</h3>
        <p>${reportsResult.message.msg}</p>
        <h3>测试结果详情如下：</h3>
        <p>${autoTestUrl}</p>
        </div>
        </body>
        </html>`,
      })
    }
    let mode = ctx.params.mode || 'html'
    if (ctx.params.download === true) {
      ctx.set('Content-Disposition', `attachment; filename=test.${mode}`)
    }
    if (ctx.params.mode === 'json') {
      return (ctx.body = reportsResult)
    } else {
      return (ctx.body = renderToHtml(reportsResult))
    }
  }

  async handleTest(interfaceData) {
    let requestParams = {}
    let options
    options = handleParams(interfaceData, this.handleValue, requestParams)
    let result = {
      id: interfaceData.id,
      name: interfaceData.casename,
      path: interfaceData.path,
      code: 400,
      validRes: [],
    }
    try {
      let data = await crossRequest(
        options,
        interfaceData.pre_script,
        interfaceData.after_script,
      )
      let res = data.res

      result = Object.assign(result, {
        status: res.status,
        statusText: res.statusText,
        url: data.req.url,
        method: data.req.method,
        data: data.req.data,
        headers: data.req.headers,
        res_header: res.header,
        res_body: res.body,
      })
      if (options.data && typeof options.data === 'object') {
        requestParams = Object.assign(requestParams, options.data)
      }

      let validRes = []

      let responseData = Object.assign(
        {},
        {
          status: res.status,
          body: res.body,
          header: res.header,
          statusText: res.statusText,
        },
      )

      await this.handleScriptTest(
        interfaceData,
        responseData,
        validRes,
        requestParams,
      )
      result.params = requestParams
      if (validRes.length === 0) {
        result.code = 0
        result.validRes = [{ message: '验证通过' }]
      } else if (validRes.length > 0) {
        result.code = 1
        result.validRes = validRes
      }
    } catch (data) {
      result = Object.assign(options, result, {
        res_header: data.header,
        res_body: data.body || data.message,
        status: null,
        statusText: data.message,
        code: 400,
      })
    }

    return result
  }

  async handleScriptTest(interfaceData, response, validRes, requestParams) {
    try {
      let test = await yapi.commons.runCaseScript(
        {
          response: response,
          records: this.records,
          script: interfaceData.test_script,
          params: requestParams,
        },
        interfaceData.col_id,
        interfaceData._id,
      )
      if (test.errcode !== 0) {
        test.data.logs.forEach(item => {
          validRes.push({
            message: item,
          })
        })
      }
    } catch (err) {
      validRes.push({
        message: 'Error: ' + err.message,
      })
    }
  }

  handleReqHeader(req_header, envData, curEnvName) {
    let currDomain = handleCurrDomain(envData, curEnvName)

    let header = currDomain.header
    header.forEach(item => {
      if (!checkNameIsExistInArray(item.name, req_header)) {
        item.abled = true
        req_header.push(item)
      }
    })
    req_header = req_header.filter(item => {
      return item && typeof item === 'object'
    })
    return req_header
  }

  /**
   * 获取项目分组列表
   * @interface /open/get_cat_list
   * @method get
   * @category group
   * @foldnumber 10
   * @returns {Object}
   * @example /api/open/get_cat_list
   */
  async getGrouplist(ctx) {
    var groupInst = yapi.getInst(groupModel)
    const authUser = ctx.query.user
    let result = await groupInst.list()
    if (!authUser) {
      return (ctx.body = {
        code: 0,
        data: result,
        msg: '获取成功',
      })
    }

    let uid = await this.getUidByUserName(authUser)
    if (!uid) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: 'user not found',
      })
    }
    let newResult = []
    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].toObject()
        result[i].role = await this.getProjectRole(result[i]._id, 'group', uid)
        if (result[i].role !== 'member') {
          newResult.unshift(result[i])
        }
      }
    }
    return (ctx.body = {
      code: 0,
      data: newResult,
      msg: '获取成功',
    })
  }

  /**
   * 创建项目
   * @interface /open/create_project
   * @method POST
   * @category project
   * @foldnumber 10
   * @param {String} name 项目名称，不能为空
   * @param {String} basepath 项目基本路径，不能为空
   * @param {Number} group_id 项目分组id，不能为空
   * @param {Number} group_name 项目分组名称，不能为空
   * @param {String} project_type private public
   * @param  {String} [desc] 项目描述
   * @returns {Object}
   * @example ./api/open/create_project
   */
  async createProject(ctx) {
    let params = ctx.params
    if (!(params.user && params.name && params.group_id && params.group_name)) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: '缺少必填字段',
      })
    }
    const authUser = params.user
    let uid = await this.getUidByUserName(authUser)

    if (!uid) {
      return (ctx.body = {
        code: 404,
        data: null,
        msg: 'user not found',
      })
    }
    if (
      (await this.checkAuth(params.group_id, 'group', 'edit', uid)) !== true
    ) {
      return (ctx.body = {
        code: 405,
        data: null,
        msg: '用户无权限',
      })
    }

    let checkRepeat = await this.projectModel.getRepeatProj(
      params.name,
      params.group_id,
    )

    if (checkRepeat) {
      return (ctx.body = {
        code: 0,
        data: {
          id: checkRepeat['_id'],
        },
        msg: '已存在的项目',
      })
    }

    let data = {
      name: params.name,
      desc: params.desc,
      basepath: '',
      members: [],
      project_type: 'public',
      uid: uid,
      group_id: params.group_id,
      group_name: params.group_name,
      icon: params.icon,
      color: params.color,
      add_time: yapi.commons.time(),
      up_time: yapi.commons.time(),
      is_json5: false,
      env: [{ name: 'local', domain: 'http://127.0.0.1' }],
    }

    let result = await this.projectModel.save(data)
    let colInst = yapi.getInst(interfaceColModel)
    let catInst = yapi.getInst(interfaceCatModel)
    if (result._id) {
      await colInst.save({
        name: '公共测试集',
        project_id: result._id,
        desc: '公共测试集',
        uid: uid,
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time(),
      })
      await catInst.save({
        name: '公共分类',
        project_id: result._id,
        desc: '公共分类',
        uid: uid,
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time(),
      })
    }
    // 将项目添加者变成项目组长,除admin以外
    // if (this.getRole() !== 'admin') {
    let userdata = await yapi.commons.getUserdata(uid, 'owner')
    await this.projectModel.addMember(result._id, [userdata])
    // }
    // let username = this.getUsername()
    yapi.commons.saveLog({
      content: `<a href="/user/profile/${uid}">${authUser}</a> 添加了项目 <a href="/project/${result._id}">${params.name}</a>`,
      type: 'project',
      uid,
      username: authUser,
      typeid: result._id,
    })
    yapi.emitHook('project_add', result).then()
    // ctx.body = yapi.commons.resReturn(result)
    return (ctx.body = {
      code: 0,
      data: {
        id: result['_id'],
      },
      msg: '创建成功',
    })
  }

  /**
   * 用于 mock sdk 接口
   * @path /api/open/get_proj_mock_list
   * @param {*} ctx
   */
  async getProjMockList(ctx) {
    const pid = ctx.query.pid
    if (!pid) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: '缺失 pid',
      })
    }
    let pidList = pid.split(',')
    pidList = [...new Set(pidList)]

    let mockList = []
    for (let pItem of pidList) {
      let list = await this.interfaceModel.list(
        {
          project_id: pItem,
          record_type: {
            $in: [0],
          },
        },
        'path method title status',
      )
      const apiList = list.map(item => ({
        path: item.path,
        method: item.method,
        api_id: item._id,
        api_name: item.title,
        api_status: item.status,
      }))
      list = list.map(item => item.path)

      mockList.push({
        mock_paths: list,
        api_data: apiList,
      })
    }
    return (ctx.body = yapi.commons.resReturn({ mock_list: mockList }))
  }

  /**
   * @path /api/open/get_proj_api
   * @param {*} ctx
   */
  async getProjApi(ctx) {
    const pid = ctx.query.pid
    if (!pid) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: '缺失 pid',
      })
    }
    const dataFilter =
      'query_path method title status username tag path req_params res_body_type req_query req_headers req_body_form res_body up_time add_time interface_type'

    // 兼容黄老师的接口
    let list = await this.interfaceModel.list(
      {
        project_id: pid,
        record_type: {
          $in: [0],
        },
      },
      dataFilter,
    )
    let env = await this.projectModel.getByEnv(pid)
    return (ctx.body = yapi.commons.resReturn({
      list: list,
      env: env ? env.env : [],
    }))
  }

  /**
   * 通过 groupid 获取项目列表
   * @path /api/open/get_proj_list
   * @param {number} gid 分组 id
   */
  async getProjList(ctx) {
    const gid = ctx.query.gid
    if (!gid) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: '缺失 gid',
      })
    }

    let list = await this.projectModel.list(gid)
    return (ctx.body = yapi.commons.resReturn(list))
  }

  /**
   * 根据项目名搜索项目
   * @param {string} pName
   */
  async searchProject(ctx) {
    const pName = ctx.query.keyword
    const pList = await this.projectModel.search(pName, 'name')
    return (ctx.body = {
      code: 0,
      data: {
        list: pList,
      },
      msg: '获取列表成功',
    })
  }

  /**
   * 依层级获取子节点
   *  注： filter 仅用于筛选 interface & dir
   * @param {*} parentId
   * @returns
   * @memberof interfaceController
   */
  async getDescendants(parentId, filter) {
    let list = []
    let children
    if (filter) {
      children = await this.interfaceModel.list({
        parent_id: parentId,
        record_type: {
          $in: [0, 2],
        },
      })
    } else {
      children = await this.interfaceModel.listByParentId(parentId)
    }
    for (let i = 0; i < children.length; i++) {
      let item = children[i].toObject()
      if (item['record_type'] === 2) {
        let descendants = await this.getDescendants(item['_id'], filter)
        item['list'] = descendants
      }
      list.push(item)
    }
    return list
  }

  /**
   * filter 参数用于适配导入接口到测试用例，仅获取 api list
   *
   * @returns
   * @memberof interfaceController
   * @example ./api/open/interface/list_menu
   */
  async listProjectMenu(ctx) {
    let project_id = ctx.params.pid
    if (!project_id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '缺失项目 id'))
    }

    let project = await this.projectModel.getBaseInfo(project_id)
    if (!project) {
      return (ctx.body = yapi.commons.resReturn(null, 406, '不存在的项目'))
    }

    if (project.project_type === 'private') {
      return (ctx.body = yapi.commons.resReturn(
        null,
        406,
        '当前项目未公开，请联系管理员',
      ))
    }

    try {
      let result = await this.interfaceCatModel.list(project_id),
        newResult = []
      for (let i = 0, item, list; i < result.length; i++) {
        item = result[i].toObject()

        list = await this.interfaceModel.list({
          catid: item._id,
          parent_id: '',
          record_type: {
            $in: [0, 2],
          },
        })

        for (let j = 0; j < list.length; j++) {
          list[j] = list[j].toObject()
          if (list[j]['record_type'] === 2) {
            list[j]['list'] = await this.getDescendants(list[j]['_id'], true)
          }
        }
        item.itemType = 'cat'
        item.list = list
        newResult[i] = item
      }
      ctx.body = yapi.commons.resReturn(newResult)
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 402, err.message)
    }
  }

  /**
   * 获取接口 detail
   * @interface /open/interface/detail
   * @method GET
   * @category interface
   * @foldnumber 10
   * @param {Number}   id 接口id，不能为空
   * @returns {Object}
   */
  async getInterfaceDetail(ctx) {
    let params = ctx.params
    if (!params.id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '接口 id 不能为空'))
    }
    try {
      let result = await this.interfaceModel.get(params.id)
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          490,
          '未查询到指定接口数据',
        ))
      }
      let userinfo = await this.userModel.findById(result.uid)
      let project = await this.projectModel.getBaseInfo(result.project_id)
      if (project.project_type === 'private') {
        return (ctx.body = yapi.commons.resReturn(
          null,
          406,
          '当前接口所在项目未公开，请联系项目管理员',
        ))
      }
      yapi.emitHook('interface_get', result).then()
      result = result.toObject()
      if (userinfo) {
        result.username = userinfo.username
      }

      ctx.body = yapi.commons.resReturn(result)
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message)
    }
  }

  /**
   * 模糊搜索项目名称或者分组名称或接口名称
   * @interface /open/search
   * @method GET
   * @category project
   * @foldnumber 10
   * @param {String} q
   * @return {Object}
   * @example ./api/open/search.json
   */
  async search(ctx) {
    const { q } = ctx.request.query

    if (!q) {
      return (ctx.body = yapi.commons.resReturn(void 0, 400, '缺失关键词'))
    }

    if (!yapi.commons.validateSearchKeyword(q)) {
      return (ctx.body = yapi.commons.resReturn(void 0, 400, '查询关键词无效'))
    }

    let projectList = await this.projectModel.search(q)
    let groupList = await this.groupModel.search(q)
    let interfaceList = await this.interfaceModel.search(q)
    let docList = await this.docModel.search(q)

    let projectListAuth = []
    let interfaceListAuth = []
    let docListAuth = []

    let promisesProject = projectList.map(item => {
      return new Promise(async (resolve, reject) => {
        let auth = true

        if (item.project_type === 'private') {
          auth = false
        }
        if (auth === true) {
          projectListAuth.push(item)
        }
        resolve(auth)
      })
    })

    let promisesInterface = interfaceList.map(item => {
      return new Promise(async (resolve, reject) => {
        let projectInfo = await this.projectModel.getBaseInfo(item.project_id)
        let auth = true
        if (projectInfo) {
          projectInfo = projectInfo.toObject()

          if (projectInfo.project_type === 'private') {
            auth = false
          }
          if (auth === true) {
            interfaceListAuth.push({
              ...item.toObject(),
              project_name: projectInfo.name,
            })
          }
        } else {
          auth = false
        }

        resolve(auth)
      })
    })

    let promisesDoc = docList.map(item => {
      return new Promise(async (resolve, reject) => {
        let projectInfo = await this.projectModel.getBaseInfo(item.project_id)
        let auth = true
        if (projectInfo) {
          projectInfo = projectInfo.toObject()
          if (projectInfo.project_type === 'private') {
            auth = false
          }
          if (auth === true) {
            docListAuth.push({
              ...item.toObject(),
              project_name: projectInfo.name,
            })
          }
        } else {
          auth = false
        }
        resolve(auth)
      })
    })

    const promises = promisesProject.concat(promisesInterface, promisesDoc)
    await Promise.all(promises)

    getResult(projectListAuth, interfaceListAuth, docListAuth)

    function getResult(projectList, interfaceList, docListAuth) {
      let projectRules = [
        '_id',
        'name',
        'basepath',
        'uid',
        'env',
        'members',
        { key: 'group_id', alias: 'groupId' },
        { key: 'up_time', alias: 'upTime' },
        { key: 'add_time', alias: 'addTime' },
      ]
      let groupRules = [
        '_id',
        'uid',
        { key: 'group_name', alias: 'groupName' },
        { key: 'group_desc', alias: 'groupDesc' },
        { key: 'add_time', alias: 'addTime' },
        { key: 'up_time', alias: 'upTime' },
      ]
      let interfaceRules = [
        '_id',
        'uid',
        'project_name',
        { key: 'title', alias: 'title' },
        { key: 'project_id', alias: 'projectId' },
        { key: 'add_time', alias: 'addTime' },
        { key: 'up_time', alias: 'upTime' },
      ]

      projectList = commons.filterRes(projectList, projectRules)
      groupList = commons.filterRes(groupList, groupRules)
      interfaceList = commons.filterRes(interfaceList, interfaceRules)
      let queryList = {
        project: projectList,
        group: groupList,
        interface: interfaceList,
        doc: docListAuth,
      }

      return (ctx.body = yapi.commons.resReturn(queryList, 0, 'ok'))
    }
  }
  /**
   * 通过 wiki id 获取 wiki detail
   * @interface open/doc/detail
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getDocDetail(ctx) {
    try {
      let { id } = ctx.request.query
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '文档 id 不能为空',
        ))
      }
      let result = await this.docModel.getById(id)
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 490, '该内容不存在'))
      }
      const { desc, markdown, title, project_id } = result
      return (ctx.body = yapi.commons.resReturn({
        html: desc,
        markdown: markdown,
        title,
        project_id,
      }))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   * 获取 wiki menu tree
   * @param {*} ctx
   */
  async getDocTree(ctx) {
    try {
      let project_id = ctx.request.query.pid
      if (!project_id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '项目 id 不能为空',
        ))
      }
      let result = await this.docModel.getListByProjectid(project_id)
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].toObject()
        result[i]['list'] = await this.getDocDescendants(result[i]['_id'])
      }
      return (ctx.body = yapi.commons.resReturn(result))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   *获取文档子节点
   *
   * @param {*} parentId
   * @memberof wikiController
   */
  async getDocDescendants(parentId) {
    let list = []
    let children = await this.docModel.listByParentId(parentId)
    for (let i = 0; i < children.length; i++) {
      let item = children[i].toObject()
      let descendants = await this.getDocDescendants(item['_id'])
      item['list'] = descendants
      list.push(item)
    }
    return list
  }
}

module.exports = openController
