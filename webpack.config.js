const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  // context: 如果不通过path.resolve 配置入口访问路径 watch: true失效
  context: path.resolve('./client'),

  entry: {
    index: './index.js',
  },

  output: {
    // filename: 编译的文件名 仅用于命名每个文件
    // [name]: 多入口形式 入口文件名替换这里的name 
    // [chunkhash: num]: 入口文件的hash值 用于修改后清空缓存
    // filename: '[name].[chunkhash:3].js',
    filename: './[name].js',
    // 包存放的目录
    path: path.resolve('./build'),
  },
  // target: 'node',
  // externals: [nodeExternals()],
  module: {
  	noParse: /\.css$/,
  	
    rules: [
      {
        test: /\.scss$/,
        use: [
        	{
            loader: "style-loader"
        	}, 
        	{
            loader: "css-loader"
        	},
        	{
            loader: "sass-loader"
        	}
        ]
    	},
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }              
        }
      }
    ]
  },
  
  watch: true
}

