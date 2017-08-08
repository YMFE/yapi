import koaRouter from 'koa-router';
import interfaceController from './controllers/interface.js';
import groupController from './controllers/group.js';
import userController from './controllers/user.js';

import yapi from './yapi.js';
import projectController from './controllers/project.js';
import logController from './controllers/log.js';

const router = koaRouter();

const authLevel = {
    admin: 0,
    owner: 10,
    dev: 20,
    member:30,
    guest:100
}

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
    },
    log: {
        prefix: '/log/',
        controller: logController
    }
};

const routerConfig = {
	"group": [
		{			
			"action": "list",
			"path": "list",
			"method": "get"
		},
		{			
			"action": "add",
			"path": "add",
			"method": "post"
		},
		{			
			"action": "up",
			"path": "up",
			"method": "post"
		},
		{			
			"action": "del",
			"path": "del",
			"method": "post"
		},
		{			
			"action": "addMember",
			"path": "add_member",
			"method": "post"
		},
		{			
			"action": "delMember",
			"path": "del_member",
			"method": "post"
		},
		{			
			"action": "getMemberList",
			"path": "members",
			"method": "get"
		}
	],
	"user": [
		{			
			"action": "login",
			"path": "login",
			"method": "post"
		},
		{			
			"action": "reg",
			"path": "reg",
			"method": "post"
		},
		{			
			"action": "list",
			"path": "list",
			"method": "get"
		},
		{			
			"action": "findById",
			"path": "find",
			"method": "get"
		},
		{			
			"action": "update",
			"path": "update",
			"method": "post"
		},
		{			
			"action": "del",
			"path": "del",
			"method": "post"
		},
		{			
			"action": "getLoginStatus",
			"path": "status",
			"method": "get"
		},
		{			
			"action": "logout",
			"path": "logout",
			"method": "get"
		},
		{			
			"action": "loginByToken",
			"path": "login_by_token",
			"method": "post"
		},
		{			
			"action": "changePassword",
			"path": "change_password",
			"method": "post"
		},
		{			
			"action": "search",
			"path": "search",
			"method": "get"
		},
		{			
			"action": "nav",
			"path": "nav",
			"method": "get"
		}
	],
	"project": [
		{			
			"action": "add",
			"path": "add",
			"method": "post"
		},
		{			
			"action": "list",
			"path": "list",
			"method": "get"
		},
		{			
			"action": "get",
			"path": "get",
			"method": "get"
		},
		{			
			"action": "up",
			"path": "up",
			"method": "post"
		},
		{			
			"action": "del",
			"path": "del",
			"method": "post"
		},
		{			
			"action": "addMember",
			"path": "add_member",
			"method": "post"
		},
		{			
			"action": "delMember",
			"path": "del_member",
			"method": "post"
		},
		{			
			"action": "getMemberList",
			"path": "get_member_list",
			"method": "get"
		},
		{			
			"action": "search",
			"path": "search",
			"method": "get"
		}
	],
	"interface": [
		{			
			"action": "add",
			"path": "add",
			"method": "post"
		},
		{			
			"action": "list",
			"path": "list",
			"method": "get"
		},
		{			
			"action": "get",
			"path": "get",
			"method": "get"
		},
		{			
			"action": "up",
			"path": "up",
			"method": "post"
		},
		{
			"action": "del",
			"path": "del",
			"method": "post"
		}
	],
	"log": [
		{
			"action": "list",
			"path": "list",
			"method": "get"
		}
	]
}

for(let ctrl in routerConfig){
    let actions = routerConfig[ctrl];
    actions.forEach( (item) => {
        createAction(ctrl, item.action, item.path, item.method);
    } )
}  

/**
 *
 * @param {*} controller controller_name
 * @param {*} path  request_path
 * @param {*} method request_method , post get put delete ...
 * @param {*} action controller_action_name
 */
function createAction(controller, action, path, method) {
    router[method](INTERFACE_CONFIG[controller].prefix + path, async (ctx) => {
        let inst = new INTERFACE_CONFIG[controller].controller(ctx);

        await inst.init(ctx);

        if (inst.$auth === true) {
            await inst[action].call(inst, ctx);
        } else {
            ctx.body = yapi.commons.resReturn(null, 400, 'Without Permission.');
        }
    });
}

module.exports = router;