'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _interface = require('./controllers/interface.js');

var _interface2 = _interopRequireDefault(_interface);

var _group = require('./controllers/group.js');

var _group2 = _interopRequireDefault(_group);

var _user = require('./controllers/user.js');

var _user2 = _interopRequireDefault(_user);

var _interfaceCol = require('./controllers/interfaceCol.js');

var _interfaceCol2 = _interopRequireDefault(_interfaceCol);

var _yapi = require('./yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _project = require('./controllers/project.js');

var _project2 = _interopRequireDefault(_project);

var _log = require('./controllers/log.js');

var _log2 = _interopRequireDefault(_log);

var _follow = require('./controllers/follow.js');

var _follow2 = _interopRequireDefault(_follow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();

var authLevel = {
	admin: 0,
	owner: 10,
	dev: 20,
	member: 30,
	guest: 100
};

var INTERFACE_CONFIG = {
	interface: {
		prefix: '/interface/',
		controller: _interface2.default
	},
	user: {
		prefix: '/user/',
		controller: _user2.default
	},
	group: {
		prefix: '/group/',
		controller: _group2.default
	},
	project: {
		prefix: '/project/',
		controller: _project2.default
	},
	log: {
		prefix: '/log/',
		controller: _log2.default
	},
	follow: {
		prefix: '/follow/',
		controller: _follow2.default
	},
	col: {
		prefix: '/col/',
		controller: _interfaceCol2.default
	}
};

var routerConfig = {
	"group": [{
		"action": "list",
		"path": "list",
		"method": "get"
	}, {
		"action": "add",
		"path": "add",
		"method": "post"
	}, {
		"action": "up",
		"path": "up",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}, {
		"action": "addMember",
		"path": "add_member",
		"method": "post"
	}, {
		"action": "delMember",
		"path": "del_member",
		"method": "post"
	}, {
		"action": "getMemberList",
		"path": "members",
		"method": "get"
	}],
	"user": [{
		"action": "login",
		"path": "login",
		"method": "post"
	}, {
		"action": "reg",
		"path": "reg",
		"method": "post"
	}, {
		"action": "list",
		"path": "list",
		"method": "get"
	}, {
		"action": "findById",
		"path": "find",
		"method": "get"
	}, {
		"action": "update",
		"path": "update",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}, {
		"action": "getLoginStatus",
		"path": "status",
		"method": "get"
	}, {
		"action": "logout",
		"path": "logout",
		"method": "get"
	}, {
		"action": "loginByToken",
		"path": "login_by_token",
		"method": "post"
	}, {
		"action": "changePassword",
		"path": "change_password",
		"method": "post"
	}, {
		"action": "search",
		"path": "search",
		"method": "get"
	}, {
		"action": "nav",
		"path": "nav",
		"method": "get"
	}],
	"project": [{
		"action": "add",
		"path": "add",
		"method": "post"
	}, {
		"action": "list",
		"path": "list",
		"method": "get"
	}, {
		"action": "get",
		"path": "get",
		"method": "get"
	}, {
		"action": "up",
		"path": "up",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}, {
		"action": "addMember",
		"path": "add_member",
		"method": "post"
	}, {
		"action": "delMember",
		"path": "del_member",
		"method": "post"
	}, {
		"action": "getMemberList",
		"path": "get_member_list",
		"method": "get"
	}, {
		"action": "search",
		"path": "search",
		"method": "get"
	}, {
		"action": "download",
		"path": "download",
		"method": "get"
	}],
	"interface": [{
		"action": "add",
		"path": "add",
		"method": "post"
	}, {
		"action": "list",
		"path": "list",
		"method": "get"
	}, {
		"action": "get",
		"path": "get",
		"method": "get"
	}, {
		"action": "up",
		"path": "up",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}],
	"log": [{
		"action": "list",
		"path": "list",
		"method": "get"
	}],
	"follow": [{
		"action": "list",
		"path": "list",
		"method": "get"
	}, {
		"action": "add",
		"path": "add",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}],
	"col": [{
		action: "addCol",
		path: "add_col",
		method: "post"
	}, {
		action: "list",
		path: "list",
		method: "get"
	}, {
		action: "getCaseList",
		path: "case_list",
		method: "get"
	}, {
		action: "addCase",
		path: "add_case",
		method: "post"
	}, {
		action: "getCase",
		path: "case",
		method: "get"
	}, {
		action: "upCol",
		path: "up_col",
		method: "post"
	}, {
		action: "upCaseIndex",
		path: "up_col_index",
		method: "post"
	}, {
		action: "delCol",
		path: "del_col",
		method: "post"
	}, {
		action: "delCase",
		path: "del_case",
		method: "post"
	}]
};

var _loop = function _loop(ctrl) {
	var actions = routerConfig[ctrl];
	actions.forEach(function (item) {
		createAction(ctrl, item.action, item.path, item.method);
	});
};

for (var ctrl in routerConfig) {
	_loop(ctrl);
}

/**
 *
 * @param {*} controller controller_name
 * @param {*} path  request_path
 * @param {*} method request_method , post get put delete ...
 * @param {*} action controller_action_name
 */
function createAction(controller, action, path, method) {
	var _this = this;

	router[method](INTERFACE_CONFIG[controller].prefix + path, function () {
		var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
			var inst;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							inst = new INTERFACE_CONFIG[controller].controller(ctx);
							_context.next = 3;
							return inst.init(ctx);

						case 3:
							if (!(inst.$auth === true)) {
								_context.next = 8;
								break;
							}

							_context.next = 6;
							return inst[action].call(inst, ctx);

						case 6:
							_context.next = 9;
							break;

						case 8:
							ctx.body = _yapi2.default.commons.resReturn(null, 40011, '请登录.');

						case 9:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}));

		return function (_x) {
			return _ref.apply(this, arguments);
		};
	}());
}

module.exports = router;