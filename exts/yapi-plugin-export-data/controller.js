const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const yapi = require('yapi.js');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTableOfContents = require("markdown-it-table-of-contents");
const defaultTheme = require("./defaultTheme.js");
class exportController extends baseController{
  constructor(ctx){
    super(ctx);
    this.interModel = yapi.getInst(interfaceModel);
  }

  async exportData(ctx){
    let pid = ctx.request.query.pid;
    let type = ctx.request.query.type;
    if(!pid){
      ctx.body = yapi.commons.resReturn(null, 200, "pid 不为空");
    }
    let tp = "";
    switch(type){
      case "markdown": {
        tp = await createMarkdown.bind(this)(pid);
        break;
      }
      case "pdf": {
        
        break;
      }
      default: {//默认为html
        let md = await createMarkdown.bind(this)(pid);
        let markdown = new markdownIt();
        markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
        markdown.use(markdownItTableOfContents,{
          markerPattern: /^\[toc\]/im
        });
        tp = defaultTheme + markdown.render(md);
        break;
      }

    }
    

    async function createMarkdown(pid){//拼接markdown
    //模板
    let mdTemplate = ``;
    const toc = `**目录 (Table of Contents)**

[TOC]

`;
    mdTemplate += toc;
    try{
      const interList = await this.interModel.listByPid(pid);
      for(let i = 0;i<interList.length;i++){
        // 接口名称
        mdTemplate += `
## ${interList[i].title}
`;
        // 基本信息
        mdTemplate += `### 基本信息

**接口名称：**${interList[i].title}

**接口路径：**${interList[i].path}

**接口描述：**
        
${interList[i].desc?interList[i].desc:""}

`;
        // Request-headers
        mdTemplate +=  `### Request
`;
        if(interList[i].req_headers&&interList[i].req_headers.length){
          const req_headers = interList[i].req_headers;
          let headersTable = `**Headers：**

`;
          headersTable += `| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
`;
          for(let j = 0;j<req_headers.length;j++){
            headersTable += `| ${req_headers[j].name||""}  |  ${req_headers[j].value||""} | ${req_headers[j].required?"是":"否"}  |  ${req_headers[j].example||""} |  ${req_headers[j].desc||""} |
`;
          }
          mdTemplate += headersTable;
        }
        // Request-params
        if(interList[i].req_params&&interList[i].req_params.length){
          let req_params = interList[i].req_params;
          let paramsTable = `**路径参数**

`;
          paramsTable += `| 参数名称 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
`;
          for(let j = 0;j<req_params.length;j++){
            paramsTable += `| ${req_params[j].name || ""} |  ${req_params[j].example || ""} |  ${req_params[j].desc||""} |
`;
          }
          mdTemplate += paramsTable;
        }

        // Request-query
        if(interList[i].req_query&&interList[i].req_query.length){
          const req_query = interList[i].req_query;
          let headersTable = `**Query**

`;
          headersTable += `| 参数名称  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ |
`;
          for(let j = 0;j<req_query.length;j++){
            headersTable += `| ${req_query[j].name || ""} | ${req_query[j].required?"是":"否"}  |  ${req_query[j].example || ""} |  ${req_query[j].desc||""} |
`;
          }
          mdTemplate += headersTable;
        }
        // Request-body
        if(interList[i].req_body_type === "form" && interList[i].req_body_form.length){
          let bodyTable = `**Body：**

`
          bodyTable += `| 参数名称  | 参数类型  |  是否必须 | 示例  | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
`;        let req_body = interList[i].req_body_form;
          for(let j = 0;j<req_body.length;j++){
            bodyTable += `| ${req_body[j].name || ""} | ${req_body[j].required?"是":"否"}  |  ${req_body[j].example || ""} |  ${req_body[j].desc||""} |

`;
          }
          mdTemplate += bodyTable;
        }else if(interList[i].res_body_other){//other
          mdTemplate += "```javascript"+
`
${interList[i].res_body_other || ""}
`+
"```";
        }
        // Response
        mdTemplate += `
### Reponse

`;
        if(interList[i].res_body){
        mdTemplate += "```javascript"+
`
${interList[i].res_body || ""}
`+
"```";
        }
      }
      return mdTemplate;
    }catch(e){
      console.log(e);
    }
    }

    ctx.set("Content-Type", "application/octet-stream");
    ctx.set("Content-Disposition",`attachment; filename=test.md`);

    return ctx.body = tp;
  }
}

module.exports = exportController;