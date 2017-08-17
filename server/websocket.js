import koaRouter from 'koa-router';
const route = require('koa-route');
import interfaceController from './controllers/interface.js';


function websocket(app) {
  console.log('load websocket...')
  app.ws.use(function (ctx, next) {
    return next(ctx);
  });
  app.ws.use(route.all('/api/interface/solve_conflict', async function (ctx) {
    let inst = new interfaceController(ctx);
    await inst.init(ctx);
    if (inst.$auth === true) {
      await inst.solveConflict.call(inst, ctx);
    } else {
      ctx.ws.send('请登录...');
    }
  }));

}

module.exports = websocket