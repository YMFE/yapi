import yapi from '../yapi.js';
import projectModel from '../models/project.js';
import interfaceModel from '../models/interface.js';
import Mock from 'mockjs';

module.exports = async (ctx, next) => {
    yapi.commons.log('Server Recevie Request...');

    let hostname = ctx.hostname;
    let config = yapi.WEBCONFIG;

    if (ctx.hostname === config.webhost) {
        if (next) await next();
        return true;
    }

    yapi.commons.log('MockServer Running...');
    let projectInst = yapi.getInst(projectModel), projects;
    try {
        projects = await projectInst.getByDomain(hostname);
    } catch (e) {
        return ctx.body = yapi.commons.resReturn(null, 403, e.message);
    }

    let matchProject = [], maxBasepath = 0;

    for (let i = 0, l = projects.length; i < l; i++) {
        let project = projects[i];
        if(ctx.path && project.basepath == ""){
            matchProject = project;
        }
        else if (ctx.path && ctx.path.indexOf(project.basepath) === 0) {
            if (project.basepath.length > maxBasepath) {
                maxBasepath = project.basepath.length;
                matchProject = project;
            }
        }
    }

    if (matchProject === false) {
        return ctx.body = yapi.commons.resReturn(null, 400, '不存在的domain');
    }

    let project = matchProject, interfaceData;
    let interfaceInst = yapi.getInst(interfaceModel);

    try {

        interfaceData = await interfaceInst.getByPath(project._id, ctx.path.substr(project.basepath.length), ctx.method);
        if (!interfaceData || interfaceData.length === 0) {
            //非正常跨域预检请求回应
            if(ctx.method === 'OPTIONS'){
                ctx.set("Access-Control-Allow-Origin", "*")
                ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
                return ctx.body = 'ok'
            }
            return ctx.body = yapi.commons.resReturn(null, 404, '不存在的api');
        }

        if (interfaceData.length > 1) {
            return ctx.body = yapi.commons.resReturn(null, 405, '存在多个api，请检查数据库');
        }

        interfaceData = interfaceData[0];
        ctx.set("Access-Control-Allow-Origin", "*")
        if (interfaceData.res_body_type === 'json') {
            try{
                const res = Mock.mock(
                    yapi.commons.json_parse(interfaceData.res_body)
                );
                return ctx.body = res;
            }catch(e){
                return ctx.body = {
                    errcode: 400,
                    errmsg: 'mock json数据格式有误',
                    data: interfaceData.res_body
                }
            }
        }
        return ctx.body = interfaceData.res_body;
    } catch (e) {
        return ctx.body = yapi.commons.resReturn(null, 409, e.message);
    }
};
