'use strict';

var $ = require('./util/helpers');

$.findByRef = require('./util/find-reference');
$.resolveSchema = require('./util/resolve-schema');
$.normalizeSchema = require('./util/normalize-schema');

var instance = module.exports = function(f) {
  function $ref(fakeroot, schema, refs, ex) {
    if (typeof fakeroot === 'object') {
      ex = refs;
      refs = schema;
      schema = fakeroot;
      fakeroot = undefined;
    }

    if (typeof schema !== 'object') {
      throw new Error('schema must be an object');
    }

    if (typeof refs === 'object' && refs !== null) {
      var aux = refs;

      refs = [];

      for (var k in aux) {
        aux[k].id = aux[k].id || k;
        refs.push(aux[k]);
      }
    }

    if (typeof refs !== 'undefined' && !Array.isArray(refs)) {
      ex = !!refs;
      refs = [];
    }

    function push(ref) {
      if (typeof ref.id === 'string') {
        var id = $.resolveURL(fakeroot, ref.id).replace(/\/#?$/, '');

        if (id.indexOf('#') > -1) {
          var parts = id.split('#');

          if (parts[1].charAt() === '/') {
            id = parts[0];
          } else {
            id = parts[1] || parts[0];
          }
        }

        if (!$ref.refs[id]) {
          $ref.refs[id] = ref;
        }
      }
    }

    (refs || []).concat([schema]).forEach(function(ref) {
      schema = $.normalizeSchema(fakeroot, ref, push);
      push(schema);
    });

    return $.resolveSchema(schema, $ref.refs, ex, f);
  }

  $ref.refs = {};
  $ref.util = $;

  return $ref;
};

instance.util = $;
