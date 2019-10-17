const { isJson5, json_parse, handleJson, joinPath, safeArray } = require('./utils');
const constants = require('../client/constants/variable.js');
const _ = require('underscore');
const URL = require('url');
const utils = require('./power-string.js').utils;
const HTTP_METHOD = constants.HTTP_METHOD;
const axios = require('axios');
const qs = require('qs');
const CryptoJS = require('crypto-js');
const jsrsasign = require('jsrsasign');
const https = require('https');

const isNode = typeof global == 'object' && global.global === global;
const ContentTypeMap = {
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'application/html': 'html',
  'text/html': 'html',
  other: 'text'
};

const getStorage = async (id)=>{
  try{
    if(isNode){
      let storage = global.storageCreator(id);
      let data = await storage.getItem();
      return {
        getItem: (name)=> data[name],
        setItem: (name, value)=>{
          data[name] = value;
          storage.setItem(data,name,value)
        }
      }
    }else{
      return {
        getItem: (name)=> window.localStorage.getItem(name),
        setItem: (name, value)=>  window.localStorage.setItem(name, value)
      }
    }
  }catch(e){
    console.error(e)
    return {
      getItem: (name)=>{
        console.error(name, e)
      },
      setItem: (name, value)=>{
        console.error(name, value, e)
      }
    }
  }
}

async function httpRequestByNode(options) {
  function handleRes(response) {
    //console.log({response});
    if (!response || typeof response !== 'object') {
      return {
        res: {
          status: 500,
          body: isNode
            ? '请求出错, 内网服务器自动化测试无法访问到，请检查是否为内网服务器！'
            : '请求出错'
        }
      };
    }
    return {
      res: {
        header: response.headers,
        status: response.status,
        body: response.data,
        statusText:response.statusText
      }
    };
  }

  function handleData() {
    let contentTypeItem;
    if (!options) return;
    if (typeof options.headers === 'object' && options.headers) {
      Object.keys(options.headers).forEach(key => {
        if (/content-type/i.test(key)) {
          if (options.headers[key]) {
            contentTypeItem = options.headers[key]
              .split(';')[0]
              .trim()
              .toLowerCase();
          }
        }
        if (!options.headers[key]) delete options.headers[key];
      });

      if (
        contentTypeItem === 'application/x-www-form-urlencoded' &&
        typeof options.data === 'object' &&
        options.data
      ) {
        options.data = qs.stringify(options.data, { indices: false });
      }else if(contentTypeItem === 'multipart/form-data' &&
        typeof options.data === 'object' &&
        options.data){
        let formdata=new FormData();
        Object.keys(options.data).forEach(k=>{formdata.append(k,options.data[k])})
        options.data=formdata;
      }
    }
  }
  try {
    handleData(options);
    let axioscontent={
      method: options.method,
      url: options.url,
      headers: options.headers,
      timeout: 10000,
      maxRedirects: 0,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      data: options.data
    }
    {
      let url = URL.parse(axioscontent.url);
      console.log({"axios 请求：":{...axioscontent, queryParams: qs.parse(url.query)}});
    }
    let response = await axios(axioscontent);
    return handleRes(response);
  } catch (err) {
    console.log({err});
    if (err.response === undefined) {
      if(err.message==="Network Error"){
        err.message={"err":err.message,"des":"请参考教程开启chrome 跨域请求：http://crazy-yapi.camdy.cn/doc/documents/chromeCORS.html"}
      }
      return handleRes({
        headers: {},
        status: null,
        data: err.message
      });
    }
    return handleRes(err.response);
  }
}

function handleContentType(headers) {
  if (!headers || typeof headers !== 'object') return ContentTypeMap.other;
  let contentTypeItem = 'other';
  try {
    Object.keys(headers).forEach(key => {
      if (/content-type/i.test(key)) {
        contentTypeItem = headers[key]
          .split(';')[0]
          .trim()
          .toLowerCase();
      }
    });
    return ContentTypeMap[contentTypeItem] ? ContentTypeMap[contentTypeItem] : ContentTypeMap.other;
  } catch (err) {
    return ContentTypeMap.other;
  }
}

function checkRequestBodyIsRaw(method, reqBodyType) {
  if (
    reqBodyType &&
    reqBodyType !== 'file' &&
    reqBodyType !== 'form' &&
    HTTP_METHOD[method].request_body
  ) {
    return reqBodyType;
  }
  return false;
}

function checkNameIsExistInArray(name, arr) {
  let isRepeat = false;
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item.name === name) {
      isRepeat = true;
      break;
    }
  }
  return isRepeat;
}

function handleCurrDomain(domains, case_env) {
  let currDomain = _.find(domains, item => item.name === case_env);

  if (!currDomain) {
    currDomain = domains[0];
  }
  return currDomain;
}

function sandboxByNode(sandbox = {}, script) {
  const vm = require('vm');
  script = new vm.Script(script);
  const context = new vm.createContext(sandbox);
  script.runInContext(context, {
    timeout: 10000
  });
  return sandbox;
}

async function sandbox(context = {}, script) {
  try {

    context.context = context;
    context.console = console;
    context.Promise = Promise;
    context.setTimeout = setTimeout;
    context = sandboxByNode(context, script);

  } catch (err) {
    err.message = `Script: ${script}
    message: ${err.message}`;
    //console.error(err);
    throw err;
  }
  if (context.promise && typeof context.promise === 'object' && context.promise.then) {
    try {
      await context.promise;
    } catch (err) {
      err.message = `Script: ${script}
      message: ${err.message}`;
      // console.error(err);
      throw err;
    }
  }

  return context;
}



/**
 *
 * @param {*} defaultOptions
 * @param {*} preScript
 * @param {*} afterScript
 * @param {*} commonContext  负责传递一些业务信息，crossRequest 不关注具体传什么，只负责当中间人
 */
async function crossRequest(defaultOptions, preScript, afterScript,case_pre_script,case_post_script, commonContext = {}) {
  let options = Object.assign({}, defaultOptions);
 // console.log({defaultOptions, preScript, afterScript,case_pre_script,case_post_script, commonContext})
  const taskId = options.taskId || Math.random() + '';
  let urlObj = URL.parse(options.url, true),
    query = {};
  query = Object.assign(query, urlObj.query);
  //console.log("context init start!");

  let context = {
    isNode,
    get href() {
      return urlObj.href;
    },
    set href(val) {
      throw new Error('context.href 不能被赋值');
    },
    get hostname() {
      return urlObj.hostname;
    },
    set hostname(val) {
      throw new Error('context.hostname 不能被赋值');
    },

    get caseId() {
      return options.caseId;
    },

    set caseId(val) {
      throw new Error('context.caseId 不能被赋值');
    },

    method: options.method,
    pathname: urlObj.pathname,
    query: query,
    requestHeader: options.headers || {},
    requestBody: options.data,
    promise: false,
    storage: await getStorage(taskId)
  };
  //console.log("context init end!");
  Object.assign(context, commonContext)

  context.utils = Object.freeze({
    _: _,
    CryptoJS: CryptoJS,
    jsrsasign: jsrsasign,
    base64: utils.base64,
    md5: utils.md5,
    sha1: utils.sha1,
    sha224: utils.sha224,
    sha256: utils.sha256,
    sha384: utils.sha384,
    sha512: utils.sha512,
    unbase64: utils.unbase64,
    axios: axios
  });

  if (preScript) {
    context = await sandbox(context, preScript);
    defaultOptions.url = options.url = URL.format({
      protocol: urlObj.protocol,
      host: urlObj.host,
      query: context.query,
      pathname: context.pathname
    });
    defaultOptions.headers = options.headers = context.requestHeader;
    defaultOptions.data = options.data = context.requestBody;
  }
  if (case_pre_script) {
    context = await sandbox(context, case_pre_script);
    defaultOptions.url = options.url = URL.format({
      protocol: urlObj.protocol,
      host: urlObj.host,
      query: context.query,
      pathname: context.pathname
    });
    defaultOptions.headers = options.headers = context.requestHeader;
    defaultOptions.data = options.data = context.requestBody;
  }

  let data;

  data = await httpRequestByNode(options);
  data.req = options;
  data.utils=context.utils;
  data.storage=context.storage;


  if (case_post_script) {
    context.responseData = data.res.body;
    context.responseHeader = data.res.header;
    context.responseStatus = data.res.status;
    context.runTime = data.runTime;
    context = await sandbox(context, case_post_script);
    data.res.body = context.responseData;
    data.res.header = context.responseHeader;
    data.res.status = context.responseStatus;
    data.runTime = context.runTime;
  }

  if (afterScript) {
    context.responseData = data.res.body;
    context.responseHeader = data.res.header;
    context.responseStatus = data.res.status;
    context.runTime = data.runTime;
    context = await sandbox(context, afterScript);
    data.res.body = context.responseData;
    data.res.header = context.responseHeader;
    data.res.status = context.responseStatus;
    data.runTime = context.runTime;
  }

  return data;
}

function handleParams(interfaceData, handleValue, requestParams) {
  let interfaceRunData = Object.assign({}, interfaceData);
  function paramsToObjectWithEnable(arr) {
    const obj = {};
    safeArray(arr).forEach(item => {
      if (item && item.name && (item.enable || item.required === '1')) {
        let value= handleValue(item.value, currDomain.global);
        if(item.type == 'list'){
          value=value.split(',');
        }
        obj[item.name] = value;
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
    });
    return obj;
  }

  function paramsToObjectUnWithEnable(arr) {
    const obj = {};
    safeArray(arr).forEach(item => {
      if (item && item.name) {
        obj[item.name] = handleValue(item.value, currDomain.global);
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
    });
    return obj;
  }

  let { case_env, path, env, _id } = interfaceRunData;
  let currDomain,
    requestBody,
    requestOptions = {};
  currDomain = handleCurrDomain(env, case_env);
  interfaceRunData.req_params = interfaceRunData.req_params || [];
  interfaceRunData.req_params.forEach(item => {
    let val = handleValue(item.value, currDomain.global);
    if (requestParams) {
      requestParams[item.name] = val;
    }
    path = path.replace(`:${item.name}`, val || `:${item.name}`);
    path = path.replace(`{${item.name}}`, val || `{${item.name}}`);
  });

  const urlObj = URL.parse(joinPath(currDomain.domain, path), true);
  const url = URL.format({
    protocol: urlObj.protocol || 'http',
    host: urlObj.host,
    pathname: urlObj.pathname,
    query: Object.assign(urlObj.query, paramsToObjectWithEnable(interfaceRunData.req_query))
  });

  let headers = paramsToObjectUnWithEnable(interfaceRunData.req_headers);
  requestOptions = {
    url,
    caseId: _id,
    method: interfaceRunData.method,
    headers,
    timeout: 82400000
  };

  // 对 raw 类型的 form 处理
  try {
    if (interfaceRunData.req_body_type === 'raw') {
      if (headers && headers['Content-Type']) {
        if (headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
          interfaceRunData.req_body_type = 'form';
          let reqData = json_parse(interfaceRunData.req_body_other);
          if (reqData && typeof reqData === 'object') {
            interfaceRunData.req_body_form = [];
            Object.keys(reqData).forEach(key => {
              interfaceRunData.req_body_form.push({
                name: key,
                type: 'text',
                value: JSON.stringify(reqData[key]),
                enable: true
              });
            });
          }
        } else if (headers['Content-Type'].indexOf('application/json') >= 0) {
          interfaceRunData.req_body_type = 'json';
        }
      }
    }
  } catch (e) {
    console.error('err', e);
  }

  if (HTTP_METHOD[interfaceRunData.method].request_body) {
    if (interfaceRunData.req_body_type === 'form') {
      requestBody = paramsToObjectWithEnable(
        safeArray(interfaceRunData.req_body_form).filter(item => {
          return item.type == 'text'||item.type == 'list';
        })
      );
    } else if (interfaceRunData.req_body_type === 'json') {
      let reqBody = isJson5(interfaceRunData.req_body_other);
      if (reqBody === false) {
        requestBody = interfaceRunData.req_body_other;
      } else {
        if (requestParams) {
          requestParams = Object.assign(requestParams, reqBody);
        }
        requestBody = handleJson(reqBody, val => handleValue(val, currDomain.global));
      }
    } else {
      requestBody = interfaceRunData.req_body_other;
    }
    requestOptions.data = requestBody;
    if (interfaceRunData.req_body_type === 'form') {
      requestOptions.files = paramsToObjectWithEnable(
        safeArray(interfaceRunData.req_body_form).filter(item => {
          return item.type == 'file';
        })
      );
    } else if (interfaceRunData.req_body_type === 'file') {
      requestOptions.file = 'single-file';
    }
  }
  return requestOptions;
}

exports.checkRequestBodyIsRaw = checkRequestBodyIsRaw;
exports.handleParams = handleParams;
exports.handleContentType = handleContentType;
exports.crossRequest = crossRequest;
exports.handleCurrDomain = handleCurrDomain;
exports.checkNameIsExistInArray = checkNameIsExistInArray;
