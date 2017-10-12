var strRegex = /\${([a-zA-Z0-9_\.]+)\}/g;
var varSplit = '.';
var mockSplit = '|';

function mock(mockJSON, context) {
  context = context || {};
  var filtersMap = {
    regexp: handleRegexp
  };

  return parse(mockJSON);

  function parse(p, c) {
    c = c || {};
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
    str = str.replace(strRegex, function (matchs, name) {
      var names = name.split(varSplit);
      var data = context;
      names.forEach(function (n) {
        if (data === '') return '';
        if (n in data) {
          data = data[n];
        } else {
          data = '';
        }
      });
      return data;
    });
    return str;
  }
}

module.exports = mock;