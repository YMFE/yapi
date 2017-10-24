import AdvMock from './AdvMock'

module.exports = function(){
  this.bindHook('interface_tab', function(tabs){
    tabs.advMock = {
      name: '高级Mock',
      component: AdvMock
    }
  })
}