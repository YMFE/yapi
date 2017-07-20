'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _yapi = require('../yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logModel = function (_baseModel) {
    (0, _inherits3.default)(logModel, _baseModel);

    function logModel() {
        (0, _classCallCheck3.default)(this, logModel);
        return (0, _possibleConstructorReturn3.default)(this, (logModel.__proto__ || (0, _getPrototypeOf2.default)(logModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(logModel, [{
        key: 'getName',
        value: function getName() {
            return 'log';
        }
    }, {
        key: 'getSchema',
        value: function getSchema() {
            return {
                uid: { type: Number, required: true },
                title: { type: String, required: true },
                type: { type: String, enum: ['user', 'group', 'interface', 'project', 'other'], required: true },
                content: { type: String, required: true },
                username: { type: String, required: true },
                add_time: Number
            };
        }
    }, {
        key: 'save',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
                var userInst, username, saveData, log;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                userInst = _yapi2.default.getInst(_user2.default);
                                _context.next = 3;
                                return userInst.findById(data.uid);

                            case 3:
                                username = _context.sent;
                                saveData = {
                                    title: data.title,
                                    content: data.content,
                                    type: data.type,
                                    uid: data.uid,
                                    username: username,
                                    add_time: _yapi2.default.commons.time()
                                };
                                log = new this.model(saveData);
                                return _context.abrupt('return', log.save());

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function save(_x) {
                return _ref.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: 'list',
        value: function list(uid) {
            return this.model.find({
                uid: uid
            }).exec();
        }
    }, {
        key: 'listWithPaging',
        value: function listWithPaging(uid, page, limit) {
            page = parseInt(page);
            limit = parseInt(limit);
            return this.model.find({
                uid: uid
            }).skip((page - 1) * limit).limit(limit).exec();
        }
    }, {
        key: 'listCount',
        value: function listCount(uid) {
            return this.model.count({
                uid: uid
            });
        }
    }]);
    return logModel;
}(_base2.default);

module.exports = logModel;