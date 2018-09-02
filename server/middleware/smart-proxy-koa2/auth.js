const SmartProxy = require('./lib/SmartProxy.class');

module.exports = (options) => {
  if (typeof options === 'string') { options = { token: options }; }

  options = Object.assign({
    key: 'user',
    async errorHandler(ctx, next) {
      ctx.body = 'SmartProxy access deny';
      ctx.status = 403;
    }
  }, options);

  const smartProxy = new SmartProxy(options);

  return async (ctx, next) => {
    ctx.request[options.key] = smartProxy.auth({
      timestamp: ctx.request.header.timestamp,
      signature: ctx.request.header.signature,
      staffId: ctx.request.header.staffid,
      staffName: ctx.request.header.staffname,
      xRioSeq: ctx.request.header['x-rio-seq'],
      xExtData: ctx.request.header['x-ext-data'] || '',
      host: ctx.request.header.host
    });

    if (ctx.request[options.key]) {
      await next();
    } else {
      await options.errorHandler(ctx, next);
    }
  };
};
