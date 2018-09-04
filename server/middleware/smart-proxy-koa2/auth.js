const SmartProxy = require('./lib/SmartProxy');

module.exports = options => {
  if (typeof options === 'string') {
    options = { token: options, enable: true };
  }

  options = { key: 'user', ...options };

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
    await next();
  };
};
