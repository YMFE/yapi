'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _interface = require('./controllers/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();

var interface_PREFIX = {
    interface: '/interface/',
    user: '/user/'
};

router.get(interface_PREFIX.interface + 'add', _interface2.default.add).get(interface_PREFIX.interface + 'list', _interface2.default.list);

module.exports = router;