import swaggerAutoSync from './swaggerAutoSync/swaggerAutoSync.js'

function hander(routers) {
  routers.test = {
    name: 'Swagger自动同步',
    component: swaggerAutoSync
  };
}

module.exports = function() {
  this.bindHook('sub_setting_nav', hander);
};
