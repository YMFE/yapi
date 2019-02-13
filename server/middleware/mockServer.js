const yapi = require('../yapi.js');
const projectModel = require('../models/project.js');
const interfaceModel = require('../models/interface.js');
const mockExtra = require('../../common/mock-extra.js');
const { schemaValidator } = require('../../common/utils.js');
const _ = require('underscore');
const Mock = require('mockjs');
const variable = require('../../client/constants/variable.js')
/**
 *
 * @param {*} apiPath /user/tom
 * @param {*} apiRule /user/:username
 */
function matchApi(apiPath, apiRule) {
  let apiRules = apiRule.split('/');
  let apiPaths = apiPath.split('/');
  let pathParams = {
    __weight: 0
  };

  if (apiPaths.length !== apiRules.length) {
    return false;
  }
  for (let i = 0; i < apiRules.length; i++) {
    if (apiRules[i]) {
      apiRules[i] = apiRules[i].trim();
    } else {
      continue;
    }
    if (
      apiRules[i].length > 2 &&
      apiRules[i][0] === '{' &&
      apiRules[i][apiRules[i].length - 1] === '}'
    ) {
      pathParams[apiRules[i].substr(1, apiRules[i].length - 2)] = apiPaths[i];
    } else if (apiRules[i].indexOf(':') === 0) {
      pathParams[apiRules[i].substr(1)] = apiPaths[i];
    } else if (
      apiRules[i].length > 2 &&
      apiRules[i].indexOf('{') > -1 &&
      apiRules[i].indexOf('}') > -1
    ) {
      let params = [];
      apiRules[i] = apiRules[i].replace(/\{(.+?)\}/g, function(src, match) {
        params.push(match);
        return '([^\\/\\s]+)';
      });
      apiRules[i] = new RegExp(apiRules[i]);
      if (!apiRules[i].test(apiPaths[i])) {
        return false;
      }

      let matchs = apiPaths[i].match(apiRules[i]);

      params.forEach((item, index) => {
        pathParams[item] = matchs[index + 1];
      });
    } else {
      if (apiRules[i] !== apiPaths[i]) {
        return false;
      }else{
        pathParams.__weight++;
      }
    }
  }
  return pathParams;
}

function parseCookie(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  if (str.split(';')[0]) {
    let c = str.split(';')[0].split('=');
    return { name: c[0], value: c[1] || '' };
  }
  return null;
}

function handleCorsRequest(ctx) {
  let header = ctx.request.header;
  ctx.set('Access-Control-Allow-Origin', header.origin);
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEADER, PATCH, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', header['access-control-request-headers']);
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Max-Age', 1728000);
  ctx.body = 'ok';
}
// 必填字段是否填写好
function mockValidator(interfaceData, ctx) {
  let i,
    j,
    l,
    len,
    noRequiredArr = [];
  let method = interfaceData.method.toUpperCase() || 'GET';
  // query 判断
  for (i = 0, l = interfaceData.req_query.length; i < l; i++) {
    let curQuery = interfaceData.req_query[i];
    if (curQuery && typeof curQuery === 'object' && curQuery.required === '1') {
      if (!ctx.query[curQuery.name]) {
        noRequiredArr.push(curQuery.name);
      }
    }
  }
  // form 表单判断
  if (variable.HTTP_METHOD[method].request_body && interfaceData.req_body_type === 'form') {
    for (j = 0, len = interfaceData.req_body_form.length; j < len; j++) {
      let curForm = interfaceData.req_body_form[j];
      if (curForm && typeof curForm === 'object' && curForm.required === '1') {
        if (
          ctx.request.body[curForm.name] ||
          (ctx.request.body.fields && ctx.request.body.fields[curForm.name]) ||
          (ctx.request.body.files && ctx.request.body.files[curForm.name])
        ) {
          continue;
        }

        noRequiredArr.push(curForm.name);
      }
    }
  }
  let validResult;
  // json schema 判断
  if (variable.HTTP_METHOD[method].request_body  && interfaceData.req_body_type === 'json' && interfaceData.req_body_is_json_schema === true) {
    const schema = yapi.commons.json_parse(interfaceData.req_body_other);
    const params = yapi.commons.json_parse(ctx.request.body);
    validResult = schemaValidator(schema, params);
  }
  if (noRequiredArr.length > 0 || (validResult && !validResult.valid)) {
    let message = `错误信息：`;
    message += noRequiredArr.length > 0 ? `缺少必须字段 ${noRequiredArr.join(',')}  ` : '';
    message += validResult && !validResult.valid ? `shema 验证请求参数 ${validResult.message}` : '';

    return {
      valid: false,
      message
    };
  }

  return { valid: true };
}

module.exports = async (ctx, next) => {
  // no used variable 'hostname' & 'config'
  // let hostname = ctx.hostname;
  // let config = yapi.WEBCONFIG;
  let path = ctx.path;
  let header = ctx.request.header;

  if (path.indexOf('/mock/') !== 0) {
    if (next) await next();
    return true;
  }

  let paths = path.split('/');
  let projectId = paths[2];
  paths.splice(0, 3);
  path = '/' + paths.join('/');

  ctx.set('Access-Control-Allow-Origin', header.origin);
  ctx.set('Access-Control-Allow-Credentials', true);

  // ctx.set('Access-Control-Allow-Origin', '*');

  if (!projectId) {
    return (ctx.body = yapi.commons.resReturn(null, 400, 'projectId不能为空'));
  }

  let projectInst = yapi.getInst(projectModel),
    project;
  try {
    project = await projectInst.get(projectId);
  } catch (e) {
    return (ctx.body = yapi.commons.resReturn(null, 403, e.message));
  }

  if (!project) {
    return (ctx.body = yapi.commons.resReturn(null, 400, '不存在的项目'));
  }

  let interfaceData, newpath;
  let interfaceInst = yapi.getInst(interfaceModel);

  try {
    newpath = path.substr(project.basepath.length);
    interfaceData = await interfaceInst.getByPath(project._id, newpath, ctx.method);
    let queryPathInterfaceData = await interfaceInst.getByQueryPath(project._id, newpath, ctx.method);
    //处理query_path情况  url 中有 ?params=xxx
    if (!interfaceData || interfaceData.length != queryPathInterfaceData.length) {

      let i,
        l,
        j,
        len,
        curQuery,
        match = false;
      for (i = 0, l = queryPathInterfaceData.length; i < l; i++) {
        match = false;
        let currentInterfaceData = queryPathInterfaceData[i];
        curQuery = currentInterfaceData.query_path;
        if (!curQuery || typeof curQuery !== 'object' || !curQuery.path) {
          continue;
        }
        for (j = 0, len = curQuery.params.length; j < len; j++) {
          if (ctx.query[curQuery.params[j].name] !== curQuery.params[j].value) {
            continue;
          }
          if (j === len - 1) {
            match = true;
          }
        }

        if (match) {
          interfaceData = [currentInterfaceData];
          break;
        }
        // if (i === l - 1) {
        //   interfaceData = [];
        // }

      }
    }

    //处理动态路由
    if (!interfaceData || interfaceData.length === 0) {
      let newData = await interfaceInst.getVar(project._id, ctx.method);

      let findInterface;
      let weight = 0;
      _.each(newData, item => {
        let m = matchApi(newpath, item.path);
        if (m !== false) {
          if(m.__weight >= weight){
            findInterface = item;
          }
          delete m.__weight;
          ctx.request.query = Object.assign(m, ctx.request.query);
          return true;
        }
        return false;
      });

      if (!findInterface) {
        //非正常跨域预检请求回应
        if (ctx.method === 'OPTIONS' && ctx.request.header['access-control-request-method']) {
          return handleCorsRequest(ctx);
        }

        return (ctx.body = yapi.commons.resReturn(
          null,
          404,
          `不存在的api, 当前请求path为 ${newpath}， 请求方法为 ${
            ctx.method
          } ，请确认是否定义此请求。`
        ));
      }
      interfaceData = [await interfaceInst.get(findInterface._id)];
    }

    if (interfaceData.length > 1) {
      return (ctx.body = yapi.commons.resReturn(null, 405, '存在多个api，请检查数据库'));
    } else {
      interfaceData = interfaceData[0];
    }

    // 必填字段是否填写好
    if (project.strice) {
      const validResult = mockValidator(interfaceData, ctx);
      if (!validResult.valid) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          404,
          `接口字段验证不通过, ${validResult.message}`
        ));
      }
    }

    let res;
    // mock 返回值处理
    res = interfaceData.res_body;
    try {
      if (interfaceData.res_body_type === 'json') {
        if (interfaceData.res_body_is_json_schema === true) {
          //json-schema
          const schema = yapi.commons.json_parse(interfaceData.res_body);
          res = yapi.commons.schemaToJson(schema, {
            alwaysFakeOptionals: true
          });
        } else {
          // console.log('header', ctx.request.header['content-type'].indexOf('multipart/form-data'))
          // 处理 format-data

          if (
            _.isString(ctx.request.header['content-type']) &&
            ctx.request.header['content-type'].indexOf('multipart/form-data') > -1
          ) {
            ctx.request.body = ctx.request.body.fields;
          }
          // console.log('body', ctx.request.body)

          res = mockExtra(yapi.commons.json_parse(interfaceData.res_body), {
            query: ctx.request.query,
            body: ctx.request.body,
            params: Object.assign({}, ctx.request.query, ctx.request.body)
          });
          // console.log('res',res)
        }

        try {
          res = Mock.mock(res);
        } catch (e) {
          console.log('err', e.message);
          yapi.commons.log(e, 'error');
        }
      }

      let context = {
        projectData: project,
        interfaceData: interfaceData,
        ctx: ctx,
        mockJson: res,
        resHeader: {},
        httpCode: 200,
        delay: 0
      };

      if (project.is_mock_open && project.project_mock_script) {
        // 项目层面的mock脚本解析
        let script = project.project_mock_script;
        yapi.commons.handleMockScript(script, context);
      }

      await yapi.emitHook('mock_after', context);

      let handleMock = new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, context.delay);
      });
      await handleMock;
      if (context.resHeader && typeof context.resHeader === 'object') {
        for (let i in context.resHeader) {
          let cookie;
          if (i === 'Set-Cookie') {
            if (context.resHeader[i] && typeof context.resHeader[i] === 'string') {
              cookie = parseCookie(context.resHeader[i]);
              if (cookie && typeof cookie === 'object') {
                ctx.cookies.set(cookie.name, cookie.value, {
                  maxAge: 864000000,
                  httpOnly: false
                });
              }
            } else if (context.resHeader[i] && Array.isArray(context.resHeader[i])) {
              context.resHeader[i].forEach(item => {
                cookie = parseCookie(item);
                if (cookie && typeof cookie === 'object') {
                  ctx.cookies.set(cookie.name, cookie.value, {
                    maxAge: 864000000,
                    httpOnly: false
                  });
                }
              });
            }
          } else {
            ctx.set(i, context.resHeader[i]);
          }
        }
      }

      ctx.status = context.httpCode;
      ctx.body = context.mockJson;
      return;  
    } catch (e) {
      yapi.commons.log(e, 'error');
      return (ctx.body = {
        errcode: 400,
        errmsg: '解析出错，请检查。Error: ' + e.message,
        data: null
      });
    }
  } catch (e) {
    yapi.commons.log(e, 'error');
    return (ctx.body = yapi.commons.resReturn(null, 409, e.message));
  }
};
