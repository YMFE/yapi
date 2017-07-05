module.exports = async (ctx, next) => {
    let hostname = ctx.hostname
    


    if(next) await next();
}