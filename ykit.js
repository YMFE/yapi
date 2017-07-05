const path = require('path');

module.exports = {
  plugins: ['react', 'es6', 'antd'],
  devtool:  'cheap-source-map',
  config: {
    exports: [
      './index.js'
    ],
    modifyWebpackConfig: function(baseConfig) {
      console.log(path.resolve(__dirname, "client"))
      baseConfig.context = path.resolve(__dirname, "client");
      baseConfig.watch = true;
      return baseConfig;
    }
  },
  server: {
    hot: true,
    overlay: true
  },
  hooks: {},
  commands: []
};
