/**
 * @author suxiaoxin
 * @info  mockJs 功能增强脚本
 */
var strRegex = /\${([a-zA-Z]+)\.?([a-zA-Z0-9_\.]*)\}/i;
var varSplit = '.';
var mockSplit = '|';
var Mock = require('mockjs');
Mock.Random.extend({
  timestamp: function(){
    var time = new Date().getTime() + '';
    return +time.substr(0, time.length - 3)
  }
})

function mock(mockJSON, context) {
  context = context || {};
  var filtersMap = {
    regexp: handleRegexp
  };
  if(!mockJSON || typeof mockJSON !== 'object'){
    return mockJSON;
  }

  return parse(mockJSON);

  function parse(p, c) {
    if(!c){
      c = Array.isArray(p) ? [] :  {}
    }

    for (var i in p) {
      if (!p.hasOwnProperty(i)) {
        continue;
      }
      if (p[i] && typeof p[i] === 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {};
        parse(p[i], c[i]);
      } else if(p[i] && typeof p[i] === 'string'){
        p[i] = handleStr(p[i]);        
        var filters = i.split(mockSplit), newFilters = [].concat(filters);
        c[i] = p[i];
        if (filters.length > 1) {
          for (var f = 1, l = filters.length, index; f < l; f++) {
            filters[f] = filters[f].toLowerCase();
            if (filters[f] in filtersMap) {
              if ((index = newFilters.indexOf(filters[f])) !== -1) {
                newFilters.splice(index, 1);
              }
              delete c[i];
              c[newFilters.join(mockSplit)] = filtersMap[filters[f]].call(p, p[i]);
            }
          }
        }
      }else{
        c[i] = p[i];
      }
    }
    return c;
  }

  function handleRegexp(item) {
    return new RegExp(item);
  }

  function handleStr(str) {
    if (typeof str !== 'string' || str.indexOf('{') === -1 || str.indexOf('}') === -1 || str.indexOf('$') === -1) {
      return str;
    }

    let matchs = str.match(strRegex);
    if(matchs){
      let name = matchs[1] + (matchs[2]? '.' + matchs[2] : '');
      if(!name) return str;
      var names = name.split(varSplit);
      var data = context;
      
      if(typeof context[names[0]] === undefined){
        return str;
      }
      names.forEach(function (n) {
        if (data === '') return '';
        if (n in data) {
          data = data[n];
        } else {
          data = '';
        }
      });
      return data;
    }
    return str;
  }
}

module.exports = mock;