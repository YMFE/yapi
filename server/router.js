import koaRouter from 'koa-router'
import interfaceController from './controllers/interface.js'
import groupController from './controllers/group.js'
import userController from './controllers/user.js'

import yapi from './yapi.js'
import projectController from './controllers/project.js'


const router = koaRouter();

const INTERFACE_CONFIG = {
    interface: {
        prefix: '/interface/',
        controller: interfaceController
    },
    user: {
        prefix: '/user/',
        controller: userController
    },
    group: {
        prefix: '/group/',
        controller: groupController
    },
    project: {
        prefix: '/project/',
        controller: projectController
    }
};

//group
createAction('group', 'list', 'get', 'list')
createAction('group', 'add', 'post', 'add')
createAction('group', 'up', 'post', 'up')
createAction('group', 'del', 'post', 'del')

//user
createAction('user', 'login', 'post', 'login')
createAction('user', 'reg', 'post', 'reg')
createAction('user', 'list', 'get', 'list')
createAction('user', 'find', 'post', 'findById')
createAction('user', 'update', 'post', 'update')
createAction('user', 'del', 'post', 'del')
createAction('user', 'status', 'get', 'getLoginStatus')
createAction('user', 'logout', 'get', 'logout')
createAction('user', 'login_by_token', 'post', 'loginByToken')
createAction('user', 'change_password', 'post', 'changePassword')
createAction('user', 'search', 'get', 'search')


//project
createAction('project', 'add', 'post', 'add')
createAction('project', 'list', 'get', 'list')
createAction('project', 'get', 'get', 'get')
createAction('project', 'up', 'post', 'up')
createAction('project', 'del', 'post', 'del')
createAction('project', 'add_member', 'post', 'addMember')
createAction('project', 'del_member', 'post', 'delMember')
createAction('project', 'get_member_list.json', 'get', 'getMemberList')
createAction('project', 'search', 'get', 'search')

//interface
createAction('interface', 'add', 'post', 'add')
createAction('interface', 'list', 'get', 'list')
createAction('interface', 'get', 'get', 'get')
createAction('interface', 'up', 'post', 'up')
createAction('interface', 'del', 'post', 'del')


/**
 *
 * @param {*} controller controller_name
 * @param {*} path  request_path
 * @param {*} method request_method , post get put delete ...
 * @param {*} action controller_action_name
 */
function createAction(controller, path, method, action){
    router[method](INTERFACE_CONFIG[controller].prefix + path, async (ctx) => {
        let inst = new INTERFACE_CONFIG[controller].controller(ctx);
        await inst.init(ctx);
        if(inst.$auth === true){
            await inst[action].call(inst, ctx);
        }else{
            ctx.body = yapi.commons.resReturn(null, 400, 'Without Permission.');
        }

        
    })
}

module.exports = router
