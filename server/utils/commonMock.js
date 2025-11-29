const Mock = require('mockjs');

/**
 * Common Response Headers
 * Define headers that should be applied to responses
 */
exports.commonResponseHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Max-Age': 1728000,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEADER, PATCH, OPTIONS'
};

/**
 * Set common response headers to context
 * @param {Object} ctx Koa context
 * @param {String} origin Origin header
 */
exports.setCommonResponseHeaders = (ctx, origin) => {
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Credentials', true);
  // You can uncomment or add more common headers here if needed
  // Object.keys(exports.commonResponseHeaders).forEach(key => {
  //   ctx.set(key, exports.commonResponseHeaders[key]);
  // });
};

/**
 * Common Mock Utilities
 * reusable mock methods
 */
exports.mockUtils = {
  /**
   * Standard success response wrapper
   * @param {Any} data Response data
   * @param {String} msg Message
   */
  success: (data, msg = 'success') => {
    return {
      code: 0,
      msg: msg,
      data: data
    };
  },

  /**
   * Standard error response wrapper
   * @param {Number} code Error code
   * @param {String} msg Error message
   */
  fail: (code = 400, msg = 'fail') => {
    return {
      code: code,
      msg: msg
    };
  },

  /**
   * Mock a standard list response
   * @param {Array} list Data list
   * @param {Number} total Total count
   */
  page: (list, total) => {
    return {
      code: 0,
      msg: 'success',
      data: {
        list: list,
        total: total || list.length
      }
    };
  },

  /**
   * Mock a random user
   */
  mockUser: () => {
    return Mock.mock({
      'id': '@id',
      'name': '@cname',
      'email': '@email',
      'avatar': '@image("200x200")'
    });
  }
};
