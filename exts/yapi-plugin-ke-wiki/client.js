import WikiComponent from './view/index';

module.exports = function() {
  this.bindHook('sub_nav', function(app) {
    app.wiki = {
      name: '文档',
      path: '/project/:id/wiki/:action/:wiki_id?',
      component: WikiComponent
    };
  });
};
