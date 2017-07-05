var path = require('path');

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
                test: /\.(sass|scss)$/,
                loader: 'style-loader!css-loader!sass-loader'
            });

            baseConfig.watch = true;
            return baseConfig;
        }
    },
    server: {
        hot: true, // true/false，默认 false，效果相当于 ykit server --hot
        overlay: true // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    },
    hooks: {},
    commands: []
};
