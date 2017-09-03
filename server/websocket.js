const koaRouter = require('koa-router');
const interfaceController = require('./controllers/interface.js');
const router = koaRouter();

function websocket(app) {
  console.log('load websocket...')
  app.ws.use(function (ctx, next) {
    return next(ctx);
  });
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
}

module.exports = websocket