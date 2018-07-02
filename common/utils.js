const Mock = require('mockjs')
const filter = require('./power-string.js').filter;
const json5 = require('json5')
/**
 * 作用：解析规则串 key ，然后根据规则串的规则以及路径找到在 json 中对应的数据
 * 规则串：$.{key}.{body||params}.{dataPath} 其中 body 为返回数据，params 为请求数据，datapath 为数据的路径
 * 数组：$.key.body.data.arr[0]._id  (获取 key 所指向请求的返回数据的 arr 数组的第 0 项元素的 _id 属性)
 * 对象：$.key.body.data.obj._id ((获取 key 所指向请求的返回数据的 obj 对象的 _id 属性))
 * 
 * @param String key 规则串
 * @param Object json 数据
 * @returns 
 */
function simpleJsonPathParse(key, json){
  if(!key || typeof key !== 'string' || key.indexOf('$.') !== 0 || key.length <= 2){
    return null;
  }
  let keys = key.substr(2).split(".");
  keys = keys.filter(item=>{
    return item;
  })
  for(let i=0, l = keys.length; i< l; i++){
    try{
      let m = keys[i].match(/(.*?)\[([0-9]+)\]/)
      if(m){
        json = json[m[1]][m[2]];
      }else{
        json = json[keys[i]];
      }
    }catch(e){
      json = '';
      break;
    }
  }
  
  return json;
}

function handleMockWord(word) {
  if(!word || typeof word !== 'string' || word[0] !== '@') return word;
  return Mock.mock(word);
}

/**
 * 
 * @param {*} data 
 * @param {*} handleValueFn 处理参数值函数
 */
function handleJson(data, handleValueFn) {
  if (!data) {
    return data;
  }
  if (typeof data === 'string') {
    return handleValueFn(data);
  } else if (typeof data === 'object') {
    for (let i in data) {
      data[i] = handleJson(data[i], handleValueFn);
    }
  } else {
    return data;
  }
  return data;
}

function handleValueWithFilter(context){
  return function(match){
    if (match[0] === '@') {
      return handleMockWord(match);
    } else if (match.indexOf('$.') === 0) {
      
      return simpleJsonPathParse(match, context);
    } else{
      return match;
    }
  }  
}


function handleFilter(str, match, context){    
  match = match.trim();
  try{
    
    let a=  filter(match, handleValueWithFilter(context))
    
    return a;
  }catch(err){
    return str;
  }
}


function handleParamsValue (val, context={}){
  const variableRegexp = /\{\{\s*([^}]+?)\}\}/g;
  if (!val || typeof val !== 'string') {
    return val;
  }
  val = val.trim()
  
  let match = val.match(/^\{\{([^\}]+)\}\}$/); 
  if (!match){
    if(val[0] ==='@' || val[0] === '$'){
     
      return handleFilter(val, val, context);
    }
  }else{
   
    return handleFilter(val, match[1], context);
  }

  return val.replace(variableRegexp, (str, match)=>{
    return handleFilter(str, match, context)
  })
}

exports.handleJson = handleJson;
exports.handleParamsValue = handleParamsValue;

exports.simpleJsonPathParse = simpleJsonPathParse;
exports.handleMockWord = handleMockWord;

exports.joinPath = (domain, joinPath) =>{
  let l = domain.length;
  if(domain[l - 1] === '/'){
    domain = domain.substr(0, l - 1)
  }
  if(joinPath[0] !== '/'){
    joinPath = joinPath.substr(1);
  }
  return domain + joinPath;
}

exports.safeArray = (arr) => {
  return Array.isArray(arr) ? arr :  [];
}

exports.isJson5 = function isJson5(json){
  if(!json) return false;
  try{
    json = json5.parse(json);
    return json;
  }catch(e){
    return false;
  }
}

function isJson(json){
  if(!json) return false;
  try{
    json = JSON.parse(json);
    return json;
  }catch(e){
    return false;
  }
}

exports.isJson = isJson

exports.json_parse = function(json){
  try{
    return JSON.parse(json);
  }catch(err){
    return json;
  }
}

exports.json_format= function(json){
  try{
    return JSON.stringify(JSON.parse(json), null, '   ');
  }catch(e){
    return json;
  }
}

