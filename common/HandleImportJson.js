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
  const handleAddJson = async (data, cat = '', parent = '') => {
    if (!(Array.isArray(data) && data.length)) {
      return
    }
    for (let idx = 0; idx < data.length; idx++) {
      let item = data[idx]
      if (item.list) {
        // 如果当前 item 为目录，先存储目录，再递归存储子集 list
        if (cat) {
          // 当有 cat 参数，则为目录
          let apiData = Object.assign({}, item, {
            project_id: projectId,
            catid: cat,
            parent_id: parent,
          })
          delete apiData.list
          let dirData = await handleAddDir(apiData)
          if (dirData.data && dirData.data._id) {
            await handleAddJson(item.list, cat, dirData.data._id)
          }
        } else {
          // 无 cat 参数，为分类
          let catData = Object.assign({}, item, {
            project_id: projectId,
          })
          let catId = await handleAddCat(catData)
          if (catId) {
            await handleAddJson(item.list, catId, parent)
          }
        }
      }
    }
    for (let idx = 0; idx < data.length; idx++) {
      let item = data[idx]
      if (!item.list && cat) {
        let apiData = Object.assign({}, item, {
          project_id: projectId,
          catid: cat,
          parent_id: parent,
        })
        // 非目录节点，存储为 api
        await handleAddInterface(apiData)
      }
    }
    if (cat === '') {
      callback({ showLoading: false })
      messageSuccess(`导入成功`)
    }
    return
  }

  /**
   * 保存分类
   * @param {分类} cats
   */
  const handleAddCat = async catData => {
    let findCat = _.find(menuList, menu => menu.name === catData.title)
    if (findCat) {
      return findCat._id
    } else {
      let apipath = '/api/interface/add_cat'
      if (isNode) {
        apipath = 'http://127.0.0.1:' + port + apipath
      }
      let data = {
        name: catData.title,
        project_id: projectId,
        desc: catData.desc,
        token,
      }
      let result = await axios.post(apipath, data)
      if (result.data.errcode) {
        messageError(result.data.errmsg)
        return false
      }
      return result.data.data._id
    }
  }

  /**
   * 保存目录
   * @param {目录数据} data
   * 返回目录存储 id
   */
  const handleAddDir = async data => {
    data = Object.assign(data, {
      type: 'static',
      record_type: 2,
    })
    let apipath = '/api/interface/add'
    if (isNode) {
      apipath = 'http://127.0.0.1:' + port + apipath
    }
    let result = await axios.post(apipath, data)
    return result.data
  }

  /**
   * 存储 api 数据
   * @param {api 数据} data
   */
  const handleAddInterface = async data => {
    data = Object.assign(data, {
      interface_type: 'http',
      record_type: 0,
    })
    if (basePath) {
      data.path =
        data.path.indexOf(basePath) === 0
          ? data.path.substr(basePath.length)
          : data.path
    }
    data.token = token
    if (dataSync !== 'normal') {
      // 开启同步功能
      // count++;
      let apipath = '/api/interface/add'
      if (isNode) {
        apipath = 'http://127.0.0.1:' + port + apipath
      }
      data.dataSync = dataSync
      let result = await axios.post(apipath, data)
      if (result.data.errcode) {
        // successNum--;
        callback({ showLoading: false })
        messageError(result.data.errmsg)
      }
    } else {
      // 未开启同步功能
      data.res_import_type = resImportType
      let apipath = '/api/interface/add'
      if (isNode) {
        apipath = 'http://127.0.0.1:' + port + apipath
      }
      let result = await axios.post(apipath, data)
      if (result.data.errcode) {
        if (result.data.errcode == 40033) {
          callback({ showLoading: false })
          messageError('没有权限')
        }
      }
      // if (result.data.errcode == 0) {
      //   //批量导入数据，自动同步高级mock功能
      //   let advmock_save = '/api/plugin/advmock/save';
      //   let advmock_post_data = {
      //     'enable': data.res_import_type === 'real' ? true : false,
      //     'interface_id': result.data.data._id,
      //     // 'mock_script': data.res_import_type === 'real' ? `mockJson=${data.res_body_text}` : `mockJson={}`,
      //     'mock_script': data.res_import_type === 'real' ? data.res_body_text : '{}',
      //     'project_id': result.data.data.project_id
      //   }
      //   // let advmock_result = await axios.post(advmock_save, advmock_post_data);
      //   await axios.post(advmock_save, advmock_post_data);
      // }
    }
  }
  return await handleAddJson(res)
  // return await handleAddInterface(res);
}

module.exports = handle
