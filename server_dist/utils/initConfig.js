'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs-extra');
var config = require('../config.js');

var runtimePath = config.runtime_path;
fs.ensureDirSync(runtimePath);
fs.ensureDirSync(path.join(runtimePath, 'log'));
var configPath = path.join(runtimePath, 'config.json');

fs.writeFileSync(configPath, (0, _stringify2.default)(config, null, '\t'), { encoding: 'utf8' });