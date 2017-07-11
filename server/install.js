import yapi from './yapi.js';
import commons from './utils/commons';
yapi.commons = commons;
import dbModule from './utils/db.js';

import userModel from './models/user.js'


yapi.connect = dbModule.connect()


function install(){
    let exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'))
    if(exist){
        return yapi.commons.log('runtime/init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉runtime/init.lock文件');
        process.exit(1);
    }
    setupSql();
}

function setupSql(){
    let userInst  = yapi.getInst(userModel);
    let passsalt = yapi.commons.randStr();
    let result = userInst.save({
        email: yapi.WEBCONFIG.adminAccount,
        password: yapi.commons.generatePassword('qunar.com', passsalt),
        passsalt: passsalt,
        role: 'admin',
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time()
    })
    result.then(function(success){
        console.log(`初始化管理员账号 "${yapi.WEBCONFIG.adminAccount}" 成功`);
        yapi.fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));
        process.exit(1)
    }, function(err){
        console.log(`初始化管理员账号 "${yapi.WEBCONFIG.adminAccount}" 失败, ${err.message}`);
        process.exit(1)
    })
}

install();