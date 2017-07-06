var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = {
    plugins: ['react', 'es6', 'antd'],
    devtool:  'cheap-source-map',
    config: {
        exports: [
            './index.js'
        ],
        modifyWebpackConfig: function(baseConfig) {
            // edit ykit's Webpack configs
            baseConfig.context = path.resolve(__dirname, "client");

            baseConfig.module.loaders.push({
              test: /\.scss$/,
              // loader: extractCSS.extract(['css','sass'])
              loader: 'style-loader!css-loader!sass-loader'
            });

            // baseConfig.plugins = baseConfig.plugins.concat([extractCSS])

            // baseConfig.watch = true;
            // console.log(baseConfig)
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
