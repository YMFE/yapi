var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = {
    // plugins: ['react', 'es6', 'antd'],
    plugins: ['react', 'qunar', 'es6'],
    devtool:  'cheap-source-map',
    config: {
        exports: [
            './index.js'
        ],
        modifyWebpackConfig: function(baseConfig) {
            baseConfig.context = path.resolve(__dirname, "client");
            baseConfig.watch = true;
            return baseConfig;
        }
    },
    // server: {
    //     hot: true, // true/false，默认 false，效果相当于 ykit server --hot
    //     overlay: true // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    // },
    hooks: {},
    commands: []
};
