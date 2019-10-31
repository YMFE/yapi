import { message } from 'antd';
import run from './run';

module.exports = function() {
  this.bindHook('import_data', function(importDataModule) {
    if (!importDataModule || typeof importDataModule !== 'object') {
      console.error('importDataModule 参数Must be Object Type');
      return null;
    }
    importDataModule.swagger = {
      name: 'Swagger',
      run: async function(res) {
        try {
          return await run(res);
        } catch (err) {
          console.error(err);
          message.error('解析失败');
        }
      },
      desc: `<p>Swagger数据导入（ 支持 v2.0+ ）</p>
      <p>
        <a target="_blank" href="https://hellosean1025.github.io/yapi/documents/data.html#通过命令行导入接口数据">通过命令行导入接口数据</a>
      </p>
      `
    };
  });
};
