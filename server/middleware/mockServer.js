import yapi from '../yapi.js';
import projectModel from '../models/project.js'
import interfaceModel from '../models/interface.js'
import Mock from 'mockjs'

module.exports = async (ctx, next) => {
    yapi.commons.log('mock Server running...')
    let hostname = ctx.hostname;
    let config = yapi.WEBCONFIG;
    if(ctx.hostname === config.webhost){
        if(next) await next();
        return true;
    }
    let projectInst = yapi.getInst(projectModel), projects;
    try{
        projects = await projectInst.getByDomain(hostname);
    }catch(e){
        return ctx.body = yapi.commons.resReturn(null, 403, e.message);
    }
    
    let matchProject = false, maxBasepath = 0;
    for(let i=0, l = projects.length; i< l; i++){
        let project = projects[i];
        if(ctx.path && ctx.path.indexOf(project.basepath) === 0 && project.basepath[project.basepath.length -1] === '/'){
            matchProject.push(project);
            if(project.basepath.length > maxBasepath){
                maxBasepath = project.basepath.length;
                matchProject = project;
            }
        }
    }

    if(matchProject === false){
        return ctx.body = yapi.commons.resReturn(null, 400, '不存在的domain');
    }

    let project = matchProject, interfaceData;
    let interfaceInst = yapi.getInst(interfaceModel);
    try{
        interfaceData = await  interfaceInst.getByPath(project._id, ctx.path.substr(project.basepath.length));

        if(!interfaceData || interfaceData.length === 0){            
            return ctx.body = yapi.commons.resReturn(null, 404, '不存在的api');
        }

        if(interfaceData.length > 1){
            return ctx.body = yapi.commons.resReturn(null, 405, '存在多个api，请检查数据库');
        }

        interfaceData = interfaceData[0];
        
        if(interfaceData.res_body_type === 'json'){
            return ctx.body = Mock.mock(
                yapi.commons.json_parse(interfaceData.res_body)
            );
        }
        return ctx.body = interfaceData.res_body;
    }catch(e){
        return ctx.body = yapi.commons.resReturn(null, 409, e.message);
    }
    

}