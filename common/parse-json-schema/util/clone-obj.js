'use strict';

var clone = module.exports = function(obj, seen) {
  seen = seen || [];

  if (seen.indexOf(obj) > -1) {
    throw new Error('unable dereference circular structures');
  }

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  seen = seen.concat([obj]);

  var target = Array.isArray(obj) ? [] : {};

  function copy(key, value) {
    target[key] = clone(value, seen);
  }

  if (Array.isArray(target)) {
    obj.forEach(function(value, key) {
      copy(key, value);
    });
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    Object.keys(obj).forEach(function(key) {
      copy(key, obj[key]);
    });
  }

  return target;
};
