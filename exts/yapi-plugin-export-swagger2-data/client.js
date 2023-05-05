function exportData(exportDataModule, pid) {
  exportDataModule.swaggerjson = {
    name: 'Swagger-Json',
    route: `/api/plugin/exportSwagger`,
    data: {
      type: 'OpenAPIV2',
      pid: pid,
    },
    desc: '导出项目接口文档为(Swagger 2.0)Json文件',
  }
}

module.exports = function() {
  this.bindHook('export_data', exportData)
}
