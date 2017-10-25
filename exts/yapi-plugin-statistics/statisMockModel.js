/**
 * Created by gxl.gao on 2017/10/24.
 */
const yapi = require('yapi.js');
const baseModel = require('models/base.js');

class statisMockModel extends baseModel {
    getName() {
        return 'statis_mock';
    }
}

module.exports = statisMockModel;