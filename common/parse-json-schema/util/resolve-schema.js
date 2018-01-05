'use strict';

var $ = require('./helpers');

var find = require('./find-reference');

var deepExtend = require('deep-extend');

function copy(_, obj, refs, parent, resolve, callback) {
  var target =  Array.isArray(obj) ? [] : {};

  if (typeof obj.$ref === 'string') {
    var id = obj.$ref;
    var base = $.getDocumentURI(id);
    var local = id.indexOf('#/') > -1;

    if (local || (resolve && base !== parent)) {
      var fixed = find(id, refs, callback);

      deepExtend(obj, fixed);

      delete obj.$ref;
      delete obj.id;
    }

    if (_[id] > 10) {
      return obj;
    }else if(_[id]){
      _[id] += 1;
    }else{
      _[id] = 1;
    }
  }


  for (var prop in obj) {
    
    if (typeof obj[prop] === 'object' && obj[prop] !== null && !$.isKeyword(prop)) {
      target[prop] = copy(_, obj[prop], refs, parent, resolve, callback);
    } else {
      target[prop] = obj[prop];
    }
  }

  return target;
}

module.exports = function(obj, refs, resolve, callback) {
  var fixedId = $.resolveURL(obj.$schema, obj.id),
      parent = $.getDocumentURI(fixedId);

  return copy({}, obj, refs, parent, resolve, callback);
};
