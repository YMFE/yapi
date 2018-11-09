const baseController = require('controllers/base.js');
const wikiModel = require('./wikiModel.js');
const projectModel = require('models/project.js');
const userModel = require('models/user.js');
const jsondiffpatch = require('jsondiffpatch');
const formattersHtml = jsondiffpatch.formatters.html;
const yapi = require('yapi.js');
// const util = require('./util.js');
const fs = require('fs-extra');
const path = require('path');
const showDiffMsg = require('../../common/diff-view.js');
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
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }
      let result = await this.Model.get(project_id);
      return (ctx.body = yapi.commons.resReturn(result));
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
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }
      if (!this.$tokenAuth) {
        let auth = await this.checkAuth(params.project_id, 'project', 'edit');
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
        }
      }

      let notice = params.email_notice;
      delete params.email_notice;
      const username = this.getUsername();
      const uid = this.getUid();

      // 如果当前数据库里面没有数据
      let result = await this.Model.get(params.project_id);
      if (!result) {
        let data = Object.assign(params, {
          username,
          uid,
          add_time: yapi.commons.time(),
          up_time: yapi.commons.time()
        });

        let res = await this.Model.save(data);
        ctx.body = yapi.commons.resReturn(res);
      } else {
        let data = Object.assign(params, {
          username,
          uid,
          up_time: yapi.commons.time()
        });
        let upRes = await this.Model.up(result._id, data);
        ctx.body = yapi.commons.resReturn(upRes);
      }

      let logData = {
        type: 'wiki',
        project_id: params.project_id,
        current: params.desc,
        old: result ? result.toObject().desc : ''
      };
      let wikiUrl = `${ctx.request.origin}/project/${params.project_id}/wiki`;

      if (notice) {
        let diffView = showDiffMsg(jsondiffpatch, formattersHtml, logData);

        let annotatedCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/annotated.css'
          ),
          'utf8'
        );
        let htmlCss = fs.readFileSync(
          path.resolve(yapi.WEBROOT, 'node_modules/jsondiffpatch/dist/formatters-styles/html.css'),
          'utf8'
        );
        let project = await this.projectModel.getBaseInfo(params.project_id);

        yapi.commons.sendNotice(params.project_id, {
          title: `${username} 更新了wiki说明`,
          content: `<html>
          <head>
          <meta charset="utf-8" />
          <style>
          ${annotatedCss}
          ${htmlCss}
          </style>
          </head>
          <body>
          <div><h3>${username}更新了wiki说明</h3>
          <p>修改用户: ${username}</p>
          <p>修改项目: <a href="${wikiUrl}">${project.name}</a></p>
          <p>详细改动日志: ${this.diffHTML(diffView)}</p></div>
          </body>
          </html>`
        });
      }

      // 保存修改日志信息
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${uid}">${username}</a> 更新了 <a href="${wikiUrl}">wiki</a> 的信息`,
        type: 'project',
        uid,
        username: username,
        typeid: params.project_id,
        data: logData
      });
      return 1;
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }
  diffHTML(html) {
    if (html.length === 0) {
      return `<span style="color: #555">没有改动，该操作未改动wiki数据</span>`;
    }

    return html.map(item => {
      return `<div>
      <h4 class="title">${item.title}</h4>
      <div>${item.content}</div>
    </div>`;
    });
  }

  // 处理编辑冲突
  async wikiConflict(ctx) {
    try {
      let result;
      ctx.websocket.on('message', async message => {
        let id = parseInt(ctx.query.id, 10);
        if (!id) {
          return ctx.websocket.send('id 参数有误');
        }
        result = await this.Model.get(id);
        let data = await this.websocketMsgMap(message, result);
        if (data) {
          ctx.websocket.send(JSON.stringify(data));
        }
      });
      ctx.websocket.on('close', async () => {});
    } catch (err) {
      yapi.commons.log(err, 'error');
    }
  }

  websocketMsgMap(msg, result) {
    const map = {
      start: this.startFunc.bind(this),
      end: this.endFunc.bind(this),
      editor: this.editorFunc.bind(this)
    };

    return map[msg](result);
  }

  // socket 开始链接
  async startFunc(result) {
    if (result && result.edit_uid === this.getUid()) {
      await this.Model.upEditUid(result._id, 0);
    }
  }

  // socket 结束链接
  async endFunc(result) {
    if (result) {
      await this.Model.upEditUid(result._id, 0);
    }
  }

  // 正在编辑
  async editorFunc(result) {
    let userInst, userinfo, data;
    if (result && result.edit_uid !== 0 && result.edit_uid !== this.getUid()) {
      userInst = yapi.getInst(userModel);
      userinfo = await userInst.findById(result.edit_uid);
      data = {
        errno: result.edit_uid,
        data: { uid: result.edit_uid, username: userinfo.username }
      };
    } else {
      if (result) {
        await this.Model.upEditUid(result._id, this.getUid());
      }
      data = {
        errno: 0,
        data: result
      };
    }
    return data;
  }
}

module.exports = wikiController;
