process.env.NODE_PATH = __dirname
require('module').Module._initPaths()

const yapi = require('./yapi.js')
const commons = require('./utils/commons')
yapi.commons = commons
const dbModule = require('./utils/db.js')
yapi.connect = dbModule.connect()
const mockServer = require('./middleware/mockServer.js')
const plugins = require('./plugin.js')
const websockify = require('koa-websocket')
const websocket = require('./websocket.js')

const Koa = require('koa')
const koaStatic = require('koa-static')
// const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')
const router = require('./router.js')

let indexFile = 'prd/index.html'

const app = websockify(new Koa())
app.proxy = true
yapi.app = app

// app.use(bodyParser({multipart: true}));
app.use(
  koaBody({
    multipart: true,
    jsonLimit: '10mb',
    formLimit: '80mb',
    textLimit: '10mb',
  }),
)
app.use(mockServer)
app.use(router.routes())
app.use(router.allowedMethods())

websocket(app)

// app.use(async (ctx, next) => {
//   if (/^\/(?!api)[a-zA-Z0-9\/\-_]*$/.test(ctx.path)) {
//     ctx.path = '/'
//     await next()
//   } else {
//     await next()
//   }
// })

app.use(async (ctx, next) => {
  if (ctx.path.indexOf('/prd') === 0) {
    ctx.set('Cache-Control', 'max-age=8640000000')
    if (
      yapi.commons.fileExist(
        yapi.path.join(yapi.WEBROOT, 'static', ctx.path + '.gz'),
      )
    ) {
      ctx.set('Content-Encoding', 'gzip')
      ctx.path = ctx.path + '.gz'
    }
  }
  await next()
})
// app.use(sso)
app.use(
  koaStatic(yapi.path.join(yapi.WEBROOT, 'static/'), {
    index: indexFile,
    gzip: true,
  }),
)

// hack掉404页面, 所有非接口路由都交给前端进行处理
app.use(async (ctx, next) => {
  const path = require('path')
  const fs = require('fs')
  let baseRoot = yapi.path.join(yapi.WEBROOT, 'static/')
  let indexFileUri = path.resolve(baseRoot, indexFile)
  let content = fs.readFileSync(indexFileUri).toString()
  ctx.res.writeHead(200)
  ctx.res.write(content)
  ctx.res.end()
  await next()
})

app.listen(yapi.WEBCONFIG.port)
commons.log(
  `服务已启动，请打开下面链接访问: \nhttp://127.0.0.1${
    yapi.WEBCONFIG.port == '80' ? '' : ':' + yapi.WEBCONFIG.port
  }/`,
)
