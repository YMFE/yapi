// import {message} from 'antd'

function exportData(exportDataModule, pid) {
  exportDataModule.html = {
    name: 'html',
    route: `/api/plugin/export?type=html&pid=${pid}`,
    desc: '导出项目接口文档为 html 文件'
  };
  (exportDataModule.markdown = {
    name: 'markdown',
    route: `/api/plugin/export?type=markdown&pid=${pid}`,
    desc: '导出项目接口文档为 markdown 文件'
  }),
    (exportDataModule.json = {
      name: 'json',
      route: `/api/plugin/export?type=json&pid=${pid}`,
      desc: '导出项目接口文档为 json 文件,可使用该文件导入接口数据'
    });
  // exportDataModule.pdf = {
  //     name: 'pdf',
  //     route: `/api/plugin/export?type=pdf&pid=${pid}`,
  //     desc: '导出项目接口文档为 pdf 文件'
  // }
}

module.exports = function() {
  this.bindHook('export_data', exportData);
};
