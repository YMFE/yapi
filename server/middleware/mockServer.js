import yapi from '../yapi.js';
import projectModel from '../models/project.js';
import interfaceModel from '../models/interface.js';
import Mock from 'mockjs';

module.exports = async (ctx, next) => {
    yapi.commons.log('Server Recevie Request...');

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
    if(!projectId){
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
    
    let interfaceData;
    let interfaceInst = yapi.getInst(interfaceModel);

    try {
        interfaceData = await interfaceInst.getByPath(project._id, path.substr(project.basepath.length), ctx.method);
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
