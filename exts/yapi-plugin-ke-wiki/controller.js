const AdmZip = require('adm-zip')
const md = require('markdown-it')({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-',
})
const gitParse = require('gitbook-parsers')

const baseController = require('controllers/base.js')
const wikiModel = require('./wikiModel.js')
const projectModel = require('models/project.js')
const userModel = require('models/user.js')
const jsondiffpatch = require('jsondiffpatch')
const formattersHtml = jsondiffpatch.formatters.html
const yapi = require('yapi.js')
const fs = require('fs-extra')
const path = require('path')
const showDiffMsg = require('../../common/diff-view.js')

const Puppeteer = require('puppeteer')

var mdParser = gitParse.get('.md')

class wikiController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.Model = yapi.getInst(wikiModel)
    this.projectModel = yapi.getInst(projectModel)
    this.userModel = yapi.getInst(userModel)
  }

  /**
   * 通过 wiki id 获取 wiki detail
   * @interface wiki_action/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getDetail(ctx) {
    try {
      let id = ctx.request.query.id
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '参数 id 不能为空',
        ))
      }
      let result = await this.Model.getById(id)
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 490, '该内容不存在'))
      }
      let { ancestors = '' } = result
      let ancestorData = []
      ancestors = ancestors.split(',')
      for (let id of ancestors) {
        if (id) {
          let data = await this.Model.getById(id)
          ancestorData.push({
            id,
            title: data.title,
          })
        }
      }
      ancestorData.push({
        title: result.title,
      })

      return (ctx.body = yapi.commons.resReturn({
        ...result.toObject(),
        ancestorData,
      }))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   *
   * 更新同级 wiki 的排序
   * @interface wiki_action/up_index
   * @param {Array}
   * @memberof wikiController
   *
   */
  async updateIndex(ctx) {
    try {
      let params = ctx.request.body
      if (!params || !Array.isArray(params)) {
        ctx.body = yapi.commons.resReturn(null, 400, '请求参数必须是数组')
      }
      params.forEach(item => {
        if (item.id) {
          this.Model.upIndex(item.id, item.index).then(
            res => {},
            err => {
              yapi.commons.log(err.message, 'error')
            },
          )
        }
      })
      return (ctx.body = yapi.commons.resReturn('成功！'))
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message)
    }
  }

  /**
   *获取子节点
   *
   * @param {*} parentId
   * @memberof wikiController
   */
  async getDescendants(parentId) {
    let list = []
    let children = await this.Model.listByParentId(parentId)
    for (let i = 0; i < children.length; i++) {
      let item = children[i].toObject()
      let descendants = await this.getDescendants(item['_id'])
      item['list'] = descendants
      list.push(item)
    }
    return list
  }

  /**
   * 获取 wiki menu
   * @param {*} ctx
   */
  async getPageList(ctx) {
    try {
      let project_id = ctx.request.query.project_id
      if (!project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'))
      }
      let result = await this.Model.getListByProjectid(project_id)
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].toObject()
        result[i]['list'] = await this.getDescendants(result[i]['_id'])
      }
      return (ctx.body = yapi.commons.resReturn(result))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  async getPageAllList(ctx) {
    try {
      let project_id = ctx.request.query.project_id
      if (!project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'))
      }
      let result = await this.Model.getAllListByProjectid(project_id)
      return (ctx.body = yapi.commons.resReturn(result))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   * wiki 保存接口
   * @method post
   * @param {*} ctx
   * @memberof wikiController
   */
  async add(ctx) {
    try {
      let params = ctx.request.body
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        title: 'string',
        desc: 'string',
        markdown: 'string',
        parent_id: 'string',
      })

      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'))
      }
      if (!params.title) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          'wiki标题不能为空',
        ))
      }
      if (!this.$tokenAuth) {
        let auth = await this.checkAuth(params.project_id, 'project', 'edit')
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(
            null,
            400,
            '您在当前项目没有权限',
          ))
        }
      }

      let notice = params.email_notice
      delete params.email_notice
      const username = this.getUsername()
      const uid = this.getUid()

      let data = Object.assign(params, {
        username,
        uid,
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time(),
      })

      if (params.parent_id) {
        let parentData = await this.Model.getById(params.parent_id)
        params.ancestors = `${parentData.ancestors},${params.parent_id}`
      } else {
        params.parent_id = ''
        params.ancestors = ''
      }

      let res = await this.Model.save(data)
      ctx.body = yapi.commons.resReturn(res)

      let logData = {
        type: 'wiki',
        project_id: params.project_id,
        title: params.title,
        current: params.markdown,
        wiki_id: 'wiki_' + res._id,
      }
      let wikiUrl = `http://${ctx.request.host}/project/${params.project_id}/wiki/page/${res._id}`

      if (notice) {
        let annotatedCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/annotated.css',
          ),
          'utf8',
        )
        let htmlCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/html.css',
          ),
          'utf8',
        )
        let project = await this.projectModel.getBaseInfo(params.project_id)

        yapi.commons.sendNotice(params.project_id, {
          title: `${username} 更新了项目 ${params.title} 页`,
          user: `${username}`,
          content: `<html>
          <head>
          <meta charset="utf-8" />
          <style>
          ${annotatedCss}
          ${htmlCss}
          </style>
          </head>
          <body>
          <div><h3>${username}更新了 ${params.title} 页</h3>
          <p>修改用户: ${username}</p>
          <p>修改项目: <a href="${wikiUrl}">${project.name}-${params.title}</a></p>
          </body>
          </html>`,
        })
      }

      // 保存修改日志信息
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${uid}">${username}</a> 新增 wiki 页面 <a href="${wikiUrl}"> ${params.title} </a>`,
        type: 'project',
        uid,
        username: username,
        typeid: params.project_id,
        data: logData,
      })
      return 1
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   * wiki 信息更新
   * @interface wiki_action/update
   * @method post
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async update(ctx) {
    try {
      let params = ctx.request.body
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        title: 'string',
        desc: 'string',
        markdown: 'string',
        id: 'string',
        parent_id: 'string',
      })
      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '项目 id 不能为空',
        ))
      }
      if (!params.id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          'wiki id 不能为空',
        ))
      }
      if (!this.$tokenAuth) {
        let auth = await this.checkAuth(params.project_id, 'project', 'edit')
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(
            null,
            400,
            '您在当前项目没有权限',
          ))
        }
      }

      let notice = params.email_notice
      delete params.email_notice
      const username = this.getUsername()
      const uid = this.getUid()

      let result = await this.Model.getById(params.id)

      if (
        params.parent_id !== undefined &&
        result.parent_id !== params.parent_id
      ) {
        if (params.parent_id) {
          let parentData = await this.Model.getById(params.parent_id)
          params.ancestors = `${parentData.ancestors},${params.parent_id}`
        } else {
          params.parent_id = ''
          params.ancestors = ''
        }
        // 父节点父级关系更新，需要更改子孙节点的 catid、ancestors 数据
        let descendants = await this.Model.listByAncestor(params.id)
        descendants.forEach(item => {
          let newAncestors = `${params.ancestors},${params.id}`
          let oldAncestors = `${result.ancestors},${result._id}`
          let upParams = {
            ancestors: item.ancestors.replace(oldAncestors, newAncestors),
          }
          this.Model.up(item._id, upParams).then(
            res => {},
            err => {
              yapi.commons.log(err.message, 'error')
            },
          )
        })
      }

      let data = Object.assign(params, {
        username,
        uid,
        up_time: yapi.commons.time(),
      })
      let upRes = await this.Model.up(result._id, data)
      ctx.body = yapi.commons.resReturn(upRes)

      let logData = {
        type: 'wiki',
        project_id: params.project_id,
        title: params.title,
        current: params.markdown,
        old: result ? result.toObject().markdown : '',
        wiki_id: 'wiki_' + params.id,
      }
      let wikiUrl = `http://${ctx.request.host}/project/${params.project_id}/wiki/page/${params.id}`

      if (notice) {
        let diffView = showDiffMsg(jsondiffpatch, formattersHtml, logData)
        let annotatedCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/annotated.css',
          ),
          'utf8',
        )
        let htmlCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/html.css',
          ),
          'utf8',
        )
        let project = await this.projectModel.getBaseInfo(params.project_id)
        yapi.commons.sendNotice(params.project_id, {
          title: `${username} 更新了 wiki ${params.title}`,
          user: `${username}`,
          content: `<html>
          <head>
          <meta charset="utf-8" />
          <style>
          ${annotatedCss}
          ${htmlCss}
          </style>
          </head>
          <body>
          <div><h3>${username}更新了 ${params.title}页</h3>
          <p>修改用户: ${username}</p>
          <p>修改项目: <a href="${wikiUrl}">${project.name}-${
            params.title
          }</a></p>
          <p>详细改动日志: ${this.diffHTML(diffView)}</p></div>
          </body>
          </html>`,
        })
      }

      // 保存修改日志信息
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${uid}">${username}</a> 更新了 <a href="${wikiUrl}"> ${params.title}</a> 的信息`,
        type: 'project',
        uid,
        username: username,
        typeid: params.project_id,
        data: logData,
      })
      return 1
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  /**
   * 删除wiki页面
   * @interface wiki_action/remove
   * @method post
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async remove(ctx) {
    try {
      let params = ctx.request.body
      params = yapi.commons.handleParams(params, {
        //  email_notice 不需要转换
        id: 'string',
      })
      const { id, email_notice } = params
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '文档 id 不能为空',
        ))
      }
      let data = await this.Model.getById(id)
      // 如果当前数据库里面没有数据
      if (data === null) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '页面不存在'))
      }

      if (data.uid != this.getUid()) {
        let auth = await this.checkAuth(data.project_id, 'project', 'danger')
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'))
        }
      }

      let needSendNotice = email_notice
      delete params.email_notice
      const username = this.getUsername()
      const uid = this.getUid()
      await this.Model.delById(id)
      await this.Model.delByAncestor(id)
      let logData = {
        type: 'wiki',
        project_id: data.project_id,
        title: data.title,
        current: ' ', // current数据不能完全为空, 否则系统会直接略过比较代码
        old: data ? data.markdown : '',
      }

      if (needSendNotice) {
        let diffView = showDiffMsg(jsondiffpatch, formattersHtml, logData)

        let annotatedCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/annotated.css',
          ),
          'utf8',
        )
        let htmlCss = fs.readFileSync(
          path.resolve(
            yapi.WEBROOT,
            'node_modules/jsondiffpatch/dist/formatters-styles/html.css',
          ),
          'utf8',
        )
        let project = await this.projectModel.getBaseInfo(data.project_id)

        yapi.commons.sendNotice(data.project_id, {
          title: `${username} 删除了项目 ${data.title}页`,
          user: `${username}`,
          content: `<html>
          <head>
          <meta charset="utf-8" />
          <style>
          ${annotatedCss}
          ${htmlCss}
          </style>
          </head>
          <body>
          <div><h3>${username}删除了 ${data.title} 页</h3>
          <p>修改用户: ${username}</p>
          <p>修改项目: <a>${project.name}-${data.title}</a></p>
          <p>详细改动日志: ${this.diffHTML(diffView)}</p></div>
          </body>
          </html>`,
        })
      }

      // 保存修改日志信息
      yapi.commons.saveLog({
        content: `<a>${username}</a> 删除了 <a> ${data.title} </a> 页面`,
        type: 'project',
        uid,
        username: username,
        typeid: data.project_id,
        data: logData,
      })
      return (ctx.body = yapi.commons.resReturn('success'))
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message)
    }
  }

  diffHTML(html) {
    if (html.length === 0) {
      return `<span style="color: #555">没有改动，该操作未改动wiki数据</span>`
    }

    return html.map(item => {
      return `<div>
      <h4 class="title">${item.title}</h4>
      <div>${item.content}</div>
    </div>`
    })
  }

  // 处理编辑冲突
  async wikiConflict(ctx) {
    try {
      let id = parseInt(ctx.query.id, 10)
      let data
      if (!id) {
        return ctx.websocket.send('缺失 id 信息')
      }
      let wikiData = await this.Model.getById(id)
      if (wikiData.edit_uid !== 0 && wikiData.edit_uid !== this.getUid()) {
        let editUser = await this.userModel.findById(wikiData.edit_uid)
        data = {
          errno: 1,
          data: {
            uid: editUser.edit_uid,
            username: editUser.username,
          },
        }
      } else {
        this.Model.upEditUid(id, this.getUid()).then()
        data = {
          errno: 0,
          data: wikiData,
        }
      }
      ctx.websocket.send(JSON.stringify(data))

      ctx.websocket.on('close', () => {
        this.Model.upEditUid(id, 0).then()
      })
    } catch (err) {
      yapi.commons.log(err, 'error')
    }
  }

  /**
   * 生成 PDF
   */
  async convertToPdf(ctx) {
    let id = ctx.request.query.id
    if (!id) {
      return (ctx.body = yapi.commons.resReturn(null, 400, 'wiki id 不能为空'))
    }
    let docObj = await this.Model.getById(id)
    if (!docObj) {
      return (ctx.body = yapi.commons.resReturn(
        null,
        400,
        '未找到相关 doc 数据',
      ))
    }

    const browser = await Puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    const htmlData = `<!DOCTYPE html><html lang="zh-cmn-Hans"><head> <meta charset="UTF-8"> <style> html { padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif; font-size: 14px; color: #333333; line-height: 22px; } img { max-width: 80%; } h1, h2, h3, h4, h5, h6 { border: 0; color: #333333; } h1 { font-size: 22px; color: #2395f1; line-height: 22px; } h2 { font-size: 20px; line-height: 20px; } h3 { font-size: 18px; line-height: 18px; } h4, h5, h6 { font-size: 16px; line-height: 16px; } p { font-size: 14px; color: #333333; line-height: 22px; } table { width: 100%; border-collapse: collapse; border-spacing: 0; overflow: auto; margin: 10px 0; } table th, table td { padding: 6px 13px; border: 1px solid #d9d9d9; } table th { padding: 8px 13px; font-weight: 500; color: #333333; background: #f4f5f7; } table tr { border-top: 1px solid #ccc; } :not(pre)>code { color: #c7254e; background-color: #f9f2f4; border-radius: 4px; white-space: normal; padding: 2px 4px; font-size: .9em; } pre { margin: 2px 0 8px; padding: 18px; background-color: #f7f8f9; } blockquote { border-left: 6px solid rgba(30, 135, 240, 0.2); margin: auto 0; padding: 6px 12px; border-radius: 2px; box-sizing: border-box; background: rgba(30, 135, 240, 0.1); } </style></head><body>${docObj.desc}</body></html>`
    await page.setContent(htmlData)
    const capture = await page.pdf({
      format: 'A4',
      margin: {
        top: '30px',
        bottom: '30px',
        left: '20px',
        right: '20px',
      },
      printBackground: true,
    })
    await browser.close()
    ctx.set(
      'Content-disposition',
      'attachment; filename=' + encodeURI(docObj.title) + '.pdf',
    )
    ctx.body = capture
  }
  /**
   * 导入 Gitbook 压缩包
   * /api/plugin/wiki/import_gitbook
   * @param {*} ctx
   */
  async importGitbook(ctx) {
    try {
      const username = this.getUsername()
      const uid = this.getUid()
      let params = ctx.request.body
      const project_id = params.fields.pid

      if (!project_id) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '项目 id 不能为空',
        ))
      }

      if (!this.$tokenAuth) {
        let auth = await this.checkAuth(project_id, 'project', 'edit')
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(
            null,
            400,
            '您在当前项目没有权限',
          ))
        }
      }

      let fileMap = {}
      const ignoreList = ['._.DS_Store']
      const rootDir = params.files.file.name.split('.')[0]
      const SUMPATH = `${rootDir}/SUMMARY.md`

      // 解压文件，生成 map
      let zipFile = fs.readFileSync(params.files.file.path)
      var zipEntries = new AdmZip(zipFile).getEntries()
      zipEntries.forEach(zipEntry => {
        if (zipEntry.isDirectory || ignoreList.indexOf(zipEntry.name) !== -1) {
          return
        }
        const fileName = zipEntry.entryName
        const fileData = zipEntry.getData()
        fileMap[fileName] = {
          name: zipEntry.name,
          data: fileData,
        }
      })

      if (!fileMap[SUMPATH]) {
        return (ctx.body = yapi.commons.resReturn(
          null,
          400,
          '未解析到 Gitbook 数据',
        ))
      }

      // 获取 summary 文件
      let summaryData = fileMap[SUMPATH].data.toString('utf8')

      // 递归解析 summary 文件
      const recurseTraverse = async (list, parent_id = '', ancestors = '') => {
        for (let item of list) {
          let data = {
            project_id,
            parent_id,
            ancestors,
            title: item.title,
            username,
            uid,
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time(),
          }
          let fileName = `${rootDir}/${item.path}`
          if (!item.path || !fileMap[fileName]) {
            // 当前文档 summary 写了链接，但无文档，注册空文档
            data = {
              ...data,
              desc: '',
              markdown: '',
            }
          } else {
            let mdData = fileMap[filePath].data.toString('utf8')
            var renderResult = md.render(mdData)
            data = {
              ...data,
              desc: renderResult,
              markdown: mdData,
            }
          }
          // 保存 wiki
          let res = await this.Model.save(data)
          // 保存修改日志信息
          let logData = {
            type: 'wiki',
            project_id: res.project_id,
            title: res.title,
            current: res.markdown,
            wiki_id: 'wiki_' + res._id,
          }
          let wikiUrl = `http://${ctx.request.host}/project/${res.project_id}/wiki/page/${res._id}`
          yapi.commons.saveLog({
            content: `<a href="/user/profile/${uid}">${username}</a> 新增 wiki 页面 <a href="${wikiUrl}"> ${res.title} </a>`,
            type: 'project',
            uid,
            username: username,
            typeid: res.project_id,
            data: logData,
          })
          if (item.articles && item.articles.length) {
            let { _id, ancestor = '' } = res
            await recurseTraverse(item.articles, _id, `${ancestor},${_id}`)
          }
        }
        return
      }

      // 递归入口
      mdParser.summary(summaryData).then(async parseData => {
        let { chapters } = parseData
        // 如 summary 文件无数据，则返回
        if (!chapters) {
          return (ctx.body = yapi.commons.resReturn(
            null,
            400,
            '未解析到 Gitbook 数据',
          ))
        }
        await recurseTraverse(chapters)
      })

      return (ctx.body = yapi.commons.resReturn({ msg: '上传成功' }))
    } catch (err) {
      return (ctx.body = yapi.commons.resReturn(null, 400, err.message))
    }
  }
}

module.exports = wikiController
