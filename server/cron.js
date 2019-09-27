const moment = require('moment');
const sha = require('sha.js');
const axios = require('axios').default;
const yapi = require('./yapi.js');
const { getToken } = require('./utils/token');
const { importDataCronJobModel, interfaceCatModel, projectModel, tokenModel } = require('./models');
const importDataToYApi = require('../common/HandleImportData');

const importDataModule = {};
yapi.emitHook('import_data', importDataModule);

const importDataCronJobInst = yapi.getInst(importDataCronJobModel);
const interfaceCatInst = yapi.getInst(interfaceCatModel);
const projectInst = yapi.getInst(projectModel);
const tokenInst = yapi.getInst(tokenModel);

setInterval(async () => {
  try {
    const jobs = await importDataCronJobInst.getRunnableJobs();
    await Promise.all(
      jobs.map(async job => {
        await importDataCronJobInst.update(job._id, {
          running: true,
          next_run_at: moment().unix() + job.interval
        });
        switch (job.source.type) {
          case 'swagger':
            if (importDataModule.swagger) {
              const { data: swaggerData } = await axios.get(job.source.url);
              if (swaggerData != null && typeof swaggerData === 'object') {
                const [yapiData, catList, projectData, token] = await Promise.all([
                  importDataModule.swagger(swaggerData),
                  interfaceCatInst.list(job.target.project_id),
                  projectInst.get(job.target.project_id),
                  getProjectToken(job.target.project_id, job.uid)
                ]);
                // 分类存在时导入；分类不存在时删除任务
                if (catList.find(cat => cat._id === job.target.cat_id)) {
                  await importDataToYApi(
                    yapiData,
                    job.target.project_id,
                    job.target.cat_id,
                    catList,
                    projectData.basePath,
                    job.mode,
                    () => {},
                    () => {},
                    () => {},
                    token,
                    yapi.WEBCONFIG.port
                  );
                } else {
                  await importDataCronJobInst.delete(job._id);
                }
              }
            }
            break;
          default:
            break;
        }
        await importDataCronJobInst.update(job._id, {
          running: false
        });
      })
    );
  } catch(err) {
    console.log(err);
  }
}, 1000 * 60);

async function getProjectToken(project_id, uid) {
  let token;

  const data = await tokenInst.get(project_id);
  if (!data) {
    const passsalt = yapi.commons.randStr();
    token = sha('sha1')
      .update(passsalt)
      .digest('hex')
      .substr(0, 20);
    await tokenInst.save({ project_id, token });
  } else {
    token = data.token;
  }

  token = getToken(token, uid);

  return token
}