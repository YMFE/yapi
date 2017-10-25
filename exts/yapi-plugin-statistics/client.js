/**
 * Created by gxl.gao on 2017/10/24.
 */
// import statisticsPage from './statisticsClientPage'

module.exports = function () {
  this.bindHook('header_menu', function (menu) {
    menu.statisticsPage = {
      path: '/statistic',
      name: '数据统计',
      icon: 'bar-chart',
      adminFlag: true
    }
  })
}