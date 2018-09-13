const yapi = require('../yapi.js');
const baseController = require('./base.js');
const fs = require('fs'); //引入文件模块
const path = require('path');

class interfaceColController extends baseController {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 测试 get
   * @interface /test/get
   * @method GET
   * @returns {Object}
   * @example
   */
  async testGet(ctx) {
    try {
      let query = ctx.query;
      // cookie 检测
      ctx.cookies.set('_uid', 12, {
        expires: yapi.commons.expireDate(7),
        httpOnly: true
      });
      ctx.body = yapi.commons.resReturn(query);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 code
   * @interface /http/code
   * @method GET
   * @returns {Object}
   * @example
   */

  async testHttpCode(ctx) {
    try {
      let params = ctx.request.body;
      ctx.status = +ctx.query.code || 200;
      ctx.body = yapi.commons.resReturn(params);
    } catch(e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 post
   * @interface /test/post
   * @method POST
   * @returns {Object}
   * @example
   */
  async testPost(ctx) {
    try {
      let params = ctx.request.body;
      ctx.body = yapi.commons.resReturn(params);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 单文件上传
   * @interface /test/single/upload
   * @method POST
   * @returns {Object}
   * @example
   */
  async testSingleUpload(ctx) {
    try {
      // let params = ctx.request.body;
      let req = ctx.req;

      let chunks = [],
        size = 0;
      req.on('data', function(chunk) {
        chunks.push(chunk);
        size += chunk.length;
      });

      req.on('finish', function() {
        console.log(34343);
      });

      req.on('end', function() {
        let data = new Buffer(size);
        for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
          let chunk = chunks[i];
          chunk.copy(data, pos);
          pos += chunk.length;
        }
        fs.writeFileSync(path.join(yapi.WEBROOT_RUNTIME, 'test.text'), data, function(err) {
          return (ctx.body = yapi.commons.resReturn(null, 402, '写入失败'));
        });
      });

      ctx.body = yapi.commons.resReturn({ res: '上传成功' });
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 文件上传
   * @interface /test/files/upload
   * @method POST
   * @returns {Object}
   * @example
   */
  async testFilesUpload(ctx) {
    try {
      let file = ctx.request.body.files.file;
      let newPath = path.join(yapi.WEBROOT_RUNTIME, 'test.text');
      fs.renameSync(file.path, newPath);
      ctx.body = yapi.commons.resReturn({ res: '上传成功' });
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 put
   * @interface /test/put
   * @method PUT
   * @returns {Object}
   * @example
   */
  async testPut(ctx) {
    try {
      let params = ctx.request.body;
      ctx.body = yapi.commons.resReturn(params);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 delete
   * @interface /test/delete
   * @method DELETE
   * @returns {Object}
   * @example
   */
  async testDelete(ctx) {
    try {
      let body = ctx.request.body;
      ctx.body = yapi.commons.resReturn(body);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 head
   * @interface /test/head
   * @method HEAD
   * @returns {Object}
   * @example
   */
  async testHead(ctx) {
    try {
      let query = ctx.query;
      ctx.body = yapi.commons.resReturn(query);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 options
   * @interface /test/options
   * @method OPTIONS
   * @returns {Object}
   * @example
   */
  async testOptions(ctx) {
    try {
      let query = ctx.query;
      ctx.body = yapi.commons.resReturn(query);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试 patch
   * @interface /test/patch
   * @method PATCH
   * @returns {Object}
   * @example
   */
  async testPatch(ctx) {
    try {
      let params = ctx.request.body;
      ctx.body = yapi.commons.resReturn(params);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }
  /**
   * 测试 raw
   * @interface /test/raw
   * @method POST
   * @return {Object}
   * @example
   */
  async testRaw(ctx) {
    try {
      let params = ctx.request.body;
      ctx.body = yapi.commons.resReturn(params);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 测试返回值
   * @interface /test/response
   * @method get
   * @return {Object}
   * @example
   */
  async testResponse(ctx) {
    try {
      // let result = `<div><h2>12222222</h2></div>`;
      // let result = `wieieieieiieieie`
      let result = { b: '12', c: '23' };
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Content-Type', 'text');
      console.log(ctx.response);
      ctx.body = result;
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }
}

module.exports = interfaceColController;
