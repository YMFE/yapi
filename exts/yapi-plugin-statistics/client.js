/**
 * Created by gxl.gao on 2017/10/24.
 */
import StatisticsPage from './statisticsClientPage/index'

module.exports = function () {
  this.bindHook('header_menu', function (menu) {
    menu.statisticsPage = {
      path: '/statistic',
      name: '系统信息',
      icon: 'bar-chart',
      adminFlag: true
    }
  })
  this.bindHook('app_route', function (app) {
    app.statisticsPage = {
      path: '/statistic',
      component: StatisticsPage
    }
  })


}