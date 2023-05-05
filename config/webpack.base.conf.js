const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
var fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const resolve = dir => path.resolve(__dirname, '../', dir)

var commonLib = require('../common/plugin.js')
function createScript(plugin, pathAlias) {
  let options = plugin.options ? JSON.stringify(plugin.options) : null
  if (pathAlias === 'node_modules') {
    return `"${plugin.name}" : {module: require('yapi-plugin-${plugin.name}/client.js'),options: ${options}}`
  }
  return `"${plugin.name}" : {module: require('${pathAlias}/yapi-plugin-${plugin.name}/client.js'),options: ${options}}`
}

function initPlugins(configPlugin) {
  configPlugin = require('../config.json').plugins
  var systemConfigPlugin = require('../common/config.js').exts

  var scripts = []
  if (configPlugin && Array.isArray(configPlugin) && configPlugin.length) {
    configPlugin = commonLib.initPlugins(configPlugin, 'plugin')
    configPlugin.forEach(plugin => {
      if (plugin.client && plugin.enable) {
        scripts.push(createScript(plugin, 'node_modules'))
      }
    })
  }

  systemConfigPlugin = commonLib.initPlugins(systemConfigPlugin, 'ext')
  systemConfigPlugin.forEach(plugin => {
    if (plugin.client && plugin.enable) {
      scripts.push(createScript(plugin, 'exts'))
    }
  })

  scripts = 'module.exports = {' + scripts.join(',') + '}'
  fs.writeFileSync(resolve('./client/plugin-module.js'), scripts)
}

initPlugins()

module.exports = {
  entry: './client/index.js',
  output: {
    path: resolve('static/prd'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(@leeonfield\/json-schema-editor-visual)\/).*/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(sc|sa)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
              hmr: devMode,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
              hmr: devMode,
            },
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#4285F4',
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new HtmlWebpackPlugin({
      template: resolve('./static/index.html'),
    }),
    devMode && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 400000,
      cacheGroups: {
        commons: {
          chunks: 'all',
          minChunks: 2,
          name: 'commons',
          maxInitialRequests: 5,
        },
        npmVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1]
            return `npm.${packageName.replace('@', '')}`
          },
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.css', '.json', '.string', '.tpl'],
    alias: {
      common: resolve('common'),
      client: resolve('client'),
      exts: resolve('exts'),
    },
  },
}
