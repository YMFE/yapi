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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

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

    _yapi2.default.connect.then(function () {
        var userCol = _mongoose2.default.connection.db.collection('user');
        userCol.ensureIndex({
            username: 1
        });
        userCol.ensureIndex({
            email: 1
        }, {
            unique: true
        });

        var projectCol = _mongoose2.default.connection.db.collection('project');
        projectCol.ensureIndex({
            uid: 1
        });
        projectCol.ensureIndex({
            name: 1
        });
        projectCol.ensureIndex({
            group_id: 1
        });

        var logCol = _mongoose2.default.connection.db.collection('log');
        logCol.ensureIndex({
            uid: 1
        });

        logCol.ensureIndex({
            typeid: 1,
            type: 1
        });

        var interfaceColCol = _mongoose2.default.connection.db.collection('interface_col');
        interfaceColCol.ensureIndex({
            uid: 1
        });
        interfaceColCol.ensureIndex({
            project_id: 1
        });

        var interfaceCatCol = _mongoose2.default.connection.db.collection('interface_cat');
        interfaceCatCol.ensureIndex({
            uid: 1
        });
        interfaceCatCol.ensureIndex({
            project_id: 1
        });

        var interfaceCaseCol = _mongoose2.default.connection.db.collection('interface_case');
        interfaceCaseCol.ensureIndex({
            uid: 1
        });
        interfaceCaseCol.ensureIndex({
            col_id: 1
        });
        interfaceCaseCol.ensureIndex({
            project_id: 1
        });

        var interfaceCol = _mongoose2.default.connection.db.collection('interface');
        interfaceCol.ensureIndex({
            uid: 1
        });
        interfaceCol.ensureIndex({
            path: 1,
            method: 1
        });
        interfaceCol.ensureIndex({
            project_id: 1
        });

        var groupCol = _mongoose2.default.connection.db.collection('group');
        groupCol.ensureIndex({
            uid: 1
        });
        groupCol.ensureIndex({
            group_name: 1
        });

        var avatarCol = _mongoose2.default.connection.db.collection('avatar');
        avatarCol.ensureIndex({
            uid: 1
        });

        var followCol = _mongoose2.default.connection.db.collection('follow');
        followCol.ensureIndex({
            uid: 1
        });
        followCol.ensureIndex({
            project_id: 1
        });

        result.then(function () {
            _fsExtra2.default.ensureFileSync(_yapi2.default.path.join(_yapi2.default.WEBROOT_RUNTIME, 'init.lock'));
            console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + _yapi2.default.WEBCONFIG.adminAccount + '" \u6210\u529F'); // eslint-disable-line
            process.exit(0);
        }, function (err) {
            console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + _yapi2.default.WEBCONFIG.adminAccount + '" \u5931\u8D25, ' + err.message); // eslint-disable-line
            process.exit(0);
        });
    });
}

install();