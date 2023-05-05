import { message } from 'antd'

function improtData(importDataModule) {
  async function run(res) {
    try {
      // let interfaceData = { apis: [], cats: [] };
      res = JSON.parse(res)
      return res
      // res.forEach(item => {
      //   interfaceData.cats.push({
      //     name: item.name,
      //     desc: item.desc
      //   });
      //   item.list.forEach(api => {
      //     api.catname = item.name;
      //   });
      //   interfaceData.apis = interfaceData.apis.concat(item.list);
      // });
      // return interfaceData;
    } catch (e) {
      console.error(e)
      message.error('数据格式有误')
    }
  }

  if (!importDataModule || typeof importDataModule !== 'object') {
    console.error('importDataModule 参数Must be Object Type')
    return null
  }

  importDataModule.json = {
    name: 'JSON',
    run: run,
    desc: '落兵台接口 JSON 数据导入',
  }
}

module.exports = function() {
  this.bindHook('import_data', improtData)
}
