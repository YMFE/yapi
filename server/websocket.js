const koaRouter = require('koa-router');
const interfaceController = require('./controllers/interface.js');
const router = koaRouter();

function websocket(app) {
  console.log('load websocket...')
  
  router.get('/api/interface/solve_conflict', async function (ctx) {
    let inst = new interfaceController(ctx);
    await inst.init(ctx);
    if (inst.$auth === true) {
      await inst.solveConflict.call(inst, ctx);
    } else {
      ctx.ws.send('请登录...');
    }
  })

  app.ws.use(router.routes())
  app.ws.use(router.allowedMethods());
  app.ws.use(function (ctx, next) {
    console.log(1111)
    return ctx.websocket.send(JSON.stringify({
      errcode: 404,
      errmsg: 'No Fount.'
    }));
  });
}

module.exports = websocket