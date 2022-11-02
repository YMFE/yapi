const Safeify = require('safeify').default;

module.exports = async function sandboxFn(context, script) {
    // 创建 safeify 实例
    const safeVm = new Safeify({
        timeout: 3000,
        asyncTimeout: 60000
    })
    // 解决 https://github.com/YMFE/yapi/issues/2543, https://github.com/YMFE/yapi/issues/2357
    script += `; return {
        Function: this.Function,
        eval: this.eval,
        header: this.header,
        query: this.query,
        body: this.body,
        mockJson: this.mockJson,
        params: this.params,
        resHeader: this.resHeader,
        httpCode: this.httpCode,
        delay: this.delay,
        Random: this.Random,
        cookie: this.cookie
    }`;
    // 执行动态代码
    const result = await safeVm.run(script, context)

    // 释放资源
    safeVm.destroy()
    return result
}
