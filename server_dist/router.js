'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _interface = require('./controllers/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _group = require('./controllers/group.js');

var _group2 = _interopRequireDefault(_group);

var _user = require('./controllers/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();

var INTERFACE_PREFIX = {
      interface: '/interface/',
      user: '/user/',
      group: '/group/'
};

router.post(INTERFACE_PREFIX.interface + 'add', _interface2.default.add).get(INTERFACE_PREFIX.interface + 'list', _interface2.default.list).get(INTERFACE_PREFIX.group + 'list', _group2.default.list).post(INTERFACE_PREFIX.group + 'add', _group2.default.add).post(INTERFACE_PREFIX.group + 'up', _group2.default.up).post(INTERFACE_PREFIX.group + 'del', _group2.default.del).get(INTERFACE_PREFIX.user + 'list', _user2.default.list).post(INTERFACE_PREFIX.user + 'add', _user2.default.add).post(INTERFACE_PREFIX.user + 'up', _user2.default.up).post(INTERFACE_PREFIX.user + 'del', _user2.default.del);

module.exports = router;