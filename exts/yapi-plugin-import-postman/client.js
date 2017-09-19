
import {message} from 'antd'

function postman(importDataModule){

  function parseUrl(url){
    let parser = document.createElement('a');
    parser.href = url;
    return {
      protocol: parser.protocol,
      hostname: parser.hostname,
      port: parser.port,  
      pathname: parser.pathname,
      search: parser.search,
      host: parser.host
    }
  }
  
  function checkInterRepeat(interData){
    let obj = {};
    let arr = [];
    for(let item in interData){
      // console.log(interData[item].url + "-" + interData[item].method);
      if(!obj[interData[item].url + "-" + interData[item].method+ "-"+interData[item].method]){
        arr.push(interData[item]);
        obj[interData[item].url + "-" + interData[item].method+ "-"+interData[item].method] = true;
      }
    }
    return arr;
  }
  
  function handleReq_query(query){
    let res = [];
    if(query&&query.length){
      for(let item in query){
        res.push({
          name: query[item].key,
          desc: query[item].description,
          required: query[item].enable
        });
      }
    }
    return res;
  }
  function handleReq_headers(headers){
    let res = [];
    if(headers&&headers.length){
      for(let item in headers){
        res.push({
          name: headers[item].key,
          desc: headers[item].description,
          value: headers[item].value,
          required: headers[item].enable
        });
      }
    }
    return res;
  }
  
  function handleReq_body_form(body_form){
    let res = [];
    if(body_form&&body_form.length){
      for(let item in body_form){
        res.push({
          name: body_form[item].key,
          value: body_form[item].value,
          type: body_form[item].type
        });
      }
    }
    return res;
  }
  
  function handlePath(path){
    path = path.replace(/{{(\w*)}}/,"");
    path = parseUrl(path).pathname;
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
      res = JSON.parse(res);
      let interData = res.requests;
      let interfaceData = {apis: []};
      interData = checkInterRepeat.bind(this)(interData);  
      if(interData && interData.length){        
        for(let item in interData){
          let data = importPostman.bind(this)(interData[item]);
          interfaceData.apis.push(data);
        }
      }
      return interfaceData;
      
    }catch(e){
      message.error("文件格式必须为JSON");
    }
    
  }
  
  function importPostman(data,key){
    let reflect = {//数据字段映射关系
      title: "name",
      path: "url",
      method: "method",
      desc: "description",
      req_query: "queryParams",
      req_headers: "headerData",
      req_params: "",
      req_body_type: "dataMode",
      req_body_form: "data",
      req_body_other: "rawModeData"
    };
    let allKey = ["title","path","method","desc","req_query","req_headers","req_body_type","req_body_form","req_body_other"];
    key = key || allKey;
    let res = {};
    for(let item in key){
      item = key[item];
      if(item === "req_query"){
        res[item] = handleReq_query.bind(this)(data[reflect[item]]);
      }else if(item === "req_headers"){
        res[item] = handleReq_headers.bind(this)(data[reflect[item]]);
      }else if(item === "req_body_form"){
        res[item] = handleReq_body_form.bind(this)(data[reflect[item]]);
      }else if(item === "req_body_type"){
        if(data[reflect[item]] === 'urlencoded' || data[reflect[item]] === 'params'){
          res[item] = 'form';
        }else{
          if(data.headers.indexOf('application/json')>-1){
            res[item] = "json";
          }else{
            res[item] = "raw";
          }
        }
        
      }else if(item === "path"){
        res[item] = handlePath.bind(this)(data[reflect[item]]);
        if(res[item] && res[item].indexOf("/:") > -1){
          let params = res[item].substr(res[item].indexOf("/:")+2).split("/:");
          // res[item] = res[item].substr(0,res[item].indexOf("/:"));
          let arr = [];
          for(let i in params){
            arr.push({
              name: params[i],
              desc: ""
            });
          }
          res["req_params"] = arr;
        }
      }else if(item === "title"){
        let path = handlePath.bind(this)(data[reflect["path"]]);
        if(data[reflect[item]].indexOf(path) > -1){
          res[item] = path;
          if(res[item] && res[item].indexOf("/:") > -1){
            res[item] = res[item].substr(0,res[item].indexOf("/:"));
          }
        }else{
          res[item] = data[reflect[item]];
        }
      }else{
        res[item] = data[reflect[item]];
      }
    }
    return res;
  }
  
  if(!importDataModule || typeof importDataModule !== 'object'){
    console.error('obj参数必需是一个对象');
    return null;
  }

  importDataModule.postman = {
    name: 'Postman',
    run: run,
    desc: '注意：只支持json格式数据'
  }
}



module.exports = function(){


  this.bindHook('import_data', postman)
}