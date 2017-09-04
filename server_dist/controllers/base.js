'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = require('../yapi.js');
var projectModel = require('../models/project.js');
var userModel = require('../models/user.js');
var interfaceModel = require('../models/interface.js');
var groupModel = require('../models/group.js');

var _ = require('underscore');
var jwt = require('jsonwebtoken');

var baseController = function () {
  function baseController(ctx) {
    (0, _classCallCheck3.default)(this, baseController);

    this.ctx = ctx;
    //网站上线后，role对象key是不能修改的，value可以修改
    this.roles = {
      admin: 'Admin',
      member: '网站会员'
    };
  }

  (0, _createClass3.default)(baseController, [{
    key: 'init',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
        var ignoreRouter;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.$user = null;
                ignoreRouter = ['/api/user/login_by_token', '/api/user/login', '/api/user/reg', '/api/user/status', '/api/user/logout'];

                if (!(ignoreRouter.indexOf(ctx.path) > -1)) {
                  _context.next = 6;
                  break;
                }

                this.$auth = true;
                _context.next = 8;
                break;

              case 6:
                _context.next = 8;
                return this.checkLogin(ctx);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init(_x) {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'getUid',
    value: function getUid() {
      return parseInt(this.$uid, 10);
    }
  }, {
    key: 'checkLogin',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
        var token, uid, userInst, result, decoded;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                token = ctx.cookies.get('_yapi_token');
                uid = ctx.cookies.get('_yapi_uid');
                _context2.prev = 2;

                if (!(!token || !uid)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', false);

              case 5:
                userInst = yapi.getInst(userModel); //创建user实体

                _context2.next = 8;
                return userInst.findById(uid);

              case 8:
                result = _context2.sent;
                decoded = jwt.verify(token, result.passsalt);

                if (!(decoded.uid == uid)) {
                  _context2.next = 15;
                  break;
                }

                this.$uid = uid;
                this.$auth = true;
                this.$user = result;
                return _context2.abrupt('return', true);

              case 15:
                return _context2.abrupt('return', false);

              case 18:
                _context2.prev = 18;
                _context2.t0 = _context2['catch'](2);
                return _context2.abrupt('return', false);

              case 21:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 18]]);
      }));

      function checkLogin(_x2) {
        return _ref2.apply(this, arguments);
      }

      return checkLogin;
    }()
    /**
     * 
     * @param {*} ctx 
     */

  }, {
    key: 'getLoginStatus',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
        var result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.checkLogin(ctx);

              case 2:
                _context3.t0 = _context3.sent;

                if (!(_context3.t0 === true)) {
                  _context3.next = 7;
                  break;
                }

                result = yapi.commons.fieldSelect(this.$user, ['_id', 'username', 'email', 'up_time', 'add_time', 'role', 'type']);

                result.server_ip = yapi.WEBCONFIG.server_ip;
                return _context3.abrupt('return', ctx.body = yapi.commons.resReturn(result));

              case 7:
                return _context3.abrupt('return', ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getLoginStatus(_x3) {
        return _ref3.apply(this, arguments);
      }

      return getLoginStatus;
    }()
  }, {
    key: 'getRole',
    value: function getRole() {
      return this.$user.role;
    }
  }, {
    key: 'getUsername',
    value: function getUsername() {
      return this.$user.username;
    }
  }, {
    key: 'getProjectRole',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(id, type) {
        var _this = this;

        var result, interfaceInst, interfaceData, projectInst, projectData, memberData, groupInst, groupData, groupMemberData;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                result = {};
                _context4.prev = 1;

                if (!(this.getRole() === 'admin')) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt('return', 'admin');

              case 4:
                if (!(type === 'interface')) {
                  _context4.next = 14;
                  break;
                }

                interfaceInst = yapi.getInst(interfaceModel);
                _context4.next = 8;
                return interfaceInst.get(id);

              case 8:
                interfaceData = _context4.sent;

                result.interfaceData = interfaceData;

                if (!(interfaceData.uid === this.getUid())) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', 'owner');

              case 12:
                type = 'project';
                id = interfaceData.project_id;

              case 14:
                if (!(type === 'project')) {
                  _context4.next = 30;
                  break;
                }

                projectInst = yapi.getInst(projectModel);
                _context4.next = 18;
                return projectInst.get(id);

              case 18:
                projectData = _context4.sent;

                if (!(projectData.uid === this.getUid())) {
                  _context4.next = 21;
                  break;
                }

                return _context4.abrupt('return', 'owner');

              case 21:
                memberData = _.find(projectData.members, function (m) {
                  if (m.uid === _this.getUid()) {
                    return true;
                  }
                });

                if (!(memberData && memberData.role)) {
                  _context4.next = 28;
                  break;
                }

                if (!(memberData.role === 'owner')) {
                  _context4.next = 27;
                  break;
                }

                return _context4.abrupt('return', 'owner');

              case 27:
                return _context4.abrupt('return', 'dev');

              case 28:
                type = 'group';
                id = projectData.group_id;

              case 30:
                if (!(type === 'group')) {
                  _context4.next = 42;
                  break;
                }

                groupInst = yapi.getInst(groupModel);
                _context4.next = 34;
                return groupInst.get(id);

              case 34:
                groupData = _context4.sent;
                groupMemberData = _.find(groupData.members, function (m) {
                  if (m.uid === _this.getUid()) {
                    return true;
                  }
                });

                if (!(groupMemberData && groupMemberData.role)) {
                  _context4.next = 42;
                  break;
                }

                if (!(groupMemberData.role === 'owner')) {
                  _context4.next = 41;
                  break;
                }

                return _context4.abrupt('return', 'owner');

              case 41:
                return _context4.abrupt('return', 'dev');

              case 42:
                return _context4.abrupt('return', 'member');

              case 45:
                _context4.prev = 45;
                _context4.t0 = _context4['catch'](1);

                yapi.commons.log(_context4.t0.message, 'error');
                return _context4.abrupt('return', false);

              case 49:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 45]]);
      }));

      function getProjectRole(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return getProjectRole;
    }()
    /**
     * 
     * @param {*} id type对应的id
     * @param {*} type enum[interface, project, group] 
     * @param {*} action enum[ danger , edit ] danger只有owner或管理员才能操作,edit只要是dev或以上就能执行
     */

  }, {
    key: 'checkAuth',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(id, type, action) {
        var role;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getProjectRole(id, type);

              case 2:
                role = _context5.sent;

                if (!(action === 'danger')) {
                  _context5.next = 8;
                  break;
                }

                if (!(role === 'admin' || role === 'owner')) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt('return', true);

              case 6:
                _context5.next = 11;
                break;

              case 8:
                if (!(action === 'edit')) {
                  _context5.next = 11;
                  break;
                }

                if (!(role === 'admin' || role === 'owner' || role === 'dev')) {
                  _context5.next = 11;
                  break;
                }

                return _context5.abrupt('return', true);

              case 11:
                return _context5.abrupt('return', false);

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function checkAuth(_x6, _x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return checkAuth;
    }()
  }]);
  return baseController;
}();

module.exports = baseController;