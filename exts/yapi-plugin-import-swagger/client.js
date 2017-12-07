
import {message} from 'antd'
import _ from 'underscore'
var jsf = require('common/json-schema-mockjs');


function improtData(importDataModule){
  var SwaggerData;
  function handlePath(path){
    if(path.charAt(0) != "/"){
      path = "/" + path;
    }
    if(path.charAt(path.length-1) === "/"){
      path = path.substr(0,path.length-1);
    }
    return path;
  }
  
  function run(res){    
    try{
      let interfaceData = {apis: [], cats: []};
      res = JSON.parse(res);
      SwaggerData = res;
      if(res.tags && Array.isArray(res.tags)){
        res.tags.forEach(tag=>{
          interfaceData.cats.push({
            name: tag.name,
            desc: tag.description
          })
        })
      }

      _.each(res.paths, (apis, path)=>{
        _.each(apis, (api, method)=>{
          api.path = path;
          api.method = method;
          let data = null;
          try{
            data = handleSwagger(api)
          }catch(err){
            data = null;
          }
          if(data){
            interfaceData.apis.push(data);
          }
          
        })
      })
      
      return interfaceData;
      
    }catch(e){
      console.error(e);
      message.error("数据格式有误");
    }
    
  }
  
  function handleSwagger(data){
    let api = {};
    //处理基本信息
    api.method = data.method.toUpperCase();
    api.title = data.summary || data.path;
    api.desc = data.description;
    api.catname = data.tags && Array.isArray(data.tags)? data.tags[0] : null;
    api.path = handlePath(data.path);
    api.req_params = [];
    api.req_body_form = [];
    api.req_headers = [];
    api.req_query = [];
    api.req_body_type = 'raw';
    api.res_body_type = 'raw';

    if(data.produces && data.produces.indexOf('application/json') > -1){
      api.res_body_type = 'json';
    }
    
    if(data.consumes && Array.isArray(data.consumes)){
      if(data.consumes.indexOf('application/x-www-form-urlencoded') > -1 || data.consumes.indexOf('multipart/form-data') > -1 ){
        api.req_body_type = 'form';
      }else if(data.consumes.indexOf('application/json') > -1){
        api.req_body_type = 'json';
      }
    }

    //处理response
    api.res_body = handleResponse(data.responses);
    try{
      JSON.parse(api.res_body);
      api.res_body_type = 'json';
    }catch(e){
      api.res_body_type = 'raw';
    }
    //处理参数

    function simpleJsonPathParse(key, json){
      if(!key || typeof key !== 'string' || key.indexOf('#/') !== 0 || key.length <= 2){
        return null;
      }
      let keys = key.substr(2).split("/");
      keys = keys.filter(item=>{
        return item;
      })
      for(let i=0, l = keys.length; i< l; i++){
        try{
          json = json[keys[i]];
        }catch(e){
          json = '';
          break;
        }
      }
      return json;
    }
    
    if(data.parameters && Array.isArray(data.parameters)){
      data.parameters.forEach(param=>{        
        if(param && typeof param === 'object' && param.$ref){
          param = simpleJsonPathParse(param.$ref, {parameters: SwaggerData.parameters})
        }
        let defaultParam = {
          name: param.name,
          desc: param.description,
          required: param.required? "1" : "0"
        }

        switch(param.in){
          case 'path' : api.req_params.push(defaultParam); break;
          case 'query': api.req_query.push(defaultParam); break;
          case 'body' : handleBodyPamras(param.schema, api); break;
          case 'formData' : defaultParam.type = param.type === 'file'? 'file' : 'text'; api.req_body_form.push(defaultParam); break;
          case 'header' : api.req_headers.push(defaultParam);break;
        }
      })
    }
    

    return api;
  }

  function isJson(json){
    try{
      return JSON.parse(json);
    }catch(e){
      return false;
    }
  }

  function handleBodyPamras(data, api){
    api.req_body_other = handleSchema(data);
    if(isJson(api.req_body_other)){
      api.req_body_type = 'json';
    }
  }

  function handleResponse(api){
    let res_body = '';
    if(!api || typeof api !== 'object'){
      return res_body;
    }
    _.each(api, (res, code)=>{
      if(code == 200){
        if(res && typeof res === 'object'){
          if(res.schema){
            res_body = handleSchema(res.schema);
          }else if(res.description){
            res_body = res.description;
          }          
        }else if(typeof res === 'string'){
          res_body = res;
        }else{
          res_body = '';
        }        
      }
    })
    return res_body;
  }

  function handleSchema(data){
    if(!data) return data;
    if(typeof data !== 'object'){
      return data;
    }
    try{
      data.definitions = SwaggerData.definitions;
      let jsfData = JSON.stringify(jsf(data), null, 2);
      return jsfData;
    }catch(e){
      return '';
    }
  }
  
  if(!importDataModule || typeof importDataModule !== 'object'){
    console.error('importDataModule 参数Must be Object Type');
    return null;
  }

  importDataModule.swagger = {
    name: 'Swagger',
    run: run,
    desc: 'Swagger数据导入（ 支持 v2.0+ ）'
  }
}



module.exports = function(){


  this.bindHook('import_data', improtData)
}