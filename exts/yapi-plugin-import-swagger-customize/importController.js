const baseController = require('controllers/base.js');
const yapi = require('yapi.js');
const projectModel = require('models/project.js');
const HanldeImportData = require('../../common/HandleImportData');
const tokenModel = require('models/token.js');
const sha = require('sha.js');
const { getToken } = require('utils/token');
const formatData = require('./run');
const axios = require('axios');

class importController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.projectModel = yapi.getInst(projectModel);
    this.tokenModel = yapi.getInst(tokenModel)
  }
  async updateData (ctx) {

    let successMessage;
    let errorMessage = [];
    const requestBody = ctx.request.body;
    const { importType, projectId, cat, swaggerUrl, interfaceName } = requestBody;
    if (!projectId) {
      return (ctx.body = yapi.commons.resReturn(null, 408, '缺少项目Id'));
    }
    const projectData = await this.projectModel.get(projectId);
    const { basePath, uid } = projectData

    const res = await formatData(this.getSwaggerData(swaggerUrl), interfaceName);

    await HanldeImportData(
      res,
      projectId,
      '',
      cat,
      basePath,
      importType === 'add' ? 'normal' : 'merge',
      err => {
        errorMessage.push(err);
      },
      msg => {
        successMessage = msg;
      },
      () => {},
      await this.getProjectToken(projectId, uid),
      yapi.WEBCONFIG.port
    );

    if (errorMessage.length > 0) {
      return (ctx.body = yapi.commons.resReturn(null, 404, errorMessage.join('\n')));
    }
    ctx.body = yapi.commons.resReturn(null, 0, successMessage);

  }

  async getProjectToken(project_id, uid) {
    try {
        let data = await this.tokenModel.get(project_id);
        let token;
        if (!data) {
            let passsalt = yapi.commons.randStr();
            token = sha('sha1')
                .update(passsalt)
                .digest('hex')
                .substr(0, 20);

            await this.tokenModel.save({ project_id, token });
        } else {
            token = data.token;
        }

        token = getToken(token, uid);

        return token;
    } catch (err) {
        return "";
    }
  }

  async getSwaggerData(swaggerUrl) {
    try {
        let response = await axios.get(swaggerUrl);
        if (response.status > 400) {
            throw new Error(`http status "${response.status}"` + '获取数据失败，请确认 swaggerUrl 是否正确')
        }
        return response.data;
    } catch (e) {
        let response = e.response;
        throw new Error(`http status "${response.status}"` + '获取数据失败，请确认 swaggerUrl 是否正确')
    }
}
}

module.exports = importController;