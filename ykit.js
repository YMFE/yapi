var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var assetsPluginInstance = new AssetsPlugin({
  filename: 'static/prd/assets.js',
  processOutput: function (assets) {
    return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
  }
})
var config = require('../config.json');

var compressPlugin = new CompressionPlugin({
  asset: "[path].gz[query]",
  algorithm: "gzip",
  test: /\.(js|css)$/,
  threshold: 10240,
  minRatio: 0.8
});

function fileExist (filePath){
  try {
      return fs.statSync(filePath).isFile();
  } catch (err) {
      return false;
  }
};

function initPlugins(){
  var scripts = [] ;
  if(config.plugins && Array.isArray(config.plugins) && config.plugins.length){
    config.plugins = config.plugins.filter(item=>{
      return fileExist(path.resolve(__dirname, 'node_modules/yapi-plugin-' + item + '/client.js'))
    })
    config.plugins.forEach((plugin)=>{
      scripts.push(`${plugin} : require('plugins/yapi-plugin-${plugin}/client.js')`)
    })
    scripts = "module.exports = {" + scripts.join(",") + "}";
    fs.writeFileSync('client/plugin-module.js', scripts);
  }else{
    fs.writeFileSync('client/plugin-module.js', 'module.exports = {}');
  }
}

initPlugins();


module.exports = {
  plugins: [{
    name: 'antd',
    options: {
      modifyQuery: function (defaultQuery) { // 可查看和编辑 defaultQuery
        defaultQuery.plugins = [];
        defaultQuery.plugins.push(["transform-runtime", {
          "polyfill": false,
          "regenerator": true
        }]);
        defaultQuery.plugins.push('transform-decorators-legacy');
        defaultQuery.plugins.push(["import", { libraryName: "antd"}])
        return defaultQuery;
      },
      exclude: /node_modules\/(?!yapi-plugin)/
    }    
  }],
  // devtool:  'cheap-source-map',
  config: function (ykit) {
    return {
      exports: [  
        './index.js'
      ],
      commonsChunk: {
        vendors: {
          lib: ['react', 'redux',
            'redux-thunk',
            'react-dom',
            'redux-promise',
            'react-router',
            'react-router-dom',
            'prop-types',
            'axios',
            'moment',
            'react-dnd-html5-backend',
            'react-dnd',
            'reactabular-table',
            'reactabular-dnd',
            'table-resolver'
          ],
          lib2: [
            'brace',
            'mockjs',
            'json5',
            'url'
          ]
        }
      },
      modifyWebpackConfig: function (baseConfig) {

        var ENV_PARAMS = {};
        switch (this.env) {
          case 'local':
            ENV_PARAMS = 'dev';
            break;
          case 'dev':
            ENV_PARAMS = 'dev';
            break;
          case 'prd':
            ENV_PARAMS = 'production';
            break;
          default:
        }

        baseConfig.plugins.push(new this.webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(ENV_PARAMS),
          'process.env.config': JSON.stringify(config)
        }))

        //初始化配置
        baseConfig.devtool = 'cheap-module-eval-source-map'
        baseConfig.context = path.resolve(__dirname, './client');
        baseConfig.resolve.alias.client = '/client';
        baseConfig.resolve.alias.common = '/common';
        baseConfig.resolve.alias.plugins = '/node_modules';
        baseConfig.resolve.alias.exts = '/exts';
        baseConfig.output.prd.path = 'static/prd';
        baseConfig.output.prd.publicPath = '';
        baseConfig.output.prd.filename = '[name]@[chunkhash][ext]'

       
        
        baseConfig.module.loaders.push({
          test: /\.less$/,
          loader: ykit.ExtractTextPlugin.extract(
            require.resolve('style-loader'),
            require.resolve('css-loader')
            + '?sourceMap!'
            + require.resolve('less-loader') + '?sourceMap'
          )
        })
        baseConfig.module.loaders.push({
          test: /\.(sass|scss)$/,
          loader: ykit.ExtractTextPlugin.extract(
            require.resolve('css-loader')
            + '?sourceMap!'
            + require.resolve('fast-sass-loader-china') + '?sourceMap'
          )
        })
        baseConfig.module.preLoaders.push({
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        });

        if (this.env == 'prd') {
          baseConfig.plugins.push(assetsPluginInstance)
          baseConfig.plugins.push(compressPlugin)

        }
        return baseConfig;
      }
    }
  },
  server: {
    // true/false，默认 false，效果相当于 ykit server --hot
    hot: true,
    // true/false，默认 false，开启后可在当前打开的页面提示打包错误
    overlay: false
  },
  hooks: {},
  commands: []
};
