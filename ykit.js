var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin')
var assetsPluginInstance = new AssetsPlugin({
  filename: 'static/prd/assets.js',
  processOutput: function (assets) {
    return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
  }
})
module.exports = {
  plugins: [{
    name: 'antd',
    options: {
      modifyQuery: function (defaultQuery) { // 可查看和编辑 defaultQuery
        defaultQuery.plugins.push('transform-decorators-legacy');
        return defaultQuery;
      }
    }
  }],
  // devtool:  'cheap-source-map',
  config: function (ykit) {
    return {
      exports: [
        './index.js'
      ],
      modifyWebpackConfig: function (baseConfig) {

        baseConfig.devtool = 'cheap-module-eval-source-map'
        baseConfig.context = path.resolve(__dirname, "client");

        baseConfig.output.prd.path = 'static/prd';
        baseConfig.output.prd.publicPath = '';
        baseConfig.output.prd.filename = '[name]@[chunkhash][ext]'
        baseConfig.plugins.push(assetsPluginInstance)

        baseConfig.module.loaders.push({
          test: /\.(sass|scss)$/,
          loader: ykit.ExtractTextPlugin.extract(
            require.resolve('css-loader')
            + '?sourceMap!'
            + require.resolve('fast-sass-loader') + '?sourceMap'
          )
        })
        baseConfig.module.preLoaders.push({
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "eslint-loader"
        });

        return baseConfig;
      }
    }
  },
  server: {
    // true/false，默认 false，效果相当于 ykit server --hot
    hot: true
    // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    // overlay: true
  },
  hooks: {},
  commands: []
};
