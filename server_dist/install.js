'use strict';

var fs = require('fs-extra');
var yapi = require('./yapi.js');
var commons = require('./utils/commons');
var dbModule = require('./utils/db.js');
var userModel = require('./models/user.js');
var mongoose = require('mongoose');

yapi.commons = commons;
yapi.connect = dbModule.connect();

function install() {
    var exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));

    if (exist) {
        yapi.commons.log('runtime/init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉runtime/init.lock文件');
        process.exit(0);
    }

    setupSql();
}

function setupSql() {
    var userInst = yapi.getInst(userModel);
    var passsalt = yapi.commons.randStr();
    var result = userInst.save({
        username: yapi.WEBCONFIG.adminAccount.substr(0, yapi.WEBCONFIG.adminAccount.indexOf('@')),
        email: yapi.WEBCONFIG.adminAccount,
        password: yapi.commons.generatePassword('qunar.com', passsalt),
        passsalt: passsalt,
        role: 'admin',
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time()
    });

    yapi.connect.then(function () {
        var userCol = mongoose.connection.db.collection('user');
        userCol.ensureIndex({
            username: 1
        });
        userCol.ensureIndex({
            email: 1
        }, {
            unique: true
        });

        var projectCol = mongoose.connection.db.collection('project');
        projectCol.ensureIndex({
            uid: 1
        });
        projectCol.ensureIndex({
            name: 1
        });
        projectCol.ensureIndex({
            group_id: 1
        });

        var logCol = mongoose.connection.db.collection('log');
        logCol.ensureIndex({
            uid: 1
        });

        logCol.ensureIndex({
            typeid: 1,
            type: 1
        });

        var interfaceColCol = mongoose.connection.db.collection('interface_col');
        interfaceColCol.ensureIndex({
            uid: 1
        });
        interfaceColCol.ensureIndex({
            project_id: 1
        });

        var interfaceCatCol = mongoose.connection.db.collection('interface_cat');
        interfaceCatCol.ensureIndex({
            uid: 1
        });
        interfaceCatCol.ensureIndex({
            project_id: 1
        });

        var interfaceCaseCol = mongoose.connection.db.collection('interface_case');
        interfaceCaseCol.ensureIndex({
            uid: 1
        });
        interfaceCaseCol.ensureIndex({
            col_id: 1
        });
        interfaceCaseCol.ensureIndex({
            project_id: 1
        });

        var interfaceCol = mongoose.connection.db.collection('interface');
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

        var groupCol = mongoose.connection.db.collection('group');
        groupCol.ensureIndex({
            uid: 1
        });
        groupCol.ensureIndex({
            group_name: 1
        });

        var avatarCol = mongoose.connection.db.collection('avatar');
        avatarCol.ensureIndex({
            uid: 1
        });

        var followCol = mongoose.connection.db.collection('follow');
        followCol.ensureIndex({
            uid: 1
        });
        followCol.ensureIndex({
            project_id: 1
        });

        result.then(function () {
            fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));
            console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + yapi.WEBCONFIG.adminAccount + '" \u6210\u529F'); // eslint-disable-line
            process.exit(0);
        }, function (err) {
            console.log('\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7 "' + yapi.WEBCONFIG.adminAccount + '" \u5931\u8D25, ' + err.message); // eslint-disable-line
            process.exit(0);
        });
    });
}

install();