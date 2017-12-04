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
class exportController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.interModel = yapi.getInst(interfaceModel);
    this.projectModel = yapi.getInst(projectModel);
  }

  async exportData(ctx) {
    let pid = ctx.request.query.pid;
    let type = ctx.request.query.type;
    if (!pid) {
      ctx.body = yapi.commons.resReturn(null, 200, "pid 不为空");
    }
    let curProject;
    let tp = "";
    try {
      curProject = await this.projectModel.get(pid);
      ctx.set("Content-Type", "application/octet-stream");

      switch (type) {
        case "markdown": {
          isMarkdown = true;
          tp = await createMarkdown.bind(this)(pid, false);
          ctx.set("Content-Disposition", `attachment; filename=api.md`);
          return ctx.body = tp;
        }
        // case "pdf": {
        //   tp = await createPdf.bind(this)(pid,false);
        //   // ctx.set("Content-Disposition",'filename="api.pdf"');
        //   return ctx.body = tp;
        // }
        default: {//默认为html
          tp = await createHtml.bind(this)(pid);
          ctx.set("Content-Disposition", `attachment; filename=api.html`);
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

    async function createHtml(pid) {
      let md = await createMarkdown.bind(this)(pid, true);
      let markdown = new markdownIt();
      markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents, {
        markerPattern: /^\[toc\]/im
      });

      let tp = unescape(markdown.render(md));
      let left;

      let content = tp.replace(/<div\s+?class="table-of-contents"\s*>[\s\S]*?<\/ul>\s*<\/div>/gi, function (match) {
        left = match;
        return '';
      });
      return createHtml5(left, content);
    }


    function escapeStr(str) {
      return !isMarkdown ? escape(str) : str;
    }

    function createHtml5(left, tp) {
      //html5模板
      let html = `<!DOCTYPE html>
      <html>
      <head>
      <title>${curProject.name}</title>
      <meta charset="utf-8" />
      ${defaultTheme}
      </head>
      <body>
        <div class="m-header">
          <a href="#" style="display: inherit;"><svg class="svg" width="32px" height="32px" viewBox="0 0 64 64" version="1.1"><title>Icon</title><desc>Created with Sketch.</desc><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1"><stop stop-color="#FFFFFF" offset="0%"></stop><stop stop-color="#F2F2F2" offset="100%"></stop></linearGradient><circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle><filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="大屏幕"><g id="Icon"><circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle><path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fill-rule="nonzero"></path><path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fill-rule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path><path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fill-rule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path><g id="inner-round"><use fill="black" fill-opacity="1" filter="url(#filter-3)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use><use fill="#F7F7F7" fill-rule="evenodd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use></g></g></g></g></svg></a>
          <a href="#"><h1 class="title">YAPI 接口文档</h1></a>
          <div class="nav">
            <a href="http://yapi.qunar.com/">YApi</a>
          </div>
        </div>
        <div class="g-doc">
          ${left}
          <div id="right" class="content-right">
          ${tp}
            <footer class="m-footer">
              <p>Build by <a href="https://ymfe.org/">YMFE</a>.</p>
            </footer>
          </div>
        </div>
      </body>
      </html>
      `;
      return html;
    }
    function createBaseMessage(inter) {
      // 基本信息
      let baseMessage = `### 基本信息\n\n**Path：** ${curProject.basepath + inter.path}\n\n**Method：** ${inter.method}\n\n**接口描述：**\n${inter.desc ? escapeStr(inter.desc) : ""}\n`;
      return baseMessage;
    }
    function replaceBr(str) {
      return str.replace("\n", escapeStr("<br/>"));
    }
    function createReqHeaders(req_headers) {
      // Request-headers
      if (req_headers && req_headers.length) {
        let headersTable = `**Headers**\n\n`;
        headersTable += `| 参数名称  | 参数值  |  是否必须 | 示例  | 备注  |\n| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
        for (let j = 0; j < req_headers.length; j++) {
          headersTable += `| ${replaceBr(req_headers[j].name || "") || ""}  |  ${replaceBr(req_headers[j].value || "") || ""} | ${req_headers[j].required == 1 ? "是" : "否"}  |  ${replaceBr(req_headers[j].example || "") || ""} |  ${replaceBr(req_headers[j].desc || "") || ""} |\n`;
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
          paramsTable += `| ${replaceBr(req_params[j].name || "") || ""} |  ${replaceBr(req_params[j].example || "") || ""} |  ${replaceBr(req_params[j].desc || "") || ""} |\n`;
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
          headersTable += `| ${replaceBr(req_query[j].name || "") || ""} | ${req_query[j].required == 1 ? "是" : "否"}  |  ${replaceBr(req_query[j].example || "") || ""} |  ${replaceBr(req_query[j].desc || "") || ""} |\n`;
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
          bodyTable += `| ${replaceBr(req_body[j].name || "") || ""} | ${req_body[j].type || ""}  |  ${req_body[j].required == 1 ? "是" : "否"} |  ${replaceBr(req_body[j].example || "") || ""}  |  ${replaceBr(req_body[j].desc || "") || ""} |\n`;
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
    async function createMarkdown(pid, isToc) {//拼接markdown
      //模板
      let mdTemplate = ``;
      const toc = `[TOC]\n\n`;
      try {
        const interList = await this.interModel.listByPid(pid);
        // 项目名、项目描述
        let title = escapeStr('<h1>' + curProject.name + '</h1>');
        mdTemplate += `\n ${title} \n ${curProject.desc || ""}\n${escapeStr("<br>")}\n`
        for (let i = 0; i < interList.length; i++) {//循环拼接 接口
          // 接口名称
          mdTemplate += `\n## ${escapeStr(`${interList[i].title}\n<a id=${interList[i].title}> </a>`)}\n`;
          isToc && (mdTemplate += toc)
          // 基本信息
          mdTemplate += createBaseMessage(interList[i]);
          // Request
          mdTemplate += `\n### Request\n`;
          // Request-headers
          mdTemplate += createReqHeaders(interList[i].req_headers);
          // Request-params
          mdTemplate += createPathParams(interList[i].req_params);
          // Request-query
          mdTemplate += createReqQuery(interList[i].req_query);
          // Request-body
          mdTemplate += createReqBody(interList[i].req_body_type, interList[i].req_body_form, interList[i].req_body_other);
          // Response
          // Response-body
          mdTemplate += createResponse(interList[i].res_body);
        }
        return mdTemplate;
      } catch (e) {
        yapi.commons.log(e, 'error');
        ctx.body = yapi.commons.resReturn(null, 502, "下载出错");
      }
    }

  }
}

module.exports = exportController;