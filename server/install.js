const fs = require('fs-extra');
const yapi = require('./yapi.js');
const commons = require('./utils/commons');
const dbModule = require('./utils/db.js');
const userModel = require('./models/user.js');
const mongoose = require('mongoose');

yapi.commons = commons;
yapi.connect = dbModule.connect();


function install() {
    try {
        let exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));

        if (exist) {
            throw new Error('init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉init.lock文件');
        }
        fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));

        setupSql();
    } catch (err) {
        console.error(err.message);
    }

}

function setupSql() {
    let userInst = yapi.getInst(userModel);
    let passsalt = yapi.commons.randStr();
    let result = userInst.save({
        username: yapi.WEBCONFIG.adminAccount.substr(0, yapi.WEBCONFIG.adminAccount.indexOf('@')),
        email: yapi.WEBCONFIG.adminAccount,
        password: yapi.commons.generatePassword('qunar.com', passsalt),
        passsalt: passsalt,
        role: 'admin',
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time()
    });

    yapi.connect.then(function () {
        let userCol = mongoose.connection.db.collection('user')
        userCol.ensureIndex({
            username: 1
        })
        userCol.ensureIndex({
            email: 1
        }, {
                unique: true
            })

        let projectCol = mongoose.connection.db.collection('project')
        projectCol.ensureIndex({
            uid: 1
        })
        projectCol.ensureIndex({
            name: 1
        })
        projectCol.ensureIndex({
            group_id: 1
        })

        let logCol = mongoose.connection.db.collection('log')
        logCol.ensureIndex({
            uid: 1
        })

        logCol.ensureIndex({
            typeid: 1,
            type: 1
        })

        let interfaceColCol = mongoose.connection.db.collection('interface_col')
        interfaceColCol.ensureIndex({
            uid: 1
        })
        interfaceColCol.ensureIndex({
            project_id: 1
        })

        let interfaceCatCol = mongoose.connection.db.collection('interface_cat')
        interfaceCatCol.ensureIndex({
            uid: 1
        })
        interfaceCatCol.ensureIndex({
            project_id: 1
        })

        let interfaceCaseCol = mongoose.connection.db.collection('interface_case')
        interfaceCaseCol.ensureIndex({
            uid: 1
        })
        interfaceCaseCol.ensureIndex({
            col_id: 1
        })
        interfaceCaseCol.ensureIndex({
            project_id: 1
        })

        let interfaceCol = mongoose.connection.db.collection('interface')
        interfaceCol.ensureIndex({
            uid: 1
        })
        interfaceCol.ensureIndex({
            path: 1,
            method: 1
        })
        interfaceCol.ensureIndex({
            project_id: 1
        })

        let groupCol = mongoose.connection.db.collection('group')
        groupCol.ensureIndex({
            uid: 1
        })
        groupCol.ensureIndex({
            group_name: 1
        })

        let avatarCol = mongoose.connection.db.collection('avatar')
        avatarCol.ensureIndex({
            uid: 1
        })

        let followCol = mongoose.connection.db.collection('follow')
        followCol.ensureIndex({
            uid: 1
        })
        followCol.ensureIndex({
            project_id: 1
        })

        result.then(function () {
            console.log(`初始化管理员账号成功，账号名： "${yapi.WEBCONFIG.adminAccount}",默认密码：qunar.com`); // eslint-disable-line
            process.exit(0);
        }, function (err) {
            throw new Error(`初始化管理员账号 "${yapi.WEBCONFIG.adminAccount}" 失败, ${err.message}`); // eslint-disable-line
        });

    })

}

install();