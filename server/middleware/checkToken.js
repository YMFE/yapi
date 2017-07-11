const jwt = require('jsonwebtoken');
//检查token是否过期

module.exports = async ( ctx, next ) => {
    // const authorization = ctx.get('Authorization');
    // if (authorization === '') {
    //     ctx.throw(401, 'no token detected in http header ');
    // }
    // const token = authorization.split(' ')[1];
    // let tokenContent;
    // try {
    //     tokenContent = await jwt.verify(token, 'qunar');     //如果token过期或验证失败，将抛出错误
    // } catch (err) {
    //     ctx.throw(401, 'invalid token');
    // }
    await next();
}
