const fs = require('fs');
const sysPath = require('path');
const css = fs.readFileSync(sysPath.join(__dirname, './defaultTheme.css'));
module.exports = '<style>' + css + '</style>';
