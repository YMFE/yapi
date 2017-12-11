import InterfaceHistory from './client/InterfaceHistory.js';

module.exports = function(){
  this.bindHook('interface_tab', function(tabs){
    tabs.advMock = {
      name: '历史',
      component: InterfaceHistory
    }
  })
}