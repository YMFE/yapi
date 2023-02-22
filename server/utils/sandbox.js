const Safeify = require('safeify').default;
const safeVm = new Safeify({
  timeout: 3000,
  asyncTimeout: 60000,
  // true为不受CPU限制，以解决Docker启动问题
  unrestricted: true,
  unsafe: {
    modules: {
      // 引入assert断言库
      assert: 'assert'
    }
  }
});
safeVm.preset('const assert = require("assert");');

module.exports = async function sandboxFn(context, script) {
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
  const result = await safeVm.run(script, context);
  return result;
};
