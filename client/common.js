const  moment = require('moment');
const  constants = require ('./constants/variable')
const Mock =  require('mockjs')
const json5 = require('json5')
const MockExtra = require('common/mock-extra.js')
const filter = require('common/power-string.js').filter;

const Roles = {
  0 : 'admin',
  10: 'owner',
  20: 'dev',
  30: 'guest',
  40: 'member'
}

const roleAction = {
  'manageUserlist' : 'admin',
  'changeMemberRole': 'owner',
  'editInterface': 'dev',
  'viewPrivateInterface': 'guest',
  'viewGroup': 'guest'
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

exports.isJson = isJson;

function isJson5(json){
  if(!json) return false;
  try{
    json = json5.parse(json);
    return json;
  }catch(e){
    return false;
  }
}

exports.json5_parse = function(json){
  try{
    return json5.parse(json);
  }catch(err){
    return json;
  }
}

exports.json_parse = function(json){
  try{
    return JSON.parse(json);
  }catch(err){
    return json;
  }
}

function deepCopyJson(json){
  return JSON.parse(JSON.stringify(json));
}

exports.deepCopyJson = deepCopyJson;

exports.isJson5 = isJson5;

exports.checkAuth = (action, role)=>{
  return Roles[roleAction[action]] <= Roles[role];
}

exports.formatTime = (timestamp) => {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss")
}

// 防抖函数，减少高频触发的函数执行的频率
// 请在 constructor 里使用:
// import { debounce } from '$/common';
// this.func = debounce(this.func, 400);
exports.debounce = (func, wait) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};


// 从 Javascript 对象中选取随机属性
exports.pickRandomProperty = (obj) => {
  let result;
  let count = 0;
  for (let prop in obj)
    if (Math.random() < 1 / ++count) result = prop;
  return result;
}

exports.getImgPath = (path, type) => {
  let rate = window.devicePixelRatio >= 2 ? 2 : 1;
  return `${path}@${rate}x.${type}`;
}

function trim(str) {
  if (!str) {
    return str;
  }

  str = str + '';

  return str.replace(/(^\s*)|(\s*$)/g, '');
}

exports.trim = trim;

exports.handlePath = (path) => {
  path = trim(path);
  if (!path) return path;
  if (path === '/') return '';
  path = path[0] !== '/' ? '/' + path : path;
  path = path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
  return path;
}

exports.handleApiPath = (path) => {
  if (!path) return '';
  path = trim(path);  
  path = path[0] !== '/' ? '/' + path : path;
  return path;
}

// 名称限制 constants.NAME_LIMIT 字符
exports.nameLengthLimit = (type) => {
  // 返回字符串长度，汉字计数为2
  const strLength = (str) => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      str.charCodeAt(i) > 255 ? length += 2 : length++;
    }
    return length;
  }
  // 返回 form中的 rules 校验规则
  return [{
    required: true,
    validator(rule, value, callback) {
      const len = value ? strLength(value) : 0;
      if (len > constants.NAME_LIMIT) {
        callback('请输入' + type + '名称，长度不超过' + constants.NAME_LIMIT + '字符(中文算作2字符)!');
      } else if (len === 0) {
        callback('请输入' + type + '名称，长度不超过' + constants.NAME_LIMIT + '字符(中文算作2字符)!');
      } else {
        return callback();
      }
    }
  }]
}

// 实现 Object.entries() 方法
exports.entries = (obj) => {
  let res = [];
  for(let key in obj) {
    res.push([key, obj[key]]);
  }
  return res;
}

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

  return val.replace(variableRegexp, handleFilter)
}

exports.handleJson = handleJson;
exports.handleParamsValue = handleParamsValue;

exports.getMockText = (mockTpl) => {
  try{
    return JSON.stringify(Mock.mock(MockExtra(json5.parse(mockTpl), {})), null, "  ")
  }catch(err){
    return ''
  }
  
}

/**
 * 合并后新的对象属性与 Obj 一致，nextObj 有对应属性则取 nextObj 属性值，否则取 Obj 属性值
 * @param  {Object} Obj     旧对象
 * @param  {Object} nextObj 新对象
 * @return {Object}           合并后的对象
 */
exports.safeAssign = (Obj, nextObj) => {
  let keys = Object.keys(nextObj);
  return Object.keys(Obj).reduce((result, value) => {
      if (keys.indexOf(value) >= 0) {
          result[value] = nextObj[value];
      } else {
          result[value] = Obj[value];
      }
      return result;
  }, {});
};

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