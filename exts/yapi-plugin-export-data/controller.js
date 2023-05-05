const baseController = require('controllers/base.js')
const interfaceModel = require('models/interface.js')
const projectModel = require('models/project.js')
const interfaceCatModel = require('models/interfaceCat.js')
const yapi = require('yapi.js')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItTableOfContents = require('markdown-it-table-of-contents')
const defaultTheme = require('./defaultTheme.js')
const md = require('../../common/markdown')
const _ = require('lodash')
const Puppeteer = require('puppeteer')

// const htmlToPdf = require("html-pdf");
class exportController extends baseController {
  constructor(ctx) {
    super(ctx)
    this.catModel = yapi.getInst(interfaceCatModel)
    this.interModel = yapi.getInst(interfaceModel)
    this.projectModel = yapi.getInst(projectModel)
  }

  async handleListClass(pid, status, partList) {
    let newResult = []
    let result = await this.catModel.list(pid)
    for (let i = 0; i < result.length; i++) {
      let item = result[i].toObject()
      if (status === 'part') {
        let apiList = []
        for (let j = 0; j < partList.length; j++) {
          let apiItem = partList[j]
          const info = apiItem.split('api_')[1]
          const catid = info && info.split('-')[0]
          const _id = info && info.split('-')[1]
          if (/api_/.test(apiItem) && item._id === Number(catid)) {
            let list = await this.interModel.listByInterStatus(catid, status)
            list = _.remove(list, function(v) {
              return v._id === Number(_id)
            })
            if (list.length > 0) {
              apiList = apiList.concat(list)
            }
          }
        }
        if (apiList.length > 0) {
          item.list = apiList
          newResult.push(item)
        }
      } else {
        let list = await this.interModel.listByInterStatus(item._id, status)
        list = _.remove(list, function(v) {
          return v.record_type === 0
        })
        list = list.sort((a, b) => {
          return a.index - b.index
        })
        if (list.length > 0) {
          item.list = list
          newResult.push(item)
        }
      }
    }
    return newResult
  }

  /**
   * 依层级获取子节点
   *  注： filter 仅用于筛选 interface & dir
   * @param {*} parentId
   * @returns
   * @memberof interfaceController
   */
  async getDescendants(parentId) {
    let list = []
    let children
    children = await this.interModel.list(
      {
        parent_id: parentId,
        record_type: {
          $in: [0, 2],
        },
      },
      '-uid',
    )
    for (let i = 0; i < children.length; i++) {
      let item = children[i].toObject()
      if (item['record_type'] === 2) {
        let descendants = await this.getDescendants(item['_id'])
        item['list'] = descendants
      }
      list.push(item)
    }
    return list
  }

  async getPartDescendants(parentId, apiIdList) {
    let list = []
    let children
    children = await this.interModel.list(
      {
        parent_id: parentId,
        record_type: {
          $in: [0, 2],
        },
      },
      '-uid',
    )
    for (let i = 0; i < children.length; i++) {
      let item = children[i].toObject()
      if (apiIdList.includes(item['_id'])) {
        if (item['record_type'] === 2) {
          let descendants = await this.getPartDescendants(
            item['_id'],
            apiIdList,
          )
          item['list'] = descendants
        }
        list.push(item)
      }
    }
    return list
  }

  async getProjectTree(pid, status, partList) {
    let catList = await this.catModel.list(pid)
    let jsonList = []
    if (status === 'part') {
      const infoList = []
      const catIdList = []
      const apiIdList = []
      partList &&
        partList.length > 0 &&
        partList.map(item => {
          if (/api_/.test(item)) {
            infoList.push(item && item.split('api_')[1])
          }
          if (/cat_/.test(item)) {
            catIdList.push(item && Number(item.split('cat_')[1]))
          }
          if (/dir_/.test(item)) {
            infoList.push(item && item.split('dir_')[1])
          }
          return item
        })
      infoList &&
        infoList.length > 0 &&
        infoList.map(item => {
          catIdList.push(item && Number(item.split('-')[0]))
          apiIdList.push(item && Number(item.split('-')[1]))
          return item
        })
      let setCatIdList = Array.from(new Set(catIdList))
      for (let item of catList) {
        item = item.toObject()
        if (setCatIdList.includes(item._id)) {
          let dirList = await this.interModel.list(
            {
              catid: item._id,
              parent_id: '',
              record_type: {
                $in: [0, 2],
              },
            },
            '-uid',
          )
          let dList = []
          for (let j = 0; j < dirList.length; j++) {
            let dirItem = dirList[j].toObject()
            if (apiIdList.includes(dirItem['_id'])) {
              if (dirItem['record_type'] === 2) {
                const rList = await this.getPartDescendants(
                  dirItem['_id'],
                  apiIdList,
                )
                dirItem['list'] = rList
              }
              dList = dList.concat(dirItem)
            }
          }
          item.list = dList
          jsonList.push(item)
        }
      }
      jsonList = this.dataPrune(jsonList)
    } else {
      for (let item of catList) {
        item = item.toObject()
        let list = await this.interModel.list(
          {
            catid: item._id,
            parent_id: '',
            record_type: {
              $in: [0, 2],
            },
          },
          '-uid',
        )
        for (let j = 0; j < list.length; j++) {
          list[j] = list[j].toObject()
          if (list[j]['record_type'] === 2) {
            list[j]['list'] = await this.getDescendants(list[j]['_id'])
          }
        }
        item.list = list
        jsonList.push(item)
      }
      jsonList = this.dataPrune(jsonList)
    }
    return jsonList
  }

  paramsPrune(list) {
    let newList = []
    for (let item of list) {
      delete item._id
      newList.push(item)
    }
    return newList
  }

  dataPrune(data) {
    let newData = []
    if (data && data.length > 0) {
      for (let item of data) {
        if (item.record_type === 2) {
          item = {
            title: item.title,
            desc: item.desc,
            _id: item._id,
            project_id: item.project_id,
            list: this.dataPrune(item.list),
          }
        } else if (item.record_type === 0) {
          // delete item._id;
          delete item.__v
          delete item.uid
          delete item.edit_uid
          delete item.catid
          // delete item.project_id;
          delete item.ancestors
          delete item.parent_id
          delete item.edit_uid
          delete item.add_time
          delete item.up_time
          delete item.record_type
          item.req_body_form = this.paramsPrune(item.req_body_form)
          item.req_params = this.paramsPrune(item.req_params)
          item.req_query = this.paramsPrune(item.req_query)
          item.req_headers = this.paramsPrune(item.req_headers)
          if (item.query_path && typeof item.query_path === 'object') {
            item.query_path.params = this.paramsPrune(item.query_path.params)
          }
        } else {
          item = {
            title: item.name,
            desc: item.desc,
            _id: item._id,
            project_id: item.project_id,
            list: this.dataPrune(item.list),
          }
        }
        newData.push(item)
      }
    }
    return newData
  }

  async exportData(ctx) {
    let pid = ctx.request.body.pid
    let type = ctx.request.body.type
    let status = ctx.request.body.status
    let isWiki = ctx.request.body.isWiki
    let partList = ctx.request.body.list
    if (!pid) {
      ctx.body = yapi.commons.resReturn(null, 200, 'pid 不为空')
    }
    let curProject, wikiData
    let tp = ''
    try {
      curProject = await this.projectModel.get(pid)
      if (isWiki === 'true') {
        const wikiModel = require('../yapi-plugin-ke-wiki/wikiModel.js')
        wikiData = await yapi.getInst(wikiModel).get(pid)
      }
      ctx.set('Content-Type', 'application/octet-stream')
      let list
      if (type === 'json') {
        list = await this.getProjectTree(pid, status, partList)
      } else {
        list = await this.handleListClass(pid, status, partList)
      }
      const fileName = curProject.name

      switch (type) {
        case 'markdown': {
          tp = await createMarkdown.bind(this)(list, false)
          // ctx.set('Content-Disposition', `attachment; filename=${fileName}.md`)
          return (ctx.body = {
            tp,
            fileName: `${fileName}.md`,
          })
        }
        case 'json': {
          tp = JSON.stringify(list, null, 2)
          // ctx.set(
          //   'Content-Disposition',
          //   `attachment; filename=${fileName}.json`,
          // )
          return (ctx.body = {
            tp,
            fileName: `${fileName}.json`,
          })
        }
        case 'pdf': {
          tp = await createPdfHtml.bind(this)(list)

          const browser = await Puppeteer.launch({
            headless: true,
            timeout: 10000,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          })
          const page = await browser.newPage()
          await page.emulateMedia('print')
          await page.setContent(tp)
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
          // ctx.set('Content-Disposition', `attachment; filename=${fileName}.pdf`)
          return (ctx.body = {
            tp: capture,
            fileName: `${fileName}.pdf`,
          })
        }
        default: {
          //默认为html
          tp = await createHtml.bind(this)(list)
          // ctx.set(
          //   'Content-Disposition',
          //   `attachment; filename=${fileName}.html`,
          // )
          return (ctx.body = {
            tp,
            fileName: `${fileName}.html`,
          })
        }
      }
    } catch (error) {
      yapi.commons.log(error, 'error')
      ctx.body = yapi.commons.resReturn(null, 502, '下载出错')
    }

    async function createHtml(list) {
      let md = await createMarkdown.bind(this)(list, true)
      let markdown = markdownIt({ html: true, breaks: true })
      markdown.use(markdownItAnchor) // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents, {
        markerPattern: /^\[toc\]/im,
      })

      // require('fs').writeFileSync('./a.markdown', md);
      let tp = unescape(markdown.render(md))
      // require('fs').writeFileSync('./a.html', tp);
      let left
      let content = tp.replace(
        /<div\s+?class="table-of-contents"\s*>[\s\S]*?<\/ul>\s*<\/div>/gi,
        function(match) {
          left = match
          return ''
        },
      )

      return createHtml5(left || '', content)
    }

    async function createPdfHtml(list) {
      let md = await createMarkdown.bind(this)(list, true)
      let markdown = markdownIt({ html: true, breaks: true })
      markdown.use(markdownItAnchor) // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents, {
        markerPattern: /^\[toc\]/im,
      })
      let tp = unescape(markdown.render(md))
      let content = tp.replace(
        /<div\s+?class="table-of-contents"\s*>[\s\S]*?<\/ul>\s*<\/div>/gi,
        function(match) {
          return ''
        },
      )

      return createHtml5('', content)
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
        <div class="m-header ${left !== '' ? 'html-mode' : ''}">
          <h1 class="title">${curProject.name}-项目接口文档</h1>
        </div>
        <div class="g-doc">
          ${left}
          <div id="right" class="content-right ${
            left !== '' ? 'html-mode' : ''
          }">
          ${tp}
            <footer class="m-footer">
              <p>Build by yapi.</p>
            </footer>
          </div>
        </div>
      </body>
      </html>
      `
      return html
    }

    function createMarkdown(list, isToc) {
      //拼接markdown
      //模板
      let mdTemplate = ``
      try {
        // 项目名称信息
        mdTemplate += md.createProjectMarkdown(curProject, wikiData)
        // 分类信息
        mdTemplate += md.createClassMarkdown(curProject, list, isToc)
        return mdTemplate
      } catch (e) {
        yapi.commons.log(e, 'error')
        ctx.body = yapi.commons.resReturn(null, 502, '下载出错')
      }
    }
  }
}

module.exports = exportController
