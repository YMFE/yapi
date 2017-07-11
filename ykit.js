var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  plugins: [{
    name: 'qunar',
    options: {
      eslint: true,
      configFile: path.resolve(__dirname, "./client/.eslintrc.js")
    }
  }, {
    name: 'antd',
    options: {
      modifyQuery: function(defaultQuery) { // 可查看和编辑 defaultQuery
        defaultQuery.plugins.push('transform-decorators-legacy');
        return defaultQuery;
      }
    }
  }],
  devtool:  'cheap-source-map',
  config: {
    exports: [
      './index.js'
    ],
    modifyWebpackConfig: function(baseConfig) {
      baseConfig.context = path.resolve(__dirname, "client");
      return baseConfig;
    }
  },
  server: {
    // true/false，默认 false，效果相当于 ykit server --hot
    hot: true,
    // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    overlay: true
  },
  hooks: {},
  commands: []
};
