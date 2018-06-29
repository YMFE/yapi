
const baseController = require('controllers/base.js');
const wikiModel = require('./wikiModel.js');
const projectModel = require('models/project.js');
const jsondiffpatch = require('jsondiffpatch');
const formattersHtml = jsondiffpatch.formatters.html;
const yapi = require('yapi.js');
const util = require('./util.js');
const fs = require('fs-extra')
const path = require('path');

class wikiController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(wikiModel);
    this.projectModel = yapi.getInst(projectModel);
    
  }

  /**
   * 获取wiki信息
   * @interface wiki_desc/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getWikiDesc(ctx) {
    try {
      let project_id = ctx.request.query.project_id;
      if (!project_id) {
        return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
      }
      let result = await this.Model.get(project_id)
      return ctx.body = yapi.commons.resReturn(result);
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }

  /**
   * 保存wiki信息
   * @interface wiki_desc/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */

  async uplodaWikiDesc(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        desc: 'string',
        markdown: 'string'
      });
    
      if (!params.project_id) {
        return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
      }
      if(!this.$tokenAuth){
        let auth = await this.checkAuth(params.project_id, 'project', 'edit')
        if (!auth) {
          return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
        }
      }

      let notice = params.email_notice;
      delete params.email_notice;

      // 如果当前数据库里面没有数据
      let result = await this.Model.get(params.project_id)
      if(!result) {
        let data = Object.assign(params, {
          username: this.getUsername(),
          add_time: yapi.commons.time(),
          up_time: yapi.commons.time()
        });

        let res = await this.Model.save(data);
        return ctx.body = yapi.commons.resReturn(res);
      }

      // console.log('result', result);
      let data = Object.assign(params, {
        username: this.getUsername(),
        up_time: yapi.commons.time()
      });
      let upRes = await this.Model.up(result._id, data);
      ctx.body = yapi.commons.resReturn(upRes)

      if(notice) {
        let logData = {
          project_id: params.project_id,
          current: params.desc,
          old: result ? result.toObject().desc : ''
        }
       let diffView = util.showDiffMsg(jsondiffpatch, formattersHtml, logData);
       
       let annotatedCss = fs.readFileSync(path.resolve(yapi.WEBROOT, 'node_modules/jsondiffpatch/public/formatters-styles/annotated.css'), 'utf8');
        let htmlCss = fs.readFileSync(path.resolve(yapi.WEBROOT, 'node_modules/jsondiffpatch/public/formatters-styles/html.css'), 'utf8');
        let project = await this.projectModel.getBaseInfo(params.project_id);
        let wikiUrl = `http://${ctx.request.host}/project/${params.project_id}/wiki`
        yapi.commons.sendNotice(params.project_id, {
          title: `${this.getUsername()} 更新了wiki说明`,
          content: `<html>
          <head>
          <style>
          ${annotatedCss}
          ${htmlCss}
          </style>
          </head>
          <body>
          <div><h3>${this.getUsername()}更新了wiki</h3>
          <p>修改用户: ${this.getUsername()}</p>
          <p>修改项目: <a href="${wikiUrl}">${project.name}</a></p>
          <p>详细改动日志: ${this.diffHTML(diffView)}</p></div>
          </body>
          </html>`
        })
      }
      // let upRes = await this.Model.get(result._id)
      return 1;
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }

  }
  diffHTML(html) {
    if (html.length === 0) {
      return `<span style="color: #555">没有改动，该操作未改动wiki数据</span>`
    }

    return html.map(item => {
      return (`<div>
      <h4 class="title">${item.title}</h4>
      <div>${item.content}</div>
    </div>`)
    })
  }
 
}

module.exports = wikiController;
