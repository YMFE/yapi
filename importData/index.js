/* eslint-disable no-await-in-loop */

const chalk = require('chalk');
const getData = require('./get');
const saveData = require('./save');
const parser = require('./parser');

let apiCount = 0;
let groupCount = 0;
let projectCount = 0;
async function processGroup(oldGroup) {
  const newGroup = await saveData.saveGroup(oldGroup);
  const result = await getData.getProject(oldGroup.name);

  for (let i = 0; i < result.length; i++) {
    const oldProject = result[i];
    const newProject = await saveData.saveProject(newGroup._id, oldProject);
    const interfaces = await getData.getInterface(oldProject._id);
    for (let j = 0; j < interfaces.length; j++) {
      const iface = interfaces[j];
      iface.data.length = 1; // 清理其他版本，只需要最后一个版本
      const req = parser.parserInterface(iface);
      await saveData.saveInterface(newProject, req);
      apiCount++;
    }
    projectCount++;
  }
  groupCount++;
}

getData.getCats().then(async list => {
  for (let i = 0; i < list.length; i++) {
    const cat = list[i];
    await processGroup(cat);
  }
  console.log(chalk.blue(`成功导入${groupCount}个组`));
  console.log(chalk.blue(`成功导入${projectCount}个项目`));
  console.log(chalk.blue(`成功导入${apiCount}个接口`));
});
