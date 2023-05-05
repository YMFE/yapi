process.env.NODE_ENV = 'development'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval',
  output: {
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  devServer: {
    port: '4000',
    proxy: [
      {
        context: ['/api', '/login', '/logout', '/mock', '/static', '/image'],
        target: 'http://127.0.0.1:20568',
        ws: true,
      },
    ],
    clientLogLevel: 'trace',
    host: '0.0.0.0',
    hot: true,
    open: true,
    historyApiFallback: true,
  },
})

module.exports = devWebpackConfig
