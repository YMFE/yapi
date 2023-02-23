const Safeify = require('safeify').default;

module.exports = async function sandboxFn(context, script) {
    let result
    // 创建 safeify 实例
    const safeVm = new Safeify({
        timeout: 3000,
        asyncTimeout: 60000
    })

    script += "; return this;";
    
    try {
        // 执行动态代码
        result = await safeVm.run(script, context)
    } catch (error) {
        console.log('error: ', error)
    }

    // 释放资源
    safeVm.destroy()
    return result
}
