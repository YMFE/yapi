
// import {message} from 'antd'


function exportPdf(exportDataModule,...arg){
    let pid = arg[0];
    exportDataModule.pdf = {
        name: 'pdf',
        route: `/api/plugin/export/pdf?pid=${pid}`,
        desc: '导出项目接口文档为 pdf 文件'
    }
}



module.exports = function(){
  this.bindHook('export_data', exportPdf)
}