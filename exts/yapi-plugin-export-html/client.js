
// import {message} from 'antd'


function exportHtml(exportDataModule,...arg){
    let pid = arg[0];
    exportDataModule.html = {
        name: 'html',
        route: `/api/plugin/export/html?pid=${pid}`,
        desc: '导出项目接口文档为 html 文件'
    }
}



module.exports = function(){
  this.bindHook('export_data', exportHtml)
}