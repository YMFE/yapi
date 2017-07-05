module.exports = async (ctx, next) => {
    let path = ctx.path;
    console.log(path)
    console.log(ctx.hostname)
    if(next) await next();
}