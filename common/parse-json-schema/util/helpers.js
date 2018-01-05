'use strict';

// https://gist.github.com/pjt33/efb2f1134bab986113fd

function URLUtils(url, baseURL) {
  // remove leading ./
  url = url.replace(/^\.\//, '');

  var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@]*)(?::([^:@]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
  if (!m) {
    throw new RangeError();
  }
  var href = m[0] || '';
  var protocol = m[1] || '';
  var username = m[2] || '';
  var password = m[3] || '';
  var host = m[4] || '';
  var hostname = m[5] || '';
  var port = m[6] || '';
  var pathname = m[7] || '';
  var search = m[8] || '';
  var hash = m[9] || '';
  if (baseURL !== undefined) {
    var base = new URLUtils(baseURL);
    var flag = protocol === '' && host === '' && username === '';
    if (flag && pathname === '' && search === '') {
      search = base.search;
    }
    if (flag && pathname.charAt(0) !== '/') {
      pathname = (pathname !== '' ? (base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + pathname) : base.pathname);
    }
    // dot segments removal
    var output = [];

    pathname.replace(/\/?[^\/]+/g, function(p) {
      if (p === '/..') {
        output.pop();
      } else {
        output.push(p);
      }
    });

    pathname = output.join('') || '/';

    if (flag) {
      port = base.port;
      hostname = base.hostname;
      host = base.host;
      password = base.password;
      username = base.username;
    }
    if (protocol === '') {
      protocol = base.protocol;
    }
    href = protocol + (host !== '' ? '//' : '') + (username !== '' ? username + (password !== '' ? ':' + password : '') + '@' : '') + host + pathname + search + hash;
  }
  this.href = href;
  this.origin = protocol + (host !== '' ? '//' + host : '');
  this.protocol = protocol;
  this.username = username;
  this.password = password;
  this.host = host;
  this.hostname = hostname;
  this.port = port;
  this.pathname = pathname;
  this.search = search;
  this.hash = hash;
}

function isURL(path) {
  if (typeof path === 'string' && /^\w+:\/\//.test(path)) {
    return true;
  }
}

function parseURI(href, base) {
  return new URLUtils(href, base);
}

function resolveURL(base, href) {
  base = base || 'http://json-schema.org/schema#';

  href = parseURI(href, base);
  base = parseURI(base);

  if (base.hash && !href.hash) {
    return href.href + base.hash;
  }

  return href.href;
}

function getDocumentURI(uri) {
  return typeof uri === 'string' && uri.split('#')[0];
}

function isKeyword(prop) {
  return prop === 'enum' || prop === 'default' || prop === 'required';
}

module.exports = {
  isURL: isURL,
  parseURI: parseURI,
  isKeyword: isKeyword,
  resolveURL: resolveURL,
  getDocumentURI: getDocumentURI
};
