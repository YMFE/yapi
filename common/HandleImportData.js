const _ = require('underscore')
const axios = require('axios')

const isNode = typeof global === 'object' && global.global === global

async function handle(
  res,
  projectId,
  selectCatid,
  menuList,
  selectedMenuList,
  basePath,
  dataSync,
  resImportType,
  messageError,
  messageSuccess,
  callback,
  token,
  port,
) {
  const handleAddCat = async cats => {
    let catsObj = {}
    if (cats && Array.isArray(cats)) {
      for (let i = 0; i < cats.length; i++) {
        let cat = cats[i]
        let findCat = _.find(menuList, menu => menu.name === cat.name)
        catsObj[cat.name] = cat
        if (findCat) {
          cat.id = findCat._id
        } else {
          let apipath = '/api/interface/add'
          if (isNode) {
            apipath = 'http://127.0.0.1:' + port + apipath
          }

          let data = {
            name: cat.name,
            project_id: projectId,
            desc: cat.desc,
            token,
            catid: selectCatid,
            parent_id: '',
            title: cat.name,
            record_type: 2,
            ancestors: '',
            from: 'import',
          }
          let result = await axios.post(apipath, data)

          if (result.data.errcode) {
            messageError(result.data.errmsg)
            callback({ showLoading: false })
            return false
          }
          cat.dirId = result.data.data._id
        }
      }
    }
    return catsObj
  }

  const handleAddInterface = async res => {
    const resCats = res.cats || []
    const cats = await handleAddCat(res.cats)
    /* if (cats === false) {
      return;
    } */
    res = res.apis
    let len = res.length
    let count = 0
    let successNum = len
    let existNum = 0
    if (len === 0) {
      messageError(`解析数据为空`)
      callback({ showLoading: false })
      return
    }

    // 覆盖模式
    // 获取该项目、该 catid 下原有的所有数据的 _id (包括目录和接口)
    // - 对比原数据和导入数据的目录_id 和 接口_id
    // allInfoList 最终为对比之后多出来的 _id 集合，需要进行删除
    let allInfoList = []
    if (dataSync === 'merge') {
      const allInfo = await axios.get(
        `/api/interface/get_all?project_id=${projectId}&cat_id=${selectCatid}`,
      )
      allInfoList =
        (allInfo.data && allInfo.data.data && allInfo.data.data.list) || []
      resCats.length > 0 &&
        resCats.map(item => {
          let idx = allInfoList.findIndex(function(i) {
            return item.id === i._id
          })
          if (idx > -1) {
            allInfoList.splice(idx, 1)
          }
          return item
        })
    }

    for (let index = 0; index < res.length; index++) {
      let item = res[index]
      let data = Object.assign(item, {
        project_id: projectId,
        catid: selectCatid,
        record_type: 0,
        interface_type: 'http',
        parent_id: '',
      })
      if (basePath) {
        data.path =
          data.path.indexOf(basePath) === 0
            ? data.path.substr(basePath.length)
            : data.path
      }
      if (
        data.catname &&
        cats[data.catname] &&
        typeof cats[data.catname] === 'object' &&
        cats[data.catname].dirId
      ) {
        data.parent_id = cats[data.catname].dirId
      }
      data.token = token
      let interfaceId
      let advmock_save = '/api/plugin/advmock/save'
      let hasAdvMock = ''
      if (dataSync !== 'normal') {
        // 开启覆盖
        count++
        let apipath = '/api/interface/save'
        if (isNode) {
          apipath = 'http://127.0.0.1:' + port + apipath
        }
        data.dataSync = dataSync
        let result = await axios.post(apipath, data)
        if (item.adv_mock_case) {
          //批量导入数据，自动同步高级mock功能 这里的返回值和和后面的不一样
          interfaceId = result.data.data[0]._id
          hasAdvMock = 'mock_adv'
        }
        if (result.data.errcode) {
          successNum--
          callback({ showLoading: false })
          messageError(result.data.errmsg)
        } else {
          existNum = existNum + result.data.data.length
        }

        // 覆盖模式
        // 需要导入的数据不被删除，从 allInfoList 移出
        if (dataSync === 'merge') {
          const idx = allInfoList.findIndex(function(item) {
            return item._id === result.data.data[0]._id
          })
          if (idx > -1) {
            allInfoList.splice(idx, 1)
          }
        }
      } else {
        // 未开启同步功能
        count++
        data.res_import_type = resImportType
        let apipath = '/api/interface/add'
        if (isNode) {
          apipath = 'http://127.0.0.1:' + port + apipath
        }
        let result = await axios.post(apipath, data)
        if (result.data.errcode) {
          successNum--
          if (result.data.errcode === 40022) {
            existNum++
          }
          if (result.data.errcode === 40033) {
            callback({ showLoading: false })
            messageError('没有权限')
            break
          }
        }
        if (result.data.errcode === 0) {
          interfaceId = result.data.data._id
          hasAdvMock = 'res_adv'
          if (resImportType === 'example' && item.adv_mock_case) {
            interfaceId = result.data.data._id
            hasAdvMock = 'mock_adv'
          }
        }
      }
      // has adv mock
      if (hasAdvMock === 'mock_adv') {
        let advMockPath = isNode
          ? `http://127.0.0.1:${port}${advmock_save}`
          : advmock_save
        let advmock_post_data = {
          enable: resImportType === 'example' ? true : false,
          interface_id: interfaceId,
          mock_script: JSON.stringify(item.adv_mock_case || {}),
          project_id: data.project_id,
        }
        await axios.post(advMockPath, advmock_post_data)
      }
      if (hasAdvMock === 'res_adv') {
        let advMockPath = isNode
          ? `http://127.0.0.1:${port}${advmock_save}`
          : advmock_save
        let advmock_post_data = {
          enable: resImportType === 'real' ? true : false,
          interface_id: interfaceId,
          mock_script: data.res_body_text,
          project_id: data.project_id,
        }
        await axios.post(advMockPath, advmock_post_data)
      }
      if (count === len) {
        callback({ showLoading: false })
        messageSuccess(
          `成功导入接口 ${successNum} 个, 已存在的接口 ${existNum} 个`,
        )
      }
    }

    // 覆盖模式
    // 根据 allInfoList 删除多出数据
    if (dataSync === 'merge') {
      if (allInfoList.length > 0) {
        for (let i = 0; i < allInfoList.length; i++) {
          let delResult = await axios.post('/api/interface/del', {
            id: allInfoList[i]._id,
          })
        }
      }
    }
  }

  return await handleAddInterface(res)
}

module.exports = handle
