import koaRouter from 'koa-router';
import interfaceController from './controllers/interface.js';
import groupController from './controllers/group.js';
import userController from './controllers/user.js';
import interfaceColController from './controllers/interfaceCol.js'

import yapi from './yapi.js';
import projectController from './controllers/project.js';
import logController from './controllers/log.js';
import followController from './controllers/follow.js';

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
	},
	follow: {
        prefix: '/follow/',
        controller: followController
	},
	col: {
		prefix: '/col/',
		controller: interfaceColController
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
			"action": "changeMemberRole",
			"path": "change_member_role",
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
		},{
			action: 'get',
			path: 'get',
			method: 'get'
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
			"action": "project",
			"path": "project",
			"method": "get"
		},{
			"action": "avatar",
			"path": "avatar",
			"method": "get"
		},{
			action: "uploadAvatar",
			path: "upload_avatar",
			method: "post"
		}
	],
	"project": [
		{
			"action": "upSet",
			"path": "upset",
			"method": "post"
		},{
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
			"action": "changeMemberRole",
			"path": "change_member_role",
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
		},
		{
			"action": "download",
			"path": "download",
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
		},
		{
			action: 'listByCat',
			path: 'list_cat',
			method: 'get'
		},{
			action: 'listByMenu',
			path: 'list_menu',
			method: 'get'
		},{
			action: 'addCat',
			path: 'add_cat',
			method: 'post'
		},{
			action: 'upCat',
			path: 'up_cat',
			method: 'post'
		},{
			action: 'delCat',
			path: 'del_cat',
			method: 'post'
		}
	],
	"log": [
		{
			"action": "list",
			"path": "list",
			"method": "get"
		}
	],
	"follow": [{
		"action": "list",
		"path": "list",
		"method": "get"
	},{
		"action": "add",
		"path": "add",
		"method": "post"
	},{
		"action": "del",
		"path": "del",
		"method": "post"
	}],
	"col": [{
		action: "addCol",
		path: "add_col",
		method: "post"
	}, {
		action: "list",
		path: "list",
		method: "get"
	},{
		action: "getCaseList",
		path: "case_list",
		method: "get"
	},{
		action: "addCase",
		path: "add_case",
		method: "post"
	},{
		action: "getCase",
		path: "case",
		method: "get"
	},{
		action: "upCol",
		path: "up_col",
		method: "post"
	},{
		action: "upCaseIndex",
		path: "up_col_index",
		method: "post"
	},{
		action: "delCol",
		path: "del_col",
		method: "get"
	},{
		action: "delCase",
		path: "del_case",
		method: "get"
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
    router[method]("/api" +  INTERFACE_CONFIG[controller].prefix + path, async (ctx) => {
        let inst = new INTERFACE_CONFIG[controller].controller(ctx);

        await inst.init(ctx);

        if (inst.$auth === true) {
            await inst[action].call(inst, ctx);
        } else {
            ctx.body = yapi.commons.resReturn(null, 40011, '请登录...');
        }
    });
}


module.exports = router;
