
const baseController = require('controllers/base.js');
const wikiModel = require('./wikiModel.js');
const groupModel = require('models/group.js');
const projectModel = require('models/project.js');
const interfaceModel = require('models/interface.js');
const interfaceCaseModel = require('models/interfaceCase.js');

const yapi = require('yapi.js');


class wikiController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.Model = yapi.getInst(wikiModel);
    this.groupModel = yapi.getInst(groupModel);
    this.projectModel = yapi.getInst(projectModel);
    this.interfaceModel = yapi.getInst(interfaceModel);
    this.interfaceCaseModel = yapi.getInst(interfaceCaseModel);
  }

  /**
   * 获取wiki信息
   * @interface wiki_desc/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
  async getWikiDesc(ctx) {
    try {
      let project_id = ctx.request.query.project_id;
      if (!project_id) {
        return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
      }
      let result = await this.Model.get(project_id)
      return ctx.body = yapi.commons.resReturn(result);
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }

  /**
   * 保存wiki信息
   * @interface wiki_desc/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */

  async uplodaWikiDesc(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        desc: 'string',
        markdown: 'string'
      });
      console.log(params)
      if (!params.project_id) {
        return ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空');
      }
      if(!this.$tokenAuth){
        let auth = await this.checkAuth(params.project_id, 'project', 'edit')
        if (!auth) {
          return ctx.body = yapi.commons.resReturn(null, 400, '没有权限');
        }
      }

      // 如果当前数据库里面没有数据
      let result = await this.Model.get(params.project_id)
      if(!result) {
        let data = Object.assign(params, {
          username: this.getUsername(),
          add_time: yapi.commons.time(),
          up_time: yapi.commons.time()
        });

        let res = await this.Model.save(data);
        return ctx.body = yapi.commons.resReturn(res);
      }

      // console.log('result', result);
      let data = Object.assign(params, {
        username: this.getUsername(),
        up_time: yapi.commons.time()
      });
      let upRes = await this.Model.up(result._id, data);
      // let upRes = await this.Model.get(result._id)
      return (ctx.body = yapi.commons.resReturn(upRes));
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }

  }

 
}

module.exports = wikiController;
