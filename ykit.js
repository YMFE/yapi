module.exports = {
    plugins: ['react', 'es6', 'antd'],
    devtool:  'cheap-source-map',
    config: {
        exports: [
            './scripts/index.js',
            './styles/index.css'
        ],
        modifyWebpackConfig: function(baseConfig) {
            // edit ykit's Webpack configs 
            baseConfig.watch = true;
            console.log(baseConfig)
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
