const yapi = require('yapi.js')
const mongoose = require('mongoose')
const controller = require('./controller')

module.exports = function() {
  yapi.connect.then(function() {
    let Col = mongoose.connection.db.collection('wiki')
    Col.createIndex({
      project_id: 1,
    })
  })

  this.bindHook('add_router', function(addRouter) {
    addRouter({
      // 通过 wiki id 获取 wiki 信息
      controller: controller,
      method: 'get',
      path: 'wiki_action/get_detail',
      action: 'getDetail',
    })

    addRouter({
      // 获取wiki列表
      controller: controller,
      method: 'get',
      path: 'wiki_action/get_page_list',
      action: 'getPageList',
    })

    addRouter({
      // 获取all wiki列表
      controller: controller,
      method: 'get',
      path: 'wiki_action/get_page_all_list',
      action: 'getPageAllList',
    })

    addRouter({
      // 更新wiki信息
      controller: controller,
      method: 'post',
      path: 'wiki_action/update',
      action: 'update',
    })

    addRouter({
      // 新增 wiki 信息
      controller: controller,
      method: 'post',
      path: 'wiki_action/add',
      action: 'add',
    })

    addRouter({
      // 删除wiki页面
      controller: controller,
      method: 'post',
      path: 'wiki_action/remove',
      action: 'remove',
    })

    addRouter({
      // 更新同级 wiki 排序
      controller: controller,
      method: 'post',
      path: 'wiki_action/up_index',
      action: 'updateIndex',
    })

    addRouter({
      // 生成 pdf
      controller: controller,
      method: 'get',
      path: 'doc/export_pdf',
      action: 'convertToPdf',
    })
    addRouter({
      // 导入 gitbook
      controller: controller,
      method: 'post',
      path: 'wiki/import_gitbook',
      action: 'importGitbook',
    })
  })

  this.bindHook('add_ws_router', function(wsRouter) {
    wsRouter({
      controller: controller,
      method: 'get',
      path: 'wiki/solve_conflict',
      action: 'wikiConflict',
    })
  })
}
