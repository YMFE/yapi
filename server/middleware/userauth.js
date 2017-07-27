module.exports = async (ctx, next) => {
    let path = ctx.path;
    console.log(path); // eslint-disable-line
    console.log(ctx.hostname); // eslint-disable-line
    if (next) await next();
};