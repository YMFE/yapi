const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const projectModel = require('models/project.js');
const yapi = require('yapi.js');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTableOfContents = require("markdown-it-table-of-contents");
const defaultTheme = require("./defaultTheme.js");

let isMarkdown = false;
// const htmlToPdf = require("html-pdf");
class exportController extends baseController{
  constructor(ctx){
    super(ctx);
    this.interModel = yapi.getInst(interfaceModel);
    this.projectModel = yapi.getInst(projectModel);
  }

  async exportData(ctx){
    let pid = ctx.request.query.pid;
    let type = ctx.request.query.type;
    if(!pid){
      ctx.body = yapi.commons.resReturn(null, 200, "pid 不为空");
    }
    let curProject;
    let tp = "";
    try {
      curProject = await this.projectModel.get(pid);
      ctx.set("Content-Type", "application/octet-stream");
      
      switch(type){
        case "markdown": {
          isMarkdown = true;
          tp = await createMarkdown.bind(this)(pid,false);
          ctx.set("Content-Disposition",`attachment; filename=api.md`);
          return ctx.body = tp;
        }
        // case "pdf": {
        //   tp = await createPdf.bind(this)(pid,false);
        //   // ctx.set("Content-Disposition",'filename="api.pdf"');
        //   return ctx.body = tp;
        // }
        default: {//默认为html
          tp += await createHtml.bind(this)(pid);
          ctx.set("Content-Disposition",`attachment; filename=api.html`);
          return ctx.body = tp;
        }
  
      }
    } catch (error) {
      yapi.commons.log(error, 'error');
      ctx.body = yapi.commons.resReturn(null, 502, "下载出错");
    }

    // async function createPdf(){
    //   let md = await createMarkdown.bind(this)(pid);
    //   let markdown = new markdownIt();
    //   markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
    //   markdown.use(markdownItTableOfContents,{
    //     markerPattern: /^\[toc\]/im
    //   });
    //   let tp = defaultTheme + unescape(markdown.render(md));
    //   tp = createHtml5(tp);
      
    //   let htp = htmlToPdf.create(tp);

    //   let getPdfBuffer = ()=>{
    //     return new Promise((resolve, reject)=>{
    //       htp.toBuffer(function(err, buffer){
    //         if(err) reject(err);
    //         resolve(buffer)
    //       })
    //     })
    //   }
    //   let result = await getPdfBuffer();
    //   return result;
    // }

    async function createHtml(pid){
      let md = await createMarkdown.bind(this)(pid,true);
      let markdown = new markdownIt();
      markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents,{
        markerPattern: /^\[toc\]/im
      });
      
      let tp = defaultTheme + unescape(markdown.render(md));
      let left;

      let content = tp.replace(/<div\s+?class="table-of-contents"\s*>[\s\S]*?<\/ul>\s*<\/div>/gi, function(match){
        left = match;
        return '';
      });
      return  createHtml5(left, content);
    }

    function escapeStr(str){
      return !isMarkdown ? escape(str) : str;
    }

    function createHtml5(left, tp){
      //html5模板
      let html = `<!DOCTYPE html>
      <html>
      <head>
      <title>${curProject.name}</title>
      </head>
      <body>
      <a href="#/"><h1 class="header">YAPI 接口文档</h1></a>
      <div style="margin-top:75px">
      ${left}
      <div id="right" class="content-right">
      ${tp}
      </div>
      </div>
      </body>
      </html>
      `;
      return html;
    }
    function createBaseMessage(inter){
      // 基本信息
      let baseMessage = `### 基本信息\n\n**Path：** ${curProject.basepath + inter.path}\n\n**Method：** ${inter.method}\n\n**接口描述：**\n${inter.desc?escapeStr(inter.desc):""}\n`;
      return baseMessage;
    }
    function replaceBr(str){
      return str.replace("\n",escapeStr("<br/>"));
    }
    function createReqHeaders(req_headers){
      // Request-headers
      if(req_headers&&req_headers.length){
        let headersTable = `**Headers**\n\n`;
        headersTable += `| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
        for(let j = 0;j<req_headers.length;j++){
          headersTable += `| ${replaceBr(req_headers[j].name||"")||""}  |  ${replaceBr(req_headers[j].value||"")||""} | ${req_headers[j].required?"是":"否"}  |  ${replaceBr(req_headers[j].example||"")||""} |  ${replaceBr(req_headers[j].desc||"")||""} |\n`;
        }
        return headersTable;
      }
      return "";
    }

    function createPathParams(req_params){
      if(req_params&&req_params.length){
        let paramsTable = `**路径参数**\n`;
        paramsTable += `| 参数名称 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
        for(let j = 0;j<req_params.length;j++){
          paramsTable += `| ${replaceBr(req_params[j].name||"") || ""} |  ${replaceBr(req_params[j].example||"") || ""} |  ${replaceBr(req_params[j].desc||"")||""} |\n`;
        }
        return paramsTable;
      }
      return "";
    }

    function createReqQuery(req_query){
      if(req_query&&req_query.length){
        let headersTable = `**Query**\n\n`;
        headersTable += `| 参数名称  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ |\n`;
        for(let j = 0;j<req_query.length;j++){
          headersTable += `| ${replaceBr(req_query[j].name||"") || ""} | ${req_query[j].required?"是":"否"}  |  ${replaceBr(req_query[j].example||"") || ""} |  ${replaceBr(req_query[j].desc||"")||""} |\n`;
        }
        return headersTable;
      }
      return "";
    }

    function createReqBody(req_body_type,req_body_form,req_body_other){
      if(req_body_type === "form" && req_body_form.length){
        let bodyTable = `**Body**\n\n`
        bodyTable += `| 参数名称  | 参数类型  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;        let req_body = req_body_form;
        for(let j = 0;j<req_body.length;j++){
          bodyTable += `| ${replaceBr(req_body[j].name||"") || ""} | ${req_body[j].type || ""}  |  ${req_body[j].required?"是":"否"} |  ${replaceBr(req_body[j].example||"")||""}  |  ${replaceBr(req_body[j].desc||"")||""} |\n`;
        }
        return `${bodyTable}\n\n`;
      }else if(req_body_other){//other
        return `**Body**\n\n`+"```javascript"+`\n${req_body_other || ""}`+"\n```";
      }
      return "";
    }

    function createResponse(res_body){
      let resTitle = `\n### Reponse\n\n`;
      if(res_body){
        let resBody =  "```javascript"+`\n${res_body || ""}\n`+"```";
        return resTitle + resBody;
        }
        return "";
    }
    async function createMarkdown(pid,isToc){//拼接markdown
    //模板
    let mdTemplate = ``;
    const toc = `[TOC]\n\n`;
    try{
      const interList = await this.interModel.listByPid(pid);
      // 项目名、项目描述
      let title = escapeStr('<h1>' + curProject.name + '</h1>');
      mdTemplate += `\n ${title} \n ${curProject.desc||""}\n${escapeStr("<br>")}\n`
      for(let i = 0;i<interList.length;i++){//循环拼接 接口
        // 接口名称
        mdTemplate += `\n## ${escapeStr(`${interList[i].title}\n<a id=${interList[i].title}> </a>`)}\n`;
        isToc && (mdTemplate += toc)
        // 基本信息
        mdTemplate += createBaseMessage(interList[i]);
        // Request
        mdTemplate +=  `### Request\n`;
        // Request-headers
        mdTemplate += createReqHeaders(interList[i].req_headers);
        // Request-params
        mdTemplate += createPathParams(interList[i].req_params);
        // Request-query
        mdTemplate += createReqQuery(interList[i].req_query);
        // Request-body
        mdTemplate += createReqBody(interList[i].req_body_type,interList[i].req_body_form,interList[i].req_body_other);
        // Response
        // Response-body
        mdTemplate += createResponse(interList[i].res_body);
      }
      return mdTemplate;
    }catch(e){
      yapi.commons.log(e, 'error');
      ctx.body = yapi.commons.resReturn(null, 502, "下载出错");
    }
    }

  }
}

module.exports = exportController;