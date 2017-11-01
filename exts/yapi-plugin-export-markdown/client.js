
// import {message} from 'antd'


function exportMarkdown(exportDataModule,...arg){
    let pid = arg[0];
    exportDataModule.markdown = {
        name: 'markdown',
        route: `/api/plugin/export/markdown?pid=${pid}`,
        desc: '导出项目接口文档为 markdown 文件'
    }
}



module.exports = function(){
  this.bindHook('export_data', exportMarkdown)
}