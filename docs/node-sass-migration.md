# YApi node-sass 迁移指南（适配高版本 Node.js）

本项目使用的是老旧的打包工具 `ykit@0.6.2`，它在底层强绑定了 Webpack 1（`v1.14.0`）及附带的老旧体系。
当由于升级 Node.js（如 Node 16/18/22 等）导致原生 `node-sass` 无法安装时，**不能激进强制将 `webpack` 升级至 v4 或以上版本**，否则会导致 YApi 自带的一系列基于 Webpack 1 的插件（如 `extract-text-webpack-plugin`）全部崩溃。

正确的兼容迁移策略是“降级引入能调用 Dart Sass 的兼容版 sass-loader”。按照以下方案修改，可以在保留底层业务逻辑不变的前提下，完美运行于高版本 Node 中。

---

## 一、修改 `package.json`

在 `package.json` 中，我们需要替换原本由于 C++ 二进制问题导致安装失败的 `node-sass`，并修复部分由于不支持 Windows 原生的 shell 命令导致的开发运行错位：

1. **移除 `node-sass`，换用 Dart Sass**：
   - 彻底删除 `"node-sass"` 依赖项。
   - 新增：`"sass": "1.78.0"`（或者最新版本的 sass）。
   
2. **锁死 `sass-loader` 兼容版本**：
   必须将 `"sass-loader"` 设置为 `"^7.3.1"`。
   > **原理解析**：`sass-loader` 7.x 既能够向下兼容老古董级的 Webpack 1 / 2，又恰好在这个版本引入了原生如果找不到 `node-sass` 时自动去支持现代纯 JS 版 `sass` 引擎的特性。

3. **修复 Windows 下命令报错**：
   找到 `scripts` 下的 `"dev-copy-icon"`。老旧脚手架用的 `cp -r` 在 Windows CMD 或 PowerShell 是无效的。改为 Node 的跨平台副本命令：
   ```json
   "dev-copy-icon": "node -e \"require('fs-extra').copySync('static/iconfont', 'iconfont')\""
   ```

## 二、修改 `ykit.config.js` （解决 UglifyJs 压缩报错）

在修复了 `sass` 以后，可以进行样式打包了。但 YApi 不小心将后端的模块（`server/yapi.js`）给引到了前面来。由于后端用到了包含 ES6 箭头函数的模块（如 `fs-extra`、`jsonfile`、`nodemailer` 等），这时候老版的 `UglifyJsPlugin` 遇到前端包里的 ES6 语法直接罢工了。

**解决策略：强行阻断所有后端库的预打包导入。**

1. 打开根目录 `ykit.config.js`。
2. 找到 `exports.config = function () { ... modifyWebpackConfig ... }` 中带有判断生产环境的地方：`if (this.env == 'prd')`（或者 `if(this.env == 'prd')`）。
3. 在 `UglifyJsPlugin` 调用**之前**，注入并利用 Webpack 内置的 `IgnorePlugin` 防止后端的 ES6 模块进入前端压缩流，添加以下四行：
   ```javascript
   if (this.env == 'prd') {
     baseConfig.plugins.push(new this.webpack.IgnorePlugin(/server[\\\/]yapi/));
     baseConfig.plugins.push(new this.webpack.IgnorePlugin(/^fs-extra$/));
     baseConfig.plugins.push(new this.webpack.IgnorePlugin(/^jsonfile$/));
     baseConfig.plugins.push(new this.webpack.IgnorePlugin(/^nodemailer$/));
     
     // 下面保留原有的 UglifyJsPlugin 代码...
     baseConfig.plugins.push(
       new this.webpack.optimize.UglifyJsPlugin({
         compress: { warnings: false }
       })
     );
   }
   ```

## 三、额外注意事项：config 编码问题

如果你像示例里一样是从 `config_example.json` 复制得到了和项目平级的 `../config.json`，请**注意去除 BOM 编码和注释**。
建议使用标准的纯文本编辑器（如 VSCode 或 Sublime）保存这个文件，以纯净的 `UTF-8`（不要带 BOM）或 ANSI 保存。
> 如果编码带有 BOM，Webpack 的老版 `json-loader` 会因为头部多出来的零宽度字符导致 `JSON.parse` 直接抛出 `Unexpected token` (not valid JSON) 的致命异常。

按照上述三步操作，可以直接运行 `npm run build-client` 以及跨平台运行 `npm run dev-client`，享受平滑升级！
