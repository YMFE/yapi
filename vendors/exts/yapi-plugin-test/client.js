function hander(routers) {
  routers.test = {
    name: 'test',
    component: ()=> 'hello world.'
  };
}

module.exports = function() {
  this.bindHook('sub_setting_nav', hander);
};
