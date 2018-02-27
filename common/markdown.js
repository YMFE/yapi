
function escapeStr(str, isToc) {
  return isToc ? escape(str) : str;
}

function createBaseMessage(basepath, inter) {
  // 基本信息
  let baseMessage = `### 基本信息\n\n**Path：** ${basepath + inter.path}\n\n**Method：** ${inter.method}\n\n**接口描述：**\n${inter.desc}\n`;
  return baseMessage;
}

function createReqHeaders(req_headers) {
  // Request-headers
  if (req_headers && req_headers.length) {
    let headersTable = `**Headers**\n\n`;
    headersTable += `| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_headers.length; j++) {
      headersTable += `| ${req_headers[j].name || ""}  |  ${req_headers[j].value || ""} | ${req_headers[j].required == 1 ? "是" : "否"}  |  ${req_headers[j].example  || ""} |  ${req_headers[j].desc  || ""} |\n`;
    }
    return headersTable;
  }
  return "";
}


function createPathParams(req_params) {
  if (req_params && req_params.length) {
    let paramsTable = `**路径参数**\n`;
    paramsTable += `| 参数名称 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_params.length; j++) {
      paramsTable += `| ${req_params[j].name  || ""} |  ${req_params[j].example  || ""} |  ${req_params[j].desc  || ""} |\n`;
    }
    return paramsTable;
  }
  return "";
}

function createReqQuery(req_query) {
  // console.log("req_query", req_query);
  if (req_query && req_query.length) {
    let headersTable = `**Query**\n\n`;
    headersTable += `| 参数名称  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ |\n`;
    for (let j = 0; j < req_query.length; j++) {
      headersTable += `| ${req_query[j].name  || ""} | ${req_query[j].required == 1 ? "是" : "否"}  |  ${req_query[j].example  || ""} |  ${req_query[j].desc  || ""} |\n`;
    }
    return headersTable;
  }
  return "";
}

function createReqBody(req_body_type, req_body_form, req_body_other) {
  if (req_body_type === "form" && req_body_form.length) {
    let bodyTable = `**Body**\n\n`
    bodyTable += `| 参数名称  | 参数类型  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`; let req_body = req_body_form;
    for (let j = 0; j < req_body.length; j++) {
      bodyTable += `| ${req_body[j].name  || ""} | ${req_body[j].type || ""}  |  ${req_body[j].required == 1 ? "是" : "否"} |  ${req_body[j].example  || ""}  |  ${req_body[j].desc  || ""} |\n`;
    }
    return `${bodyTable}\n\n`;
  } else if (req_body_other) {//other
    return `**Body**\n\n` + "```javascript" + `\n${req_body_other || ""}` + "\n```";
  }
  return "";
}

function createResponse(res_body) {
  let resTitle = `\n### Reponse\n\n`;
  if (res_body) {
    let resBody = "```javascript" + `\n${res_body || ""}\n` + "```";
    return resTitle + resBody;
  }
  return "";
}

function createInterMarkdown(basepath, listItem, isToc){
  let mdTemplate = ``;
  const toc = `[TOC]\n\n`;
  // 接口名称
  mdTemplate += `\n## ${escapeStr(`${listItem.title}\n<a id=${listItem.title}> </a>`, isToc)}\n`;
  isToc && (mdTemplate += toc)
  // 基本信息
  mdTemplate += createBaseMessage(basepath, listItem);
  // Request
  mdTemplate += `\n### Request\n`;
  // Request-headers
  mdTemplate += createReqHeaders(listItem.req_headers);
  // Request-params
  mdTemplate += createPathParams(listItem.req_params);
  // Request-query
  mdTemplate += createReqQuery(listItem.req_query);
  // Request-body
  mdTemplate += createReqBody(listItem.req_body_type, listItem.req_body_form, listItem.req_body_other);
  // Response
  // Response-body
  mdTemplate += createResponse(listItem.res_body);

  return mdTemplate;
}

function createProjectMarkdown(curProject){

  let mdTemplate = ``;
   // 项目名、项目描述
   let title = `<h1 class="curproject-name"> ${curProject.name} </h1>`;
   mdTemplate += `\n ${title} \n ${curProject.desc || ""}\n\n`

   return mdTemplate
}

function createClassMarkdown(curProject, list, isToc) {
  let mdTemplate = ``;
  const toc = `[TOC]\n\n`;
  list.map(item => {
    // 分类名称
    mdTemplate += `\n# ${escapeStr(item.name, isToc)}\n`;
    isToc && (mdTemplate += toc)
    for (let i = 0; i < item.list.length; i++) {//循环拼接 接口
      // 接口内容
      mdTemplate += createInterMarkdown(curProject.basepath, item.list[i], isToc);
    }
  })
  return mdTemplate;
}

let r = {
  createInterMarkdown,
  createProjectMarkdown,
  createClassMarkdown
}

module.exports = r;
