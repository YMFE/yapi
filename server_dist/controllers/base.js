'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseController = function () {
    function baseController(ctx) {
        (0, _classCallCheck3.default)(this, baseController);

        console.log('baseControler init...');
    }

    (0, _createClass3.default)(baseController, [{
        key: 'getUid',
        value: function getUid() {
            return 0;
        }
    }, {
        key: 'getLoginStatus',
        value: function getLoginStatus() {
            return true;
        }
    }, {
        key: 'getRole',
        value: function getRole() {
            return 'admin';
        }
    }]);
    return baseController;
}();

module.exports = baseController;