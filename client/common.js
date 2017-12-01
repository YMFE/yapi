import React from 'react';
import moment from 'moment';
import constants from './constants/variable'
import Mock from 'mockjs'
import json5 from 'json5'
import MockExtra from 'common/mock-extra.js'
import {filter} from 'common/power-string.js'

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

// 获取 YAPI LOGO 的 SVG
// 参数 length 为 svg 的直径。
exports.logoSVG = (length) => (<svg className="svg" width={length} height={length} viewBox="0 0 64 64" version="1.1">
  <title>Icon</title>
  <desc>Created with Sketch.</desc>
  <defs>
    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
      <stop stopColor="#FFFFFF" offset="0%"></stop>
      <stop stopColor="#F2F2F2" offset="100%"></stop>
    </linearGradient>
    <circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle>
    <filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3">
      <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
      <feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
      <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
    </filter>
  </defs>
  <g id="首页" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <g id="大屏幕">
      <g id="Icon">
        <circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle>
        <path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fillRule="nonzero"></path>
        <path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fillRule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path>
        <path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fillRule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path>
        <g id="inner-round">
          <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
          <use fill="#F7F7F7" fillRule="evenodd" xlinkHref="#path-2"></use>
        </g>
      </g>
    </g>
  </g>
</svg>);

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