/**
 * @author suxiaoxin
 */

const aUniqueVerticalStringNotFoundInData = '___UNIQUE_VERTICAL___';
const aUniqueCommaStringNotFoundInData = '___UNIQUE_COMMA___';
const segmentSeparateChar = '|';
const methodAndArgsSeparateChar = ':';
const argsSeparateChar = ',';

const md5 = require('md5');
const sha = require('sha.js');
const Base64 = require('js-base64').Base64;

const stringHandles = {
  md5: function(str) {
    return md5(str);
  },

  sha: function(str, arg) {
    return sha(arg)
      .update(str)
      .digest('hex');
  },

  /**
   * type: sha1 sha224 sha256 sha384 sha512
   */
  sha1: function(str) {
    return sha('sha1')
      .update(str)
      .digest('hex');
  },

  sha224: function(str) {
    return sha('sha224')
      .update(str)
      .digest('hex');
  },

  sha256: function(str) {
    return sha('sha256')
      .update(str)
      .digest('hex');
  },

  sha384: function(str) {
    return sha('sha384')
      .update(str)
      .digest('hex');
  },

  sha512: function(str) {
    return sha('sha512')
      .update(str)
      .digest('hex');
  },

  base64: function(str) {
    return Base64.encode(str);
  },

  unbase64: function(str) {
    return Base64.decode(str);
  },

  substr: function(str, ...args) {
    return str.substr(...args);
  },

  concat: function(str, ...args) {
    args.forEach(item => {
      str += item;
    });
    return str;
  },

  lconcat: function(str, ...args) {
    args.forEach(item => {
      str = item + this._string;
    });
    return str;
  },

  lower: function(str) {
    return str.toLowerCase();
  },

  upper: function(str) {
    return str.toUpperCase();
  },

  length: function(str) {
    return str.length;
  },

  number: function(str) {
    return !isNaN(str) ? +str : str;
  }
};

let handleValue = function(str) {
  return str;
};

const _handleValue = function(str) {
  if (str[0] === str[str.length - 1] && (str[0] === '"' || str[0] === "'")) {
    str = str.substr(1, str.length - 2);
  }
  return handleValue(
    str
      .replace(new RegExp(aUniqueVerticalStringNotFoundInData, 'g'), segmentSeparateChar)
      .replace(new RegExp(aUniqueCommaStringNotFoundInData, 'g'), argsSeparateChar)
  );
};

class PowerString {
  constructor(str) {
    this._string = str;
  }

  toString() {
    return this._string;
  }
}

function addMethod(method, fn) {
  PowerString.prototype[method] = function(...args) {
    args.unshift(this._string + '');
    this._string = fn.apply(this, args);
    return this;
  };
}

function importMethods(handles) {
  for (let method in handles) {
    addMethod(method, handles[method]);
  }
}

importMethods(stringHandles);

function handleOriginStr(str, handleValueFn) {
  if (!str) return str;
  if (typeof handleValueFn === 'function') {
    handleValue = handleValueFn;
  }
  str = str
    .replace('\\' + segmentSeparateChar, aUniqueVerticalStringNotFoundInData)
    .replace('\\' + argsSeparateChar, aUniqueCommaStringNotFoundInData)
    .split(segmentSeparateChar)
    .map(handleSegment)
    .reduce(execute, null)
    .toString();
  return str;
}

function execute(str, curItem, index) {
  if (index === 0) {
    return new PowerString(curItem);
  }
  return str[curItem.method].apply(str, curItem.args);
}

function handleSegment(str, index) {
  str = str.trim();
  if (index === 0) {
    return _handleValue(str);
  }

  let method,
    args = [];
  if (str.indexOf(methodAndArgsSeparateChar) > 0) {
    str = str.split(methodAndArgsSeparateChar);
    method = str[0].trim();
    args = str[1].split(argsSeparateChar).map(item => _handleValue(item.trim()));
  } else {
    method = str;
  }
  if (typeof stringHandles[method] !== 'function') {
    throw new Error(`This method name(${method}) is not exist.`);
  }

  return {
    method,
    args
  };
}

module.exports = {
  utils: stringHandles,
  PowerString,
  /**
   * 类似于 angularJs的 filter 功能
   * @params string
   * @params fn 处理参数值函数，默认是一个返回原有参数值函数
   *
   * @expamle
   * filter('string | substr: 1, 10 | md5 | concat: hello ')
   */
  filter: handleOriginStr
};
