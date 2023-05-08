import AddUser from './pages'

module.exports = function() {
  this.bindHook('header_menu', function(menu) {
    menu.fineAddUser = {
      path: '/fine/user/add',
      name: '添加用户',
      icon: 'user-add',
      adminFlag: true,
    }
  })

  this.bindHook('app_route', function(app) {
    app.fineAddUser = {
      path: '/fine/user/add',
      component: AddUser,
    }
  })
}
