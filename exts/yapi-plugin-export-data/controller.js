const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const projectModel = require('models/project.js');
const yapi = require('yapi.js');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTableOfContents = require("markdown-it-table-of-contents");
const defaultTheme = require("./defaultTheme.js");
const htmlToPdf = require("html-pdf");
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
          tp = await createMarkdown.bind(this)(pid,false);
          ctx.set("Content-Disposition",`attachment; filename=api.md`);
          return ctx.body = tp;
        }
        case "pdf": {
          tp = await createPdf.bind(this)(pid,false);
          ctx.set("Content-Disposition",'filename="api.pdf"');
          return ctx.body = tp;
        }
        default: {//默认为html
          tp += await createHtml.bind(this)(pid);
          ctx.set("Content-Disposition",`attachment; filename=api.html`);
          return ctx.body = tp;
        }
  
      }
    } catch (error) {
      console.log(error);
      ctx.body = yapi.commons.resReturn(null, 502, "下载出错");
    }

    async function createPdf(){
      let md = await createMarkdown.bind(this)(pid);
      let markdown = new markdownIt();
      markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents,{
        markerPattern: /^\[toc\]/im
      });
      let tp = defaultTheme + unescape(markdown.render(md));
      tp = createHtml5(tp);
      
      let htp = htmlToPdf.create(tp);

      let getPdfBuffer = ()=>{
        return new Promise((resolve, reject)=>{
          htp.toBuffer(function(err, buffer){
            if(err) reject(err);
            resolve(buffer)
          })
        })
      }
      let result = await getPdfBuffer();
      return result;
    }

    async function createHtml(pid){
      let md = await createMarkdown.bind(this)(pid,true);
      let markdown = new markdownIt();
      markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents,{
        markerPattern: /^\[toc\]/im
      });
      let tp = defaultTheme + unescape(markdown.render(md));
      tp = createHtml5(tp);
      return tp;
    }

    function createHtml5(tp){
      //html5模板
      let html = `<!DOCTYPE html>
      <html>
      <head>
      <title>${curProject.name}</title>
      </head>
      <body>
      ${tp}
      </body>
      </html>
      `;
      return html;
    }
    function createBaseMessage(inter){
        // 基本信息
        let baseMessage = `### 基本信息\n\n**接口描述：**\n\n${inter.desc?escape(inter.desc):""}\n\n**接口名称：** ${inter.title}\n\n**接口路径：** ${curProject.basepath + inter.path}\n\n`;
      return baseMessage;
    }

    function createReqHeaders(req_headers){
      // Request-headers
      if(req_headers&&req_headers.length){
        let headersTable = `**Headers：**\n\n`;
        headersTable += `| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
        for(let j = 0;j<req_headers.length;j++){
          headersTable += `| ${escape(req_headers[j].name||"")||""}  |  ${escape(req_headers[j].value||"")||""} | ${req_headers[j].required?"是":"否"}  |  ${escape(req_headers[j].example||"")||""} |  ${escape(req_headers[j].desc||"")||""} |\n`;
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
          paramsTable += `| ${escape(req_params[j].name||"") || ""} |  ${escape(req_params[j].example||"") || ""} |  ${escape(req_params[j].desc||"")||""} |\n`;
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
          headersTable += `| ${escape(req_query[j].name||"") || ""} | ${req_query[j].required?"是":"否"}  |  ${escape(req_query[j].example||"") || ""} |  ${escape(req_query[j].desc||"")||""} |\n`;
        }
        return headersTable;
      }
      return "";
    }

    function createReqBody(req_body_type,req_body_form,req_body_other){
      if(req_body_type === "form" && req_body_form.length){
        let bodyTable = `**Body：**\n\n`
        bodyTable += `| 参数名称  | 参数类型  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;        let req_body = req_body_form;
        for(let j = 0;j<req_body.length;j++){
          bodyTable += `| ${escape(req_body[j].name||"") || ""} | ${req_body[j].type || ""}  |  ${req_body[j].required?"是":"否"} |  ${escape(req_body[j].example||"")||""}  |  ${escape(req_body[j].desc||"")||""} |\n`;
        }
        return `${bodyTable}\n\n`;
      }else if(req_body_other){//other
        return "```javascript"+`\n${req_body_other || ""}`+"\n```";
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
    const toc = `**目录 (Table of Contents)**\n\n[TOC]\n\n`;
    if(isToc){
      mdTemplate += toc;
    }
    try{
      const interList = await this.interModel.listByPid(pid);
      for(let i = 0;i<interList.length;i++){//循环拼接 接口
        // 接口名称
        mdTemplate += `\n## ${interList[i].title}\n`;
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
      ctx.body = yapi.commons.resReturn(null, 502, "下载出错");
    }
    }

  }
}

module.exports = exportController;