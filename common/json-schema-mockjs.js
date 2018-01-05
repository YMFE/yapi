function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $RefParser = _interopDefault(require('json-schema-ref-parser'));
var deref = _interopDefault(require('./parse-json-schema'));
var tslib_1 = require('tslib');

// dynamic proxy for custom generators
function proxy(gen) {
  return function (value, schema, property) {
    var fn = value;
    var args = [];
    // support for nested object, first-key is the generator
    if (typeof value === 'object') {
      fn = Object.keys(value)[0];
      // treat the given array as arguments,
      if (Array.isArray(value[fn])) {
        // if the generator is expecting arrays they should be nested, e.g. `[[1, 2, 3], true, ...]`
        args = value[fn];
      }
      else {
        args.push(value[fn]);
      }
    }
    // support for keypaths, e.g. "internet.email"
    var props = fn.split('.');
    // retrieve a fresh dependency
    var ctx = gen();
    while (props.length > 1) {
      ctx = ctx[props.shift()];
    }
    // retrieve last value from context object
    value = typeof ctx === 'object' ? ctx[props[0]] : ctx;
    // invoke dynamic generators
    if (typeof value === 'function') {
      value = value.apply(ctx, args);
    }
    // test for pending callbacks
    if (Object.prototype.toString.call(value) === '[object Object]') {
      for (var key in value) {
        if (typeof value[key] === 'function') {
          throw new Error('Cannot resolve value for "' + property + ': ' + fn + '", given: ' + value);
        }
      }
    }
    return value;
  };
}
/**
 * Container is used to wrap external generators (faker, chance, casual, etc.) and its dependencies.
 *
 * - `jsf.extend('faker')` will enhance or define the given dependency.
 * - `jsf.define('faker')` will provide the "faker" keyword support.
 *
 * RandExp is not longer considered an "extension".
 */
var Container = (function () {
  function Container() {
    // dynamic requires - handle all dependencies
    // they will NOT be included on the bundle
    this.registry = {};
    this.support = {};
  }
  /**
   * Override dependency given by name
   * @param name
   * @param callback
   */
  Container.prototype.extend = function (name, callback) {
    var _this = this;
    this.registry[name] = callback(this.registry[name]);
    // built-in proxy (can be overridden)
    if (!this.support[name]) {
      this.support[name] = proxy(function () { return _this.registry[name]; });
    }
  };
  /**
   * Set keyword support by name
   * @param name
   * @param callback
   */
  Container.prototype.define = function (name, callback) {
    this.support[name] = callback;
  };
  /**
   * Returns dependency given by name
   * @param name
   * @returns {Dependency}
   */
  Container.prototype.get = function (name) {
    if (typeof this.registry[name] === 'undefined') {
      throw new ReferenceError('"' + name + '" dependency doesn\'t exist.');
    }
    return this.registry[name];
  };
  /**
   * Apply a custom keyword
   * @param schema
   */
  Container.prototype.wrap = function (schema) {
    var keys = Object.keys(schema);
    var length = keys.length;
    while (length--) {
      var fn = keys[length].replace(/^x-/, '');
      var gen = this.support[fn];
      if (typeof gen === 'function') {
        schema.generate = function () { return gen(schema[keys[length]], schema, keys[length]); };
        break;
      }
    }
    return schema;
  };
  return Container;
}());

/**
 * This class defines a registry for custom formats used within JSF.
 */
var Registry = (function () {
  function Registry() {
    // empty by default
    this.data = {};
  }
  /**
   * Registers custom format
   */
  Registry.prototype.register = function (name, callback) {
    this.data[name] = callback;
  };
  /**
   * Register many formats at one shot
   */
  Registry.prototype.registerMany = function (formats) {
    for (var name in formats) {
      this.data[name] = formats[name];
    }
  };
  /**
   * Returns element by registry key
   */
  Registry.prototype.get = function (name) {
    var format = this.data[name];
    return format;
  };
  /**
   * Returns the whole registry content
   */
  Registry.prototype.list = function () {
    return this.data;
  };
  return Registry;
}());

// instantiate
var registry = new Registry();
/**
 * Custom format API
 *
 * @see https://github.com/json-schema-faker/json-schema-faker#custom-formats
 * @param nameOrFormatMap
 * @param callback
 * @returns {any}
 */
function formatAPI$1(nameOrFormatMap, callback) {
  if (typeof nameOrFormatMap === 'undefined') {
    return registry.list();
  }
  else if (typeof nameOrFormatMap === 'string') {
    if (typeof callback === 'function') {
      registry.register(nameOrFormatMap, callback);
    }
    else {
      return registry.get(nameOrFormatMap);
    }
  }
  else {
    registry.registerMany(nameOrFormatMap);
  }
}

/**
 * This class defines a registry for custom settings used within JSF.
 */
var OptionRegistry = (function (_super) {
  tslib_1.__extends(OptionRegistry, _super);
  function OptionRegistry() {
    var _this = _super.call(this) || this;
    _this.data['failOnInvalidTypes'] = true;
    _this.data['defaultInvalidTypeProduct'] = null;
    _this.data['failOnInvalidFormat'] = true;
    _this.data['useDefaultValue'] = false;
    _this.data['requiredOnly'] = false;
    _this.data['maxItems'] = null;
    _this.data['maxLength'] = null;
    _this.data['defaultMinItems'] = 0;
    _this.data['defaultRandExpMax'] = 10;
    _this.data['alwaysFakeOptionals'] = false;
    _this.data['random'] = Math.random;
    return _this;
  }
  return OptionRegistry;
}(Registry));

// instantiate
var registry$1 = new OptionRegistry();
/**
 * Custom option API
 *
 * @param nameOrOptionMap
 * @returns {any}
 */
function optionAPI(nameOrOptionMap) {
  if (typeof nameOrOptionMap === 'string') {
    return registry$1.get(nameOrOptionMap);
  }
  else {
    return registry$1.registerMany(nameOrOptionMap);
  }
}

var RandExp = require('randexp');
// set maximum default, see #193
RandExp.prototype.max = 10;
// same implementation as the original except using our random
RandExp.prototype.randInt = function (a, b) {
  return a + Math.floor(optionAPI('random')() * (1 + b - a));
};
function _randexp(value) {
  var re = new RandExp(value);
  // apply given setting
  re.max = optionAPI('defaultRandExpMax');
  return re.gen();
}
function getSubAttribute(obj, dotSeparatedKey) {
  var keyElements = dotSeparatedKey.split('.');
  while (keyElements.length) {
    var prop = keyElements.shift();
    if (!obj[prop]) {
      break;
    }
    obj = obj[prop];
  }
  return obj;
}
/**
 * Returns true/false whether the object parameter has its own properties defined
 *
 * @param obj
 * @param properties
 * @returns {boolean}
 */
function hasProperties(obj) {
  var properties = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    properties[_i - 1] = arguments[_i];
  }
  return properties.filter(function (key) {
    return typeof obj[key] !== 'undefined';
  }).length > 0;
}
/**
 * Returns typecasted value.
 * External generators (faker, chance, casual) may return data in non-expected formats, such as string, when you might expect an
 * integer. This function is used to force the typecast.
 *
 * @param value
 * @param targetType
 * @returns {any}
 */
function typecast(value, schema) {
  // FIXME this function should cover most cases and should be reused within generators
  switch (schema.type) {
    case 'integer':
      return parseInt(value, 10);
    case 'number':
      return parseFloat(value);
    case 'string':
      value = String(value);
      var min = Math.max(schema.minLength || 0, 0);
      var max = Math.min(schema.maxLength || Infinity, Infinity);
      while (value.length < min) {
        value += ' ' + value;
      }
      if (value.length > max) {
        value = value.substr(0, max);
      }
      return value;
    case 'boolean':
      return !!value;
    default:
      return value;
  }
}
function merge(a, b) {
  for (var key in b) {
    if (typeof b[key] !== 'object' || b[key] === null) {
      a[key] = b[key];
    }
    else if (Array.isArray(b[key])) {
      a[key] = a[key] || [];
      // fix #292 - skip duplicated values from merge object (b)
      b[key].forEach(function (value) {
        if (a[key].indexOf(value)) {
          a[key].push(value);
        }
      });
    }
    else if (typeof a[key] !== 'object' || a[key] === null || Array.isArray(a[key])) {
      a[key] = merge({}, b[key]);
    }
    else {
      a[key] = merge(a[key], b[key]);
    }
  }
  return a;
}
function clean(obj, isArray, requiredProps) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    obj = obj
      .map(function (value) { return clean(value, true); })
      .filter(function (value) { return typeof value !== 'undefined'; });
    return obj;
  }
  Object.keys(obj).forEach(function (k) {
    if (!requiredProps || requiredProps.indexOf(k) === -1) {
      if (Array.isArray(obj[k]) && !obj[k].length) {
        delete obj[k];
      }
    }
    else {
      obj[k] = clean(obj[k]);
    }
  });
  if (!Object.keys(obj).length && isArray) {
    return undefined;
  }
  return obj;
}
function short(schema) {
  var s = JSON.stringify(schema);
  var l = JSON.stringify(schema, null, 2);
  return s.length > 400 ? l.substr(0, 400) + '...' : l;
}
var utils = {
  getSubAttribute: getSubAttribute,
  hasProperties: hasProperties,
  typecast: typecast,
  merge: merge,
  clean: clean,
  short: short,
  randexp: _randexp
};

/// <reference path="../index.d.ts" />
/**
 * Returns random element of a collection
 *
 * @param collection
 * @returns {T}
 */
function pick(collection) {
  return collection[Math.floor(optionAPI('random')() * collection.length)];
}
/**
 * Returns shuffled collection of elements
 *
 * @param collection
 * @returns {T[]}
 */
function shuffle(collection) {
  var tmp, key, copy = collection.slice(), length = collection.length;
  for (; length > 0;) {
    key = Math.floor(optionAPI('random')() * length);
    // swap
    tmp = copy[--length];
    copy[length] = copy[key];
    copy[key] = tmp;
  }
  return copy;
}
/**
 * These values determine default range for random.number function
 *
 * @type {number}
 */
var MIN_NUMBER = -100;
var MAX_NUMBER = 100;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * @see http://stackoverflow.com/a/1527820/769384
 */
function getRandom(min, max) {
  return optionAPI('random')() * (max - min) + min;
}
/**
 * Generates random number according to parameters passed
 *
 * @param min
 * @param max
 * @param defMin
 * @param defMax
 * @param hasPrecision
 * @returns {number}
 */
function number(min, max, defMin, defMax, hasPrecision) {
  if (hasPrecision === void 0) { hasPrecision = false; }
  defMin = typeof defMin === 'undefined' ? MIN_NUMBER : defMin;
  defMax = typeof defMax === 'undefined' ? MAX_NUMBER : defMax;
  min = typeof min === 'undefined' ? defMin : min;
  max = typeof max === 'undefined' ? defMax : max;
  if (max < min) {
    max += min;
  }
  var result = getRandom(min, max);
  if (!hasPrecision) {
    return Math.round(result);
  }
  return result;
}
var random = {
  pick: pick,
  shuffle: shuffle,
  number: number,
};

var ParseError = (function (_super) {
  tslib_1.__extends(ParseError, _super);
  function ParseError(message, path) {
    var _this = _super.call(this) || this;
    _this.path = path;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, _this.constructor);
    }
    _this.name = 'ParseError';
    _this.message = message;
    _this.path = path;
    return _this;
  }
  return ParseError;
}(Error));

var inferredProperties = {
  array: [
    'additionalItems',
    'items',
    'maxItems',
    'minItems',
    'uniqueItems'
  ],
  integer: [
    'exclusiveMaximum',
    'exclusiveMinimum',
    'maximum',
    'minimum',
    'multipleOf'
  ],
  object: [
    'additionalProperties',
    'dependencies',
    'maxProperties',
    'minProperties',
    'patternProperties',
    'properties',
    'required'
  ],
  string: [
    'maxLength',
    'minLength',
    'pattern'
  ]
};
inferredProperties.number = inferredProperties.integer;
var subschemaProperties = [
  'additionalItems',
  'items',
  'additionalProperties',
  'dependencies',
  'patternProperties',
  'properties'
];
/**
 * Iterates through all keys of `obj` and:
 * - checks whether those keys match properties of a given inferred type
 * - makes sure that `obj` is not a subschema; _Do not attempt to infer properties named as subschema containers. The
 * reason for this is that any property name within those containers that matches one of the properties used for
 * inferring missing type values causes the container itself to get processed which leads to invalid output. (Issue 62)_
 *
 * @returns {boolean}
 */
function matchesType(obj, lastElementInPath, inferredTypeProperties) {
  return Object.keys(obj).filter(function (prop) {
    var isSubschema = subschemaProperties.indexOf(lastElementInPath) > -1, inferredPropertyFound = inferredTypeProperties.indexOf(prop) > -1;
    if (inferredPropertyFound && !isSubschema) {
      return true;
    }
  }).length > 0;
}
/**
 * Checks whether given `obj` type might be inferred. The mechanism iterates through all inferred types definitions,
 * tries to match allowed properties with properties of given `obj`. Returns type name, if inferred, or null.
 *
 * @returns {string|null}
 */
function inferType(obj, schemaPath) {
  for (var typeName in inferredProperties) {
    var lastElementInPath = schemaPath[schemaPath.length - 1];
    if (matchesType(obj, lastElementInPath, inferredProperties[typeName])) {
      return typeName;
    }
  }
}

/**
 * Generates randomized boolean value.
 *
 * @returns {boolean}
 */
function booleanGenerator() {
  return optionAPI('random')() > 0.5;
}

var booleanType = booleanGenerator;

/**
 * Generates null value.
 *
 * @returns {null}
 */
function nullGenerator() {
  return null;
}

var nullType = nullGenerator;

// TODO provide types
function unique(path, items, value, sample, resolve, traverseCallback) {
  var tmp = [], seen = [];
  function walk(obj) {
    var json = JSON.stringify(obj);
    if (seen.indexOf(json) === -1) {
      seen.push(json);
      tmp.push(obj);
    }
  }
  items.forEach(walk);
  // TODO: find a better solution?
  var limit = 100;
  while (tmp.length !== items.length) {
    walk(traverseCallback(value.items || sample, path, resolve));
    if (!limit--) {
      break;
    }
  }
  return tmp;
}
// TODO provide types
var arrayType = function arrayType(value, path, resolve, traverseCallback) {
  var items = [];
  if (!(value.items || value.additionalItems)) {
    if (utils.hasProperties(value, 'minItems', 'maxItems', 'uniqueItems')) {
      throw new ParseError('missing items for ' + utils.short(value), path);
    }
    return items;
  }
  // see http://stackoverflow.com/a/38355228/769384
  // after type guards support subproperties (in TS 2.0) we can simplify below to (value.items instanceof Array)
  // so that value.items.map becomes recognized for typescript compiler
  var tmpItems = value.items;
  if (tmpItems instanceof Array) {
    return Array.prototype.concat.call(items, tmpItems.map(function (item, key) {
      var itemSubpath = path.concat(['items', key + '']);
      return traverseCallback(item, itemSubpath, resolve);
    }));
  }
  var minItems = value.minItems;
  //var maxItems = value.maxItems;
  var maxItems = 1;
  if (optionAPI('defaultMinItems') && minItems === undefined) {
    // fix boundaries
    minItems = !maxItems
      ? optionAPI('defaultMinItems')
      : Math.min(optionAPI('defaultMinItems'), maxItems);
  }
  if (optionAPI('maxItems')) {
    // Don't allow user to set max items above our maximum
    if (maxItems && maxItems > optionAPI('maxItems')) {
      maxItems = optionAPI('maxItems');
    }
    // Don't allow user to set min items above our maximum
    if (minItems && minItems > optionAPI('maxItems')) {
      minItems = maxItems;
    }
  }
  var length = (maxItems != null && optionAPI('alwaysFakeOptionals')) ?
    maxItems : random.number(minItems, maxItems, 1, 5),
    // TODO below looks bad. Should additionalItems be copied as-is?
    sample = typeof value.additionalItems === 'object' ? value.additionalItems : {};
  for (var current = items.length; current < length; current++) {
    var itemSubpath = path.concat(['items', current + '']);
    var element = traverseCallback(value.items || sample, itemSubpath, resolve);
    items.push(element);
  }
  if (value.uniqueItems) {
    return unique(path.concat(['items']), items, value, sample, resolve, traverseCallback);
  }
  return items;
};

var MIN_INTEGER = -100000000;
var MAX_INTEGER = 100000000;
var numberType$1 = function numberType(value) {
  var min = typeof value.minimum === 'undefined' ? MIN_INTEGER : value.minimum, max = typeof value.maximum === 'undefined' ? MAX_INTEGER : value.maximum, multipleOf = value.multipleOf;
  if (multipleOf) {
    max = Math.floor(max / multipleOf) * multipleOf;
    min = Math.ceil(min / multipleOf) * multipleOf;
  }
  if (value.exclusiveMinimum && value.minimum && min === value.minimum) {
    min += multipleOf || 1;
  }
  if (value.exclusiveMaximum && value.maximum && max === value.maximum) {
    max -= multipleOf || 1;
  }
  if (min > max) {
    return NaN;
  }
  if (multipleOf) {
    return Math.floor(random.number(min, max) / multipleOf) * multipleOf;
  }
  return random.number(min, max, undefined, undefined, true);
};

// The `integer` type is just a wrapper for the `number` type. The `number` type
// returns floating point numbers, and `integer` type truncates the fraction
// part, leaving the result as an integer.
var integerType = function integerType(value) {
  var generated = numberType$1(value);
  // whether the generated number is positive or negative, need to use either
  // floor (positive) or ceil (negative) function to get rid of the fraction
  return generated > 0 ? Math.floor(generated) : Math.ceil(generated);
};

var LIPSUM_WORDS = ('Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore'
  + ' et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea'
  + ' commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla'
  + ' pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est'
  + ' laborum').split(' ');
/**
 * Generates randomized array of single lorem ipsum words.
 *
 * @param length
 * @returns {Array.<string>}
 */
function wordsGenerator$1(length) {
  var words = random.shuffle(LIPSUM_WORDS);
  return words.slice(0, length);
}

// fallback generator
var anyType = { type: ['string', 'number', 'integer', 'boolean'] };
// TODO provide types
var objectType = function objectType(value, path, resolve, traverseCallback) {
  var props = {};
  var properties = value.properties || {};
  var propertyKeys = value.required = Object.keys(properties);
  var patternProperties = value.patternProperties || {};
  var requiredProperties = (value.required || []).slice();
  var allowsAdditional = value.additionalProperties === false ? false : true;

  var patternPropertyKeys = Object.keys(patternProperties);
  var additionalProperties = allowsAdditional
    ? (value.additionalProperties === true ? {} : value.additionalProperties)
    : null;
  if (!allowsAdditional &&
    propertyKeys.length === 0 &&
    patternPropertyKeys.length === 0 &&
    utils.hasProperties(value, 'minProperties', 'maxProperties', 'dependencies', 'required')) {
    throw new ParseError('missing properties for:\n' + utils.short(value), path);
  }
  if (optionAPI('requiredOnly') === true) {
    requiredProperties.forEach(function (key) {
      if (properties[key]) {
        props[key] = properties[key];
      }
    });
    return traverseCallback(props, path.concat(['properties']), resolve);
  }
  var min = Math.max(value.minProperties || 0, requiredProperties.length);
  var max = Math.max(value.maxProperties || random.number(min, min + 5));
  random.shuffle(patternPropertyKeys.concat(propertyKeys)).forEach(function (_key) {
    if (requiredProperties.indexOf(_key) === -1) {
      requiredProperties.push(_key);
    }
  });
  // properties are read from right-to-left
  var _props = optionAPI('alwaysFakeOptionals') ? requiredProperties
    : requiredProperties.slice(0, random.number(min, max));
  _props.forEach(function (key) {
    // first ones are the required properies
    if (properties[key]) {
      props[key] = properties[key];
    }
    else {
      var found;
      // then try patternProperties
      patternPropertyKeys.forEach(function (_key) {
        if (key.match(new RegExp(_key))) {
          found = true;
          props[utils.randexp(key)] = patternProperties[_key];
        }
      });
      if (!found) {
        // try patternProperties again,
        var subschema = patternProperties[key] || additionalProperties;
        if (subschema) {
          // otherwise we can use additionalProperties?
          props[patternProperties[key] ? utils.randexp(key) : key] = subschema;
        }
      }
    }
  });
  var current = Object.keys(props).length;
  while (true) {
    if (!(patternPropertyKeys.length || allowsAdditional)) {
      break;
    }
    if (current >= min) {
      break;
    }
    if (allowsAdditional) {
      var word = wordsGenerator$1(1) + utils.randexp('[a-f\\d]{1,3}');
      if (!props[word]) {
        props[word] = additionalProperties || anyType;
        current += 1;
      }
    }
    patternPropertyKeys.forEach(function (_key) {
      var word = utils.randexp(_key);
      if (!props[word]) {
        props[word] = patternProperties[_key];
        current += 1;
      }
    });
  }
  if (!allowsAdditional && current < min) {
    throw new ParseError('properties constraints were too strong to successfully generate a valid object for:\n' +
      utils.short(value), path);
  }
  return traverseCallback(props, path.concat(['properties']), resolve);
};

/**
 * Helper function used by thunkGenerator to produce some words for the final result.
 *
 * @returns {string}
 */
function produce() {
  var length = random.number(1, 5);
  return wordsGenerator$1(length).join(' ');
}
/**
 * Generates randomized concatenated string based on words generator.
 *
 * @returns {string}
 */
function thunkGenerator$1(min, max) {
  if (min === void 0) { min = 0; }
  if (max === void 0) { max = 140; }
  var min = Math.max(0, min), max = random.number(min, max), result = produce();
  // append until length is reached
  while (result.length < min) {
    result += produce();
  }
  // cut if needed
  if (result.length > max) {
    result = result.substr(0, max);
  }
  return result;
}

/**
 * Generates randomized ipv4 address.
 *
 * @returns {string}
 */
function ipv4Generator() {
  return [0, 0, 0, 0].map(function () {
    return random.number(0, 255);
  }).join('.');
}

var MOST_NEAR_DATETIME = 2524608000000;
/**
 * Generates randomized date time ISO format string.
 *
 * @returns {string}
 */
function dateTimeGenerator$1() {
  var date = new Date();
  var days = random.number(-1000, MOST_NEAR_DATETIME);
  date.setTime(date.getTime() - days);
  return date.toISOString();
}

/**
 * Predefined core formats
 * @type {[key: string]: string}
 */
var regexps = {
  email: '[a-zA-Z\\d][a-zA-Z\\d-]{1,13}[a-zA-Z\\d]@{hostname}',
  hostname: '[a-zA-Z]{1,33}\\.[a-z]{2,4}',
  ipv6: '[a-f\\d]{4}(:[a-f\\d]{4}){7}',
  uri: '[a-zA-Z][a-zA-Z0-9+-.]*'
};
/**
 * Generates randomized string basing on a built-in regex format
 *
 * @param coreFormat
 * @returns {string}
 */
function coreFormatGenerator(coreFormat) {
  return utils.randexp(regexps[coreFormat]).replace(/\{(\w+)\}/, function (match, key) {
    return utils.randexp(regexps[key]);
  });
}

function generateFormat(value, invalid) {
  var callback = formatAPI$1(value.format);
  if (typeof callback === 'function') {
    return callback(value);
  }
  switch (value.format) {
    case 'date-time':
      return dateTimeGenerator$1();
    case 'ipv4':
      return ipv4Generator();
    case 'regex':
      // TODO: discuss
      return '.+?';
    case 'email':
    case 'hostname':
    case 'ipv6':
    case 'uri':
      return coreFormatGenerator(value.format);
    default:
      if (typeof callback === 'undefined') {
        if (optionAPI('failOnInvalidFormat')) {
          throw new Error('unknown registry key ' + utils.short(value.format));
        }
        else {
          return invalid();
        }
      }
      throw new Error('unsupported format "' + value.format + '"');
  }
}
var stringType = function stringType(value) {
  var output;
  var minLength = value.minLength;
  var maxLength = value.maxLength;
  if (optionAPI('maxLength')) {
    // Don't allow user to set max length above our maximum
    if (maxLength && maxLength > optionAPI('maxLength')) {
      maxLength = optionAPI('maxLength');
    }
    // Don't allow user to set min length above our maximum
    if (minLength && minLength > optionAPI('maxLength')) {
      minLength = optionAPI('maxLength');
    }
  }
  if (value.format) {
    output = generateFormat(value, function () { return thunkGenerator$1(minLength, maxLength); });
  }
  else if (value.pattern) {
    output = utils.randexp(value.pattern);
  }
  else {
    output = thunkGenerator$1(minLength, maxLength);
  }
  while (output.length < minLength) {
    output += optionAPI('random')() > 0.7 ? thunkGenerator$1() : utils.randexp('.+');
  }
  if (output.length > maxLength) {
    output = output.substr(0, maxLength);
  }
  return output;
};

// var typeMap = {
//     boolean: booleanType,
//     null: nullType,
//     array: arrayType,
//     integer: integerType,
//     number: numberType$1,
//     object: objectType,
//     string: stringType
// };

var typeMap = {
  boolean: () => '@boolean',
  null: nullType,
  array: arrayType,
  integer: () => '@integer',
  number: () => '@natural',
  object: objectType,
  string: () => '@string'
};

// TODO provide types
function traverse(schema, path, resolve) {
  schema = resolve(schema);
  if (!schema) {
    return;
  }
  if (Array.isArray(schema.enum)) {
    return random.pick(schema.enum);
  }
  // thunks can return sub-schemas
  if (typeof schema.thunk === 'function') {
    return traverse(schema.thunk(), path, resolve);
  }
  if (typeof schema.generate === 'function') {
    return utils.typecast(schema.generate(), schema);
  }
  if (optionAPI('useDefaultValue') && 'default' in schema) {
    return schema.default;
  }
  // TODO remove the ugly overcome
  var type = schema.type;
  if (Array.isArray(type)) {
    type = random.pick(type);
  }
  else if (typeof type === 'undefined') {
    // Attempt to infer the type
    type = inferType(schema, path) || type;
  }
  if (typeof type === 'string') {
    if (!typeMap[type]) {
      if (optionAPI('failOnInvalidTypes')) {
        throw new ParseError('unknown primitive ' + utils.short(type), path.concat(['type']));
      }
      else {
        return optionAPI('defaultInvalidTypeProduct');
      }
    }
    else {
      try {
        return utils.clean(typeMap[type](schema, path, resolve, traverse), null, schema.required);
      }
      catch (e) {
        if (typeof e.path === 'undefined') {
          throw new ParseError(e.message, path);
        }
        throw e;
      }
    }
  }
  var copy = {};
  if (Array.isArray(schema)) {
    copy = [];
  }
  for (var prop in schema) {
    if (typeof schema[prop] === 'object' && prop !== 'definitions') {
      copy[prop] = traverse(schema[prop], path.concat([prop]), resolve);
    }
    else {
      copy[prop] = schema[prop];
    }
  }
  return copy;
}

function isKey(prop) {
  return prop === 'enum' || prop === 'default' || prop === 'required' || prop === 'definitions';
}
// TODO provide types
function run(refs, schema, container) {
  try {
    return traverse(schema, [], function reduce(sub, maxReduceDepth) {
      if (typeof maxReduceDepth === 'undefined') {
        maxReduceDepth = random.number(1, 3);
      }
      if (!sub) {
        return null;
      }
      // cleanup
      if (sub.id && typeof sub.id === 'string') {
        delete sub.id;
        delete sub.$schema;
      }
      if (typeof sub.$ref === 'string') {
        if (sub.$ref.indexOf('#/') === -1) {
          var ref = deref.util.findByRef(sub.$ref, refs);
          if (!ref) {
            throw new Error('Reference not found: ' + sub.$ref);
          }
          return ref;
        }
        // just remove the reference
        delete sub.$ref;
        return sub;
      }
      if (Array.isArray(sub.allOf)) {
        var schemas = sub.allOf;
        delete sub.allOf;
        // this is the only case where all sub-schemas
        // must be resolved before any merge
        schemas.forEach(function (subSchema) {
          var _sub = reduce(subSchema, maxReduceDepth + 1);
          // call given thunks if present
          utils.merge(sub, typeof _sub.thunk === 'function'
            ? _sub.thunk()
            : _sub);
        });
      }
      if (Array.isArray(sub.oneOf || sub.anyOf)) {
        var mix = sub.oneOf || sub.anyOf;
        delete sub.anyOf;
        delete sub.oneOf;
        return {
          thunk: function () {
            var copy = utils.merge({}, sub);
            utils.merge(copy, random.pick(mix));
            return copy;
          },
        };
      }
      for (var prop in sub) {
        if ((Array.isArray(sub[prop]) || typeof sub[prop] === 'object') && !isKey(prop)) {
          sub[prop] = reduce(sub[prop], maxReduceDepth);
        }
      }
      return container.wrap(sub);
    });
  }
  catch (e) {
    if (e.path) {
      throw new Error(e.message + ' in ' + '/' + e.path.join('/'));
    }
    else {
      throw e;
    }
  }
}

var container = new Container();
function getRefs(refs) {
  var $refs = {};
  if (Array.isArray(refs)) {
    refs.map(deref.util.normalizeSchema).forEach(function (schema) {
      $refs[schema.id] = schema;
    });
  }
  else {
    $refs = refs || {};
  }
  return $refs;
}
var jsf = function (schema, refs) {
  var $ = deref();
  var $refs = getRefs(refs);
  return run($refs, $(schema, $refs, true), container);
};
jsf.resolve = function (schema, refs, cwd) {
  if (typeof refs === 'string') {
    cwd = refs;
    refs = {};
  }
  // normalize basedir (browser aware)
  cwd = cwd || (typeof process !== 'undefined' ? process.cwd() : '');
  cwd = cwd.replace(/\/+$/, '') + '/';
  var $refs = getRefs(refs);
  // identical setup as json-schema-sequelizer
  var fixedRefs = {
    order: 300,
    canRead: true,
    read: function (file, callback) {
      callback(null, deref.util.findByRef(cwd !== '/'
        ? file.url.replace(cwd, '')
        : file.url, $refs));
    },
  };
  return $RefParser
    .dereference(cwd, schema, {
      resolve: { fixedRefs: fixedRefs },
      dereference: {
        circular: 'ignore',
      },
    }).then(function (sub) { return jsf(sub, refs); });
};
jsf.utils = utils;
jsf.format = formatAPI$1;
jsf.option = optionAPI;
// built-in support
container.define('pattern', utils.randexp);
// returns itself for chaining
jsf.extend = function (name, cb) {
  container.extend(name, cb);
  return jsf;
};
jsf.define = function (name, cb) {
  container.define(name, cb);
  return jsf;
};
jsf.locate = function (name) {
  return container.get(name);
};
var VERSION = "0.5.0-rc11";
jsf.version = VERSION;

module.exports = jsf;