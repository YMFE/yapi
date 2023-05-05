process.env.NODE_ENV = 'production'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none',
  output: {
    filename: '[name].[contenthash:8].bundle.js',
    publicPath: '/prd',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {},
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [new CompressionPlugin()],
})

module.exports = prodWebpackConfig
