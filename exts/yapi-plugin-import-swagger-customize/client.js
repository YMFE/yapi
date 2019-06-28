import customizeSwagger from './customizeSwagger/customizeSwagger.js'

function hander(routers) {
  routers.swagger = {
    name: 'swagger接口自定义导入',
    component: customizeSwagger
  };
}

module.exports = function() {
  this.bindHook('sub_setting_nav', hander);
};
