const koaRouter = require('koa-router');
const interfaceController = require('./controllers/interface.js');
const groupController = require('./controllers/group.js');
const userController = require('./controllers/user.js');
const interfaceColController = require('./controllers/interfaceCol.js');
const testController = require('./controllers/test.js');

const yapi = require('./yapi.js');
const projectController = require('./controllers/project.js');
const logController = require('./controllers/log.js');
const followController = require('./controllers/follow.js');
const { createAction } = require("./utils/commons.js")

const router = koaRouter();

let INTERFACE_CONFIG = {
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
	},
	test: {
		prefix: '/test/',
		controller: testController
	}
};

let routerConfig = {
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
		}, {
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
			"method": "all"
		},
		{
			action: 'upStudy',
			path: 'up_study',
			method: 'get'
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
		}, {
			"action": "avatar",
			"path": "avatar",
			"method": "get"
		}, {
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
		}, {
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
			"action": "upEnv",
			"path": "up_env",
			"method": "post"
		}
	],
	"interface": [
		{
			"action": "add",
			"path": "add",
			"method": "post"
		},
		{
			"action": "downloadCrx",
			"path": "download_crx",
			"method": "get"
		},
		{
			"action": "getCatMenu",
			"path": "getCatMenu",
			"method": "get"
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
			"action": "interUpload",
			"path": "interUpload",
			"method": "post"
		},
		{
			action: 'listByCat',
			path: 'list_cat',
			method: 'get'
		}, {
			action: 'listByMenu',
			path: 'list_menu',
			method: 'get'
		}, {
			action: 'addCat',
			path: 'add_cat',
			method: 'post'
		}, {
			action: 'upCat',
			path: 'up_cat',
			method: 'post'
		}, {
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
	}, {
		"action": "add",
		"path": "add",
		"method": "post"
	}, {
		"action": "del",
		"path": "del",
		"method": "post"
	}],
	"col": [{
		action: "addCol",
		path: "add_col",
		method: "post"
	}, {
		action: 'addCaseList',
		path: 'add_case_list',
		method: 'post'

	}, {
		action: 'cloneCaseList',
		path: 'clone_case_list',
		method: 'post'

	}, {
		action: "list",
		path: "list",
		method: "get"
	}, {
		action: "getCaseList",
		path: "case_list",
		method: "get"
	}, {
		action: "getCaseListByVariableParams",
		path: "case_list_by_var_params",
		method: "get"
	}, {
		action: "addCase",
		path: "add_case",
		method: "post"
	}, {
		action: "upCase",
		path: "up_case",
		method: "post"
	}, {
		action: "getCase",
		path: "case",
		method: "get"
	}, {
		action: "upCol",
		path: "up_col",
		method: "post"
	}, {
		action: "upCaseIndex",
		path: "up_col_index",
		method: "post"
	}, {
		action: "delCol",
		path: "del_col",
		method: "get"
	}, {
		action: "delCase",
		path: "del_case",
		method: "get"
	}, {
		action: "runCaseScript",
		path: "run_script",
		method: "post"
	}
	],
	"test": [{
		action: "testPost",
		path: "post",
		method: "post"
	}, {
		action: "testGet",
		path: "get",
		method: "get"
	}, {
		action: "testPut",
		path: "put",
		method: "put"
	}, {
		action: "testDelete",
		path: "delete",
		method: "del"
	}, {
		action: "testHead",
		path: "head",
		method: "head"
	}, {
		action: "testOptions",
		path: "options",
		method: "options"
	}, {
		action: "testPatch",
		path: "patch",
		method: "patch"
	}, {
		action: "testFilesUpload",
		path: "files/upload",
		method: "post"
	}, {
		action: "testSingleUpload",
		path: "single/upload",
		method: "post"
	}, {
		action: "testHttpCode",
		path: "http/code",
		method: "post"
	}
	]
}

let pluginsRouterPath = [];

function addPluginRouter(config) {
	if (!config.path || !config.controller || !config.action) {
		throw new Error('Plugin Route config Error');
	}
	let method = config.method || 'GET';
	let routerPath = '/plugin/' + config.path;
	if (pluginsRouterPath.indexOf(routerPath) > -1) {
		throw new Error('Plugin Route path conflict, please try rename the path')
	}
	pluginsRouterPath.push(routerPath);
	createAction(router, "/api", config.controller, config.action, routerPath, method, false);
}

yapi.emitHookSync('add_router', addPluginRouter);

for (let ctrl in routerConfig) {
	let actions = routerConfig[ctrl];
	actions.forEach((item) => {
		let routerController = INTERFACE_CONFIG[ctrl].controller;
		let routerPath = INTERFACE_CONFIG[ctrl].prefix + item.path;
		createAction(router, "/api", routerController, item.action, routerPath, item.method);
	})
}



module.exports = router;
