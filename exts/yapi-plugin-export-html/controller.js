const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const yapi = require('yapi.js');
// const markdownIt = require("markdown-it");
// const markdownItAnchor = require("markdown-it-anchor");
// const markdownItTableOfContents = require("markdown-it-table-of-contents");
class exportMarkdownController extends baseController{
  constructor(ctx){
    super(ctx);
    this.interModel = yapi.getInst(interfaceModel);
  }
  async exportHtml(ctx){//先转为md再转为html
    var pid = ctx.request.query.pid;
    if(!pid){
      ctx.body = yapi.commons.resReturn(null, 200, "pid 不为空");
    }
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
##${interList[i].title}
`;
        // 基本信息
        mdTemplate += `### 基本信息
** 接口名称：**${interList[i].title}
**接口路径：**${interList[i].path}
**接口描述：**
        
${interList[i].desc?interList[i].desc:""}

`;
        // Request-headers
        mdTemplate +=  `###Request
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
        // Response
        mdTemplate += `###Reponse

`;
        if(interList[i].res_body){
        mdTemplate += "```javascript"+
`
${interList[i].res_body || ""}
`+
"```";
        }
      }
    }catch(e){
      console.log(e);
    }

    ctx.set("Content-Type", "application/octet-stream");
    ctx.set("Content-Disposition",`attachment; filename=test.md`);

    // let md = new markdownIt();
    // md.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
    // md.use(markdownItTableOfContents);
    // let htmlTemplate = md.render(mdTemplate)
    return ctx.body = "htmlTemplate";
  }
}

module.exports = exportMarkdownController;