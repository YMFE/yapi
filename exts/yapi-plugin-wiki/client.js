import WikiPage from './WikiPage/index'

module.exports = function(){
  this.bindHook('sub_nav', function(app){
    app.wiki = {
      name: 'wiki',
      path: '/project/:id/wiki',
      component: WikiPage
    }
  })
}