import yapi from './yapi.js';
import commons from './utils/commons';
yapi.commons = commons;
import dbModule from './utils/db.js';
import mockServer from './middleware/mockServer.js';
import Koa from 'koa';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import router from './router.js';
import websockify from 'koa-websocket';
import websocket from './websocket.js'

var compress = require('koa-compress')

yapi.connect = dbModule.connect();    
const app = websockify(new Koa());
let indexFile = process.argv[2] === 'dev' ? 'dev.html' : 'index.html';


app.use(mockServer);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

websocket(app);

app.use(compress({
  threshold: 50480,
  flush: require('zlib').Z_SYNC_FLUSH
}))

app.use( async (ctx, next) => {
    if( /^\/(?!api)[a-zA-Z0-9\/\-_]*$/.test(ctx.path) ){
        ctx.path = "/"
        await next()
    }else{
        await next()
    }
    
})
app.use(koaStatic(
    yapi.path.join(yapi.WEBROOT, 'static'),
    {index: indexFile, gzip: true}
));

app.listen(yapi.WEBCONFIG.port);
commons.log(`the server is start at port ${yapi.WEBCONFIG.port}`);