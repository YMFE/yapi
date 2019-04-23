import Services from './Services/Services.js';

function genServices(routers) {
  routers['services'] = {
    name: '生成 ts services',
    component: Services
  }
}

module.exports = function() {
  this.bindHook('sub_setting_nav', genServices);
};
