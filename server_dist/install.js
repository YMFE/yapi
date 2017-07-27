'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _yapi = require('./yapi.js');

var _yapi2 = _interopRequireDefault(_yapi);

var _commons = require('./utils/commons');

var _commons2 = _interopRequireDefault(_commons);

var _db = require('./utils/db.js');

var _db2 = _interopRequireDefault(_db);

var _user = require('./models/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yapi2.default.commons = _commons2.default;
_yapi2.default.connect = _db2.default.connect();

function install() {
    var exist = _yapi2.default.commons.fileExist(_yapi2.default.path.join(_yapi2.default.WEBROOT_RUNTIME, 'init.lock'));

    if (exist) {
        _yapi2.default.commons.log('runtime/init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉runtime/init.lock文件');
        process.exit(0);
    }

    setupSql();
}

function setupSql() {
    var userInst = _yapi2.default.getInst(_user2.default);
    var passsalt = _yapi2.default.commons.randStr();
    var result = userInst.save({
        username: _yapi2.default.WEBCONFIG.adminAccount.substr(0, _yapi2.default.WEBCONFIG.adminAccount.indexOf('@')),
        email: _yapi2.default.WEBCONFIG.adminAccount,
        password: _yapi2.default.commons.generatePassword('qunar.com', passsalt),
        passsalt: passsalt,
        role: 'admin',
        add_time: _yapi2.default.commons.time(),
        up_time: _yapi2.default.commons.time()
    });

    result.then(function () {
        _fsExtra2.default.ensureFileSync(_yapi2.default.path.join(_yapi2.default.WEBROOT_RUNTIME, 'init.lock'));
        console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + _yapi2.default.WEBCONFIG.adminAccount + '" \u6210\u529F'); // eslint-disable-line
        process.exit(0);
    }, function (err) {
        console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + _yapi2.default.WEBCONFIG.adminAccount + '" \u5931\u8D25, ' + err.message); // eslint-disable-line
        process.exit(0);
    });
}

install();