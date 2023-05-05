// import {message} from 'antd'

function exportData(exportDataModule, pid) {
  exportDataModule.json = {
    name: 'JSON',
    route: `/api/plugin/export`,
    data: {
      type: 'json',
      pid: pid,
    },
    desc: '导出项目接口文档为 json 文件,可使用该文件导入接口数据',
  }
  exportDataModule.html = {
    name: 'HTML',
    route: `/api/plugin/export`,
    data: {
      type: 'html',
      pid: pid,
    },
    desc: '导出项目接口文档为 html 文件',
  }
  exportDataModule.pdf = {
    name: 'PDF',
    route: `/api/plugin/export`,
    data: {
      type: 'pdf',
      pid: pid,
    },
    desc: '导出项目接口文档为 pdf 文件',
  }
  exportDataModule.markdown = {
    name: 'Markdown',
    route: `/api/plugin/export`,
    data: {
      type: 'markdown',
      pid: pid,
    },
    desc: '导出项目接口文档为 markdown 文件',
  }
}

module.exports = function() {
  this.bindHook('export_data', exportData)
}
