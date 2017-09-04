const yapi = require('../yapi.js');
const projectModel = require('../models/project.js');
const interfaceModel = require('../models/interface.js');
const mockExtra = require('../../common/mock-extra.js');
const _ = require('underscore');
const Mock = require('mockjs');


function matchApi(apiPath, apiRule) {
    let apiRules = apiRule.split("/");
    if (apiPaths.length !== apiRules.length) {
        return false;
    }
    for (let i = 0; i < apiRules.length; i++) {
        if (apiRules[i] && apiRules[i].indexOf(":") !== 0) {
            if (apiRules[i] !== apiPaths[i]) {
                return false;
            }
        }
    }
    return true;
}

module.exports = async (ctx, next) => {
    let hostname = ctx.hostname;
    let config = yapi.WEBCONFIG;
    let path = ctx.path;


    if (path.indexOf('/mock/') !== 0) {
        if (next) await next();
        return true;
    }

    let paths = path.split("/");
    let projectId = paths[2];
    paths.splice(0, 3);
    path = "/" + paths.join("/");
    if (!projectId) {
        return ctx.body = yapi.commons.resReturn(null, 400, 'projectId不能为空');
    }

    yapi.commons.log('MockServer Running...');
    let projectInst = yapi.getInst(projectModel), project;
    try {
        project = await projectInst.get(projectId);
    } catch (e) {
        return ctx.body = yapi.commons.resReturn(null, 403, e.message);
    }

    if (project === false) {
        return ctx.body = yapi.commons.resReturn(null, 400, '不存在的项目');
    }

    let interfaceData, newData, newpath;
    let interfaceInst = yapi.getInst(interfaceModel);

    try {
        newpath = path.substr(project.basepath.length);
        interfaceData = await interfaceInst.getByPath(project._id, newpath, ctx.method);
        if (!interfaceData || interfaceData.length === 0) {
            //非正常跨域预检请求回应
            if (ctx.method === 'OPTIONS') {
                ctx.set("Access-Control-Allow-Origin", "*")
                ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
                return ctx.body = 'ok'
            }
            let newData = await interfaceInst.getVar(project._id, ctx.method);

            let findInterface = _.find(newData, (item) => {
                return matchApi(newpath, item.path)
            });

            if (!findInterface) {
                return ctx.body = yapi.commons.resReturn(null, 404, '不存在的api');
            }
            interfaceData = [
                await interfaceInst.get(findInterface._id)
            ]

        }

        if (interfaceData.length > 1) {
            return ctx.body = yapi.commons.resReturn(null, 405, '存在多个api，请检查数据库');
        }

        interfaceData = interfaceData[0];
        ctx.set("Access-Control-Allow-Origin", "*")
        if (interfaceData.res_body_type === 'json') {
            try {
                const res = mockExtra(
                    yapi.commons.json_parse(interfaceData.res_body),
                    {
                        query: ctx.request.query,
                        body: ctx.request.body
                    }
                );
                return ctx.body = Mock.mock(res);
            } catch (e) {
                yapi.commons.log(e, 'error')
                return ctx.body = {
                    errcode: 400,
                    errmsg: 'mock json数据格式有误',
                    data: interfaceData.res_body
                }
            }
        }
        return ctx.body = interfaceData.res_body;
    } catch (e) {
        console.error(e)
        return ctx.body = yapi.commons.resReturn(null, 409, e.message);
    }
};
