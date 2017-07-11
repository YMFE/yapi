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

var _yapi = require('./yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _project = require('./controllers/project.js');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();

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
    }
};

//group
createAction('group', 'list', 'get', 'list');
createAction('group', 'add', 'post', 'add');
createAction('group', 'up', 'post', 'up');
createAction('group', 'del', 'post', 'del');

//user
createAction('user', 'login', 'post', 'login');
createAction('user', 'reg', 'post', 'reg');
createAction('user', 'list', 'get', 'list');
createAction('user', 'findById', 'post', 'findById');
createAction('user', 'update', 'post', 'update');
createAction('user', 'del', 'post', 'del');
createAction('user', 'status', 'get', 'getLoginStatus');

//project
createAction('project', 'add', 'post', 'add');
createAction('project', 'list', 'get', 'list');
createAction('project', 'get', 'get', 'get');
createAction('project', 'up', 'post', 'up');
createAction('project', 'del', 'post', 'del');
createAction('project', 'add_member', 'post', 'addMember');
createAction('project', 'del_member', 'post', 'delMember');

//interface
createAction('interface', 'add', 'post', 'add');
createAction('interface', 'list', 'get', 'list');
createAction('interface', 'get', 'get', 'get');
createAction('interface', 'up', 'post', 'up');
createAction('interface', 'del', 'post', 'del');

/**
 * 
 * @param {*} controller controller_name
 * @param {*} path  request_path
 * @param {*} method request_method , post get put delete ...
 * @param {*} action controller_action_name
 */
function createAction(controller, path, method, action) {
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
                            console.log(22222);

                            if (!(inst.$auth === true)) {
                                _context.next = 9;
                                break;
                            }

                            _context.next = 7;
                            return inst[action].call(inst, ctx);

                        case 7:
                            _context.next = 10;
                            break;

                        case 9:
                            ctx.body = _yapi2.default.commons.resReturn(null, 400, 'Without Permission.');

                        case 10:
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