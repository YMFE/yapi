import { isJson5, handleJson, joinPath, safeArray } from '../../common.js'
import constants from '../../constants/variable.js'
import _ from "underscore"
import URL from 'url';
const HTTP_METHOD = constants.HTTP_METHOD;

exports.checkRequestBodyIsRaw = checkRequestBodyIsRaw;
exports.handleParams = handleParams;
exports.handleContentType = handleContentType;
exports.crossRequest = crossRequest;

const ContentTypeMap = {
  'application/json': 'json',
  'application/xml': 'xml',
  'other': 'text',
  'application/html': 'html'
}

function handleContentType(headers) {
  if (!headers || typeof headers !== 'object') return ContentTypeMap.other;
  let contentTypeItem = 'other';
  try {
    Object.keys(headers).forEach(key => {
      if (/content-type/i.test(key)) {
        contentTypeItem = headers[key].split(";")[0].trim().toLowerCase();
      }
    })
    return ContentTypeMap[contentTypeItem] ? ContentTypeMap[contentTypeItem] : ContentTypeMap.other;
  } catch (err) {
    return ContentTypeMap.other
  }

}

function checkRequestBodyIsRaw(method, reqBodyType) {
  if (reqBodyType && reqBodyType !== 'file' && reqBodyType !== 'form' && HTTP_METHOD[method].request_body) {
    return reqBodyType;
  }
  return false;
}


function handleCurrDomain(domains, case_env) {
  let currDomain = _.find(domains, item => item.name === case_env);
  if (!currDomain) {
    currDomain = domains[0];
  }
  return currDomain;
}

function crossRequest(options) {
  return new Promise((resolve, reject) => {
    options.error = options.success = function (res, header, data) {
      let message = '请求异常，请检查 chrome network 错误信息...';
      if (isNaN(data.res.status)) {
        reject({
          body: res || message,
          header,
          message
        })
      }
      resolve(data);
    }
    window.crossRequest(options);
  })
}


function handleParams(interfaceData, handleValue, requestParams) {
  function paramsToObjectWithEnable(arr) {
    const obj = {};
    safeArray(arr).forEach(item => {
      if (item && item.name && (item.enable || item.required === '1')) {
        obj[item.name] = handleValue(item.value);
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
    })
    return obj;
  }
  
  function paramsToObjectUnWithEnable(arr) {
    const obj = {};
    safeArray(arr).forEach(item => {
      if (item && item.name) {
        obj[item.name] = handleValue(item.value);
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
      
    })
    return obj;
  }

  let { case_env, path, env } = interfaceData;
  let currDomain, requestBody, requestOptions;

  interfaceData.req_params = interfaceData.req_params || [];
  interfaceData.req_params.forEach(item => {
    let val = handleValue(item.value);
    if (requestParams) {
      requestParams[item.name] = val;
    }

    path = path.replace(`:${item.name}`, val || `:${item.name}`);
    path = path.replace(`{${item.name}}`, val || `{${item.name}}`)
  });


  currDomain = handleCurrDomain(env, case_env);
  const urlObj = URL.parse(joinPath(currDomain.domain, path), true);
  
    const url = URL.format({
      protocol: urlObj.protocol || 'http',
      host: urlObj.host,
      pathname: urlObj.pathname,
      query: Object.assign(urlObj.query, paramsToObjectWithEnable(interfaceData.req_query))
  
    });
  
    requestOptions = {
      url,
      method: interfaceData.method,
      headers: paramsToObjectUnWithEnable(interfaceData.req_headers),    
      timeout: 82400000
    }
  
    if (HTTP_METHOD[interfaceData.method].request_body) {
      if (interfaceData.req_body_type === 'form') {
        requestBody = paramsToObjectWithEnable(safeArray(interfaceData.req_body_form).filter(item => {
          return item.type == 'text'
        }));
      } else if(interfaceData.req_body_type === 'json'){
        let reqBody = isJson5(interfaceData.req_body_other);
        if (reqBody === false) {
          requestBody = interfaceData.req_body_other;
        } else {
          if (requestParams) {
            requestParams = Object.assign(requestParams, reqBody);
          }
          requestBody = handleJson(reqBody, handleValue);
        }
      }else{
        requestBody = interfaceData.req_body_other;
      }
      requestOptions.data = requestBody;
      if (interfaceData.req_body_type === 'form') {
        requestOptions.files = paramsToObjectWithEnable(safeArray(interfaceData.req_body_form).filter(item => {
          return item.type == 'file'
        }))
      } else if (interfaceData.req_body_type === 'file') {
        requestOptions.file = 'single-file'
      }
    }
  
    return requestOptions;

}