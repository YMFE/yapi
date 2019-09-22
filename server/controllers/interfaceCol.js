const interfaceColModel = require('../models/interfaceCol.js');
const interfaceCaseModel = require('../models/interfaceCase.js');
const interfaceCaseReferModel = require('../models/interfaceCaseRefer.js');
const interfaceModel = require('../models/interface.js');
const projectModel = require('../models/project.js');
const baseController = require('./base.js');
const yapi = require('../yapi.js');
const _ = require('underscore');

class interfaceColController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.colModel = yapi.getInst(interfaceColModel);
    this.caseModel = yapi.getInst(interfaceCaseModel);
    this.interfaceModel = yapi.getInst(interfaceModel);
    this.projectModel = yapi.getInst(projectModel);
    this.referModel = yapi.getInst(interfaceCaseReferModel);
  }


  
  /**
   * 获取该用例的所有映射的集合
   * @interface /col/referColListByCase
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Number} project_id 不能为空
   * @param {Number} refer_caseid 用例id
   * @returns {Object}
   * @example 
   */
  async referColListByCase(ctx) {
    try { 
      let { project_id, case_id} = ctx.request.body;
   
      let project = await this.projectModel.getBaseInfo(project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }
      let resultList = await this.referModel.referColList(project_id, case_id);
      
      for (let i = 0; i < resultList.length; i++) {
        resultList[i] = resultList[i].toObject(); 
        resultList[i].child_type = 0;
      }
      ctx.body = yapi.commons.resReturn(resultList);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 增加映射
   * @interface /col/addRefer
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Number} project_id
   * @param {Number} refer_caseid
   * @param {Number} col_id
   * @returns {Object}
   * @example
   */

  async addRefer(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        refer_caseid: 'number',
        col_id: 'number'
      });

      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }
      if (!params.refer_caseid) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '映射的用例id不能为空'));
      }
      if (!params.col_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '映射的测试集不能为空'));
      }

      let auth = await this.checkAuth(params.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      let result = await this.referModel.save({
        project_id: params.project_id,
        col_id:  params.col_id,
        refer_caseid: params.refer_caseid,
        uid: this.getUid(),
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time()
      });
      let username = this.getUsername();
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 添加了用例的映射 <a href="/project/${
          params.project_id
        }/interface/col/${result._id}">${params.name}</a>`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: params.project_id,
        col_id: params.col_id,
        refer_caseid: params.refer_caseid
      });
      // this.projectModel.up(params.project_id,{up_time: new Date().getTime()}).then();
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 删除一个映射用例
   * @interface /col/deleteReferCaseById
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Number} referId 映射id
   * @returns {Object}
   * @example
   */

  async deleteReferCaseById(ctx) {
    try {
      let { referId, } = ctx.request.body;
      let referData = await this.referModel.get(referId);
      if (!referData) {
        ctx.body = yapi.commons.resReturn(null, 400, '不存在的映射id');
      }

      if (referData.uid !== this.getUid()) {
        let auth = await this.checkAuth(referData.project_id, 'project', 'danger');
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
        }
      }

      let result = await this.referModel.del(referId);

      let username = this.getUsername();
      let colData = this.colModel.get(referData.col_id);
      let caseData = this.caseModel.get(referData.refer_caseid);
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了接口集 <a href="/project/${
          referData.project_id
        }/interface/col/${referData.col_id}">${colData.name}</a> 下的接口映射 ${caseData.casename}`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: referData.project_id
        });
      return (ctx.body = yapi.commons.resReturn(result));
    } catch (e) {
      yapi.commons.resReturn(null, 400, e.message);
    }
  }



   /**
   * 解除所有映射用例
   * @interface /col/deleteAllReferCase
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Number} refer_caseid 用例id
   * @returns {Object}
   * @example
   */

  async deleteAllReferCase(ctx) {
    try {
      let { refer_caseid } = ctx.request.body;
      let caseData= await this.caseModel.get(refer_caseid);
      if (!caseData) {
        ctx.body = yapi.commons.resReturn(null, 400, '不存在的用例refer_caseid');
      }
      console.info("9999999")
      if (caseData.uid !== this.getUid()) {
        let auth = await this.checkAuth(caseData.project_id, 'project', 'danger');
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
        }
      }

      let result = await this.referModel.delAllByCaseid(caseData.project_id,refer_caseid);
      console.info("8888888",result)
     
      let username = this.getUsername();
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了用例 <a href="/project/${
          caseData.project_id
        }/interface/case/${refer_caseid}">${caseData.casename}</a> 的所有接口映射`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: caseData.project_id,
        });
      return (ctx.body = yapi.commons.resReturn(result));
    } catch (e) {
      yapi.commons.resReturn(null, 400, e.message);
    }
  }
// -----------------------

  /**
   * 获取所有接口集
   * @interface /col/list
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String} project_id email名称，不能为空
   * @returns {Object}
   * @example
   */
  async list(ctx) {
    try {
      let { project_id, parent_id} = ctx.query;
      let project = await this.projectModel.getBaseInfo(project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }
    
      // 由于添加了子目录，该接口修改成返回子目录列表和接口用例列表、映射列表
      let colList = await this.colModel.list(project_id, parent_id),
      caseList =await this.caseModel.list(parent_id),
      referList = await this.referModel.caseReferListByCol(project_id, parent_id),
      newColList = [],
      newInterfaceCaseList = [],
      newReferList = [];

      // 标记分类文件夹
      for (let i = 0; i < colList.length; i++ ) {
        newColList[i] = colList[i].toObject(); 
        newColList[i].child_type = 0;
        newColList[i].children = [];
      }
      // 标记接口
      for (let j = 0 ; j < caseList.length; j++ ) {
        let item = caseList[j].toObject();
        let interfaceData = await this.interfaceModel.getBaseinfo(item.interface_id);
        item.path = interfaceData.path;
        newInterfaceCaseList[j] = item;
        newInterfaceCaseList[j].child_type = 1;
      }

      // 标记映射
      for (let k = 0 ; k < referList.length; k++ ) {
        let item = referList[k].toObject();
        let caseData = await this.caseModel.get(item.refer_caseid);
        let interfaceData = await this.interfaceModel.getBaseinfo(caseData.interface_id);
        item.path = interfaceData.path;
        item.casename = caseData.casename;
        newReferList[k] = item;
        newReferList[k].child_type = 2;
      }

      

      let result = [...newColList, ...newInterfaceCaseList, ...newReferList];


      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 增加接口集
   * @interface /col/add_col
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Number} project_id
   * @param {String} name
   * @param {String} desc
   * @returns {Object}
   * @example
   */

  async addCol(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        name: 'string',
        project_id: 'number',
        parent_id: 'number',
        desc: 'string'
      });

      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }
      if (!params.name) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '名称不能为空'));
      }

      let auth = await this.checkAuth(params.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      let result = await this.colModel.save({
        name: params.name,
        project_id: params.project_id,
        parent_id:  params.parent_id || -1,
        desc: params.desc,
        uid: this.getUid(),
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time()
      });
      let username = this.getUsername();
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 添加了接口集 <a href="/project/${
          params.project_id
        }/interface/col/${result._id}">${params.name}</a>`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: params.project_id,
        parent_id: params.parent_id
      });
      // this.projectModel.up(params.project_id,{up_time: new Date().getTime()}).then();
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 获取一个接口集下的所有的测试用例
   * @interface /col/case_list
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String} col_id 接口集id
   * @returns {Object}
   * @example
   */
  async getCaseList(ctx) {
    try {
      let id = ctx.query.col_id;
      if (!id || id == 0) {
        return (ctx.body = yapi.commons.resReturn(null, 407, 'col_id不能为空'));
      }

      let colData = await this.colModel.get(id);
      console.log("hahhhahaha", colData)
      let project = await this.projectModel.getBaseInfo(colData.project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }

      ctx.body = await yapi.commons.getCaseList(id);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 获取一个接口集下的所有的测试用例的环境变量
   * @interface /col/case_env_list
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String} col_id 接口集id
   * @returns {Object}
   * @example
   */
  async getCaseEnvList(ctx) {
    try {
      let id = ctx.query.col_id;
      if (!id || id == 0) {
        return (ctx.body = yapi.commons.resReturn(null, 407, 'col_id不能为空'));
      }

      let colData = await this.colModel.get(id);
      let project = await this.projectModel.getBaseInfo(colData.project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }

      // 通过col_id 找到 caseList
      let projectList = await this.caseModel.list(id, 'project_id');
      // 对projectList 进行去重处理
      projectList = this.unique(projectList, 'project_id');

      // 遍历projectList 找到项目和env
      let projectEnvList = [];
      for (let i = 0; i < projectList.length; i++) {
        let result = await this.projectModel.getBaseInfo(projectList[i], 'name  env');
        projectEnvList.push(result);
      }
      ctx.body = yapi.commons.resReturn(projectEnvList);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  requestParamsToObj(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return {};
    }
    let obj = {};
    arr.forEach(item => {
      obj[item.name] = '';
    });
    return obj;
  }

  /**
   * 获取一个接口集下的所有的测试用例
   * @interface /col/case_list_by_var_params
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String} col_id 接口集id
   * @returns {Object}
   * @example
   */

  async getCaseListByVariableParams(ctx) {
    try {
      let id = ctx.query.col_id;
      if (!id || id == 0) {
        return (ctx.body = yapi.commons.resReturn(null, 407, 'col_id不能为空'));
      }
      let resultList = await this.caseModel.list(id, 'all');
      if (resultList.length === 0) {
        return (ctx.body = yapi.commons.resReturn([]));
      }
      let project = await this.projectModel.getBaseInfo(resultList[0].project_id);

      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }

      for (let index = 0; index < resultList.length; index++) {
        let result = resultList[index].toObject();
        let item = {},
          body,
          query,
          bodyParams,
          pathParams;
        let data = await this.interfaceModel.get(result.interface_id);
        if (!data) {
          await this.caseModel.del(result._id);
          continue;
        }
        item._id = result._id;
        item.casename = result.casename;
        body = yapi.commons.json_parse(data.res_body);
        body = typeof body === 'object' ? body : {};
        if (data.res_body_is_json_schema) {
          body = yapi.commons.schemaToJson(body, {
            alwaysFakeOptionals: true
          });
        }
        item.body = Object.assign({}, body);
        query = this.requestParamsToObj(data.req_query);
        pathParams = this.requestParamsToObj(data.req_params);
        if (data.req_body_type === 'form') {
          bodyParams = this.requestParamsToObj(data.req_body_form);
        } else {
          bodyParams = yapi.commons.json_parse(data.req_body_other);
          if (data.req_body_is_json_schema) {
            bodyParams = yapi.commons.schemaToJson(bodyParams, {
              alwaysFakeOptionals: true
            });
          }
          bodyParams = typeof bodyParams === 'object' ? bodyParams : {};
        }
        item.params = Object.assign(pathParams, query, bodyParams);
        item.index = result.index;
        resultList[index] = item;
      }

      ctx.body = yapi.commons.resReturn(resultList);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 增加一个测试用例
   * @interface /col/add_case
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {String} casename
   * @param {Number} col_id
   * @param {Number} project_id
   * @param {String} domain
   * @param {String} path
   * @param {String} method
   * @param {Object} req_query
   * @param {Object} req_headers
   * @param {String} req_body_type
   * @param {Array} req_body_form
   * @param {String} req_body_other
   * @returns {Object}
   * @example
   */

  async addCase(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        casename: 'string',
        project_id: 'number',
        col_id: 'number',
        interface_id: 'number',
        case_env: 'string'
      });

      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }

      if (!params.interface_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '接口id不能为空'));
      }

      let auth = await this.checkAuth(params.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      if (!params.col_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '接口集id不能为空'));
      }

      if (!params.casename) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '用例名称不能为空'));
      }

      params.uid = this.getUid();
      params.index = 0;
      params.add_time = yapi.commons.time();
      params.up_time = yapi.commons.time();
      let result = await this.caseModel.save(params);
      let username = this.getUsername();

      this.colModel.get(params.col_id).then(col => {
        yapi.commons.saveLog({
          content: `<a href="/user/profile/${this.getUid()}">${username}</a> 在接口集 <a href="/project/${
            params.project_id
          }/interface/col/${params.col_id}">${col.name}</a> 下添加了测试用例 <a href="/project/${
            params.project_id
          }/interface/case/${result._id}">${params.casename}</a>`,
          type: 'project',
          uid: this.getUid(),
          username: username,
          typeid: params.project_id
        });
      });
      this.projectModel.up(params.project_id, { up_time: new Date().getTime() }).then();

      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  async addCaseList(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        col_id: 'number'
      });
      if (!params.interface_list || !Array.isArray(params.interface_list)) {
        return (ctx.body = yapi.commons.resReturn(null, 400, 'interface_list 参数有误'));
      }

      if (!params.project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }

      let auth = await this.checkAuth(params.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      if (!params.col_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '接口集id不能为空'));
      }

      let data = {
        uid: this.getUid(),
        index: 0,
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time(),
        project_id: params.project_id,
        col_id: params.col_id
      };

      for (let i = 0; i < params.interface_list.length; i++) {
        let interfaceData = await this.interfaceModel.get(params.interface_list[i]);

        if (!interfaceData) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '不能导入空目录'));
        }

        data.interface_id = params.interface_list[i];
        data.casename = interfaceData.title;

        // 处理json schema 解析
        if (
          interfaceData.req_body_type === 'json' &&
          interfaceData.req_body_other &&
          interfaceData.req_body_is_json_schema
        ) {
          let req_body_other = yapi.commons.json_parse(interfaceData.req_body_other);
          req_body_other = yapi.commons.schemaToJson(req_body_other, {
            alwaysFakeOptionals: true
          });

          data.req_body_other = JSON.stringify(req_body_other);
        } else {
          data.req_body_other = interfaceData.req_body_other;
        }

        data.req_body_type = interfaceData.req_body_type;
        let caseResultData = await this.caseModel.save(data);
        let username = this.getUsername();
        this.colModel.get(params.col_id).then(col => {
          yapi.commons.saveLog({
            content: `<a href="/user/profile/${this.getUid()}">${username}</a> 在接口集 <a href="/project/${
              params.project_id
            }/interface/col/${params.col_id}">${col.name}</a> 下导入了测试用例 <a href="/project/${
              params.project_id
            }/interface/case/${caseResultData._id}">${data.casename}</a>`,
            type: 'project',
            uid: this.getUid(),
            username: username,
            typeid: params.project_id
          });
        });
      }

      this.projectModel.up(params.project_id, { up_time: new Date().getTime() }).then();

      ctx.body = yapi.commons.resReturn('ok');
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  async cloneCaseList(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        project_id: 'number',
        col_id: 'number',
        new_col_id: 'number'
      });

      const { project_id, col_id, new_col_id } = params;

      if (!project_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
      }

      let auth = await this.checkAuth(params.project_id, 'project', 'edit');

      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      if (!col_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '被克隆的接口集id不能为空'));
      }

      if (!new_col_id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '克隆的接口集id不能为空'));
      }

      let oldColCaselistData = await this.caseModel.list(col_id, 'all');

      oldColCaselistData = oldColCaselistData.sort((a, b) => {
        return a.index - b.index;
      });

      const newCaseList = [];
      const oldCaseObj = {};
      let obj = {};

      const handleTypeParams = (data, name) => {
        let res = data[name];
        const type = Object.prototype.toString.call(res);
        if (type === '[object Array]' && res.length) {
          res = JSON.stringify(res);
          try {
            res = JSON.parse(handleReplaceStr(res));
          } catch (e) {
            console.log('e ->', e);
          }
        } else if (type === '[object String]' && data[name]) {
          res = handleReplaceStr(res);
        }
        return res;
      };

      const handleReplaceStr = str => {
        if (str.indexOf('$') !== -1) {
          str = str.replace(/\$\.([0-9]+)\./g, function(match, p1) {
            p1 = p1.toString();
            return `$.${newCaseList[oldCaseObj[p1]]}.` || '';
          });
        }
        return str;
      };

      // 处理数据里面的$id;
      const handleParams = data => {
        data.col_id = new_col_id;
        delete data._id;
        delete data.add_time;
        delete data.up_time;
        delete data.__v;
        data.req_body_other = handleTypeParams(data, 'req_body_other');
        data.req_query = handleTypeParams(data, 'req_query');
        data.req_params = handleTypeParams(data, 'req_params');
        data.req_body_form = handleTypeParams(data, 'req_body_form');
        return data;
      };

      for (let i = 0; i < oldColCaselistData.length; i++) {
        obj = oldColCaselistData[i].toObject();
        // 将被克隆的id和位置绑定
        oldCaseObj[obj._id] = i;
        let caseData = handleParams(obj);
        let newCase = await this.caseModel.save(caseData);
        newCaseList.push(newCase._id);
      }

      this.projectModel.up(params.project_id, { up_time: new Date().getTime() }).then();
      ctx.body = yapi.commons.resReturn('ok');
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 更新一个测试用例
   * @interface /col/up_case
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {number} id
   * @param {String} casename
   * @param {String} domain
   * @param {String} path
   * @param {String} method
   * @param {Object} req_query
   * @param {Object} req_headers
   * @param {String} req_body_type
   * @param {Array} req_body_form
   * @param {String} req_body_other
   * @returns {Object}
   * @example
   */

  async upCase(ctx) {
    try {
      let params = ctx.request.body;
      params = yapi.commons.handleParams(params, {
        id: 'number',
        casename: 'string'
      });

      if (!params.id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '用例id不能为空'));
      }

      // if (!params.casename) {
      //   return (ctx.body = yapi.commons.resReturn(null, 400, '用例名称不能为空'));
      // }

      let caseData = await this.caseModel.get(params.id);
      let auth = await this.checkAuth(caseData.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }

      params.uid = this.getUid();

      //不允许修改接口id和项目id
      delete params.interface_id;
      delete params.project_id;
      let result = await this.caseModel.up(params.id, params);
      let username = this.getUsername();
      this.colModel.get(caseData.col_id).then(col => {
        yapi.commons.saveLog({
          content: `<a href="/user/profile/${this.getUid()}">${username}</a> 在接口集 <a href="/project/${
            caseData.project_id
          }/interface/col/${caseData.col_id}">${col.name}</a> 更新了测试用例 <a href="/project/${
            caseData.project_id
          }/interface/case/${params.id}">${params.casename || caseData.casename}</a>`,
          type: 'project',
          uid: this.getUid(),
          username: username,
          typeid: caseData.project_id
        });
      });

      this.projectModel.up(caseData.project_id, { up_time: new Date().getTime() }).then();

      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 402, e.message);
    }
  }

  /**
   * 获取一个测试用例详情
   * @interface /col/case
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String} caseid
   * @returns {Object}
   * @example
   */

  async getCase(ctx) {
    try {
      let id = ctx.query.caseid;
      let result = await this.caseModel.get(id);
      if (!result) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '不存在的case'));
      }
      result = result.toObject();
      let data = await this.interfaceModel.get(result.interface_id);
      if (!data) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '找不到对应的接口，请联系管理员'));
      }
      data = data.toObject();

      let projectData = await this.projectModel.getBaseInfo(data.project_id);
      result.path = projectData.basepath + data.path;
      result.method = data.method;
      result.req_body_type = data.req_body_type;
      result.req_headers = yapi.commons.handleParamsValue(data.req_headers, result.req_headers);
      result.res_body = data.res_body;
      result.res_body_type = data.res_body_type;
      result.req_body_form = yapi.commons.handleParamsValue(
        data.req_body_form,
        result.req_body_form
      );
      result.req_query = yapi.commons.handleParamsValue(data.req_query, result.req_query);
      result.req_params = yapi.commons.handleParamsValue(data.req_params, result.req_params);
      result.interface_up_time = data.up_time;
      result.req_body_is_json_schema = data.req_body_is_json_schema;
      result.res_body_is_json_schema = data.res_body_is_json_schema;
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }

  /**
   * 更新一个接口集name或描述
   * @interface /col/up_col
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {String} name
   * @param {String} desc
   * @returns {Object}
   * @example
   */

  async upCol(ctx) {
    try {
      let params = ctx.request.body;
      let id = params.col_id;
      if (!id) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '缺少 col_id 参数'));
      }
      let colData = await this.colModel.get(id);
      if (!colData) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '不存在'));
      }
      let auth = await this.checkAuth(colData.project_id, 'project', 'edit');
      if (!auth) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
      }
      delete params.col_id;
      let result = await this.colModel.up(id, params);
      let username = this.getUsername();
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 更新了测试集合 <a href="/project/${
          colData.project_id
        }/interface/col/${id}">${colData.name}</a> 的信息`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: colData.project_id
      });

      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }

  /**
   * 更新多个接口case index
   * @interface /col/up_case_index
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Array}  [id, index]
   * @returns {Object}
   * @example
   */

  async upCaseIndex(ctx) {
    try {
      let params = ctx.request.body;
      if (!params || !Array.isArray(params)) {
        ctx.body = yapi.commons.resReturn(null, 400, '请求参数必须是数组');
      }
      params.forEach(item => {
        if (item.id) {
          this.caseModel.upCaseIndex(item.id, item.index).then(
            res => {},
            err => {
              yapi.commons.log(err.message, 'error');
            }
          );
        }
      });

      return (ctx.body = yapi.commons.resReturn('成功！'));
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }

  /**
   * 更新多个测试集合 index
   * @interface /col/up_col_index
   * @method POST
   * @category col
   * @foldnumber 10
   * @param {Array}  [id, index]
   * @returns {Object}
   * @example
   */

  async upColIndex(ctx) {
    try {
      let params = ctx.request.body;
      if (!params || !Array.isArray(params)) {
        ctx.body = yapi.commons.resReturn(null, 400, '请求参数必须是数组');
      }
      params.forEach(item => {
        if (item.id) {
          this.colModel.upColIndex(item.id, item.index).then(
            res => {},
            err => {
              yapi.commons.log(err.message, 'error');
            }
          );
        }
      });

      return (ctx.body = yapi.commons.resReturn('成功！'));
    } catch (e) {
      ctx.body = yapi.commons.resReturn(null, 400, e.message);
    }
  }

  /**
   * 删除一个接口集
   * @interface /col/del_col
   * @method GET
   * @category col
   * @foldnumber 10
   * @param {String}
   * @returns {Object}
   * @example
   */

  async delCol(ctx) {
    try {
      let id = ctx.query.col_id;
      let colData = await this.colModel.get(id);
      if (!colData) {
        ctx.body = yapi.commons.resReturn(null, 400, '不存在的id');
      }

      if (colData.uid !== this.getUid()) {
        let auth = await this.checkAuth(colData.project_id, 'project', 'danger');
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
        }
      }
      let result = await this.colModel.del(id);
      await this.caseModel.delByCol(id);
      let username = this.getUsername();
      yapi.commons.saveLog({
        content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了接口集 ${
          colData.name
        } 及其下面的接口`,
        type: 'project',
        uid: this.getUid(),
        username: username,
        typeid: colData.project_id
      });
      return (ctx.body = yapi.commons.resReturn(result));
    } catch (e) {
      yapi.commons.resReturn(null, 400, e.message);
    }
  }

  /**
   *
   * @param {*} ctx
   */

  async delCase(ctx) {
    try {
      let caseid = ctx.query.caseid;
      let caseData = await this.caseModel.get(caseid);
      if (!caseData) {
        ctx.body = yapi.commons.resReturn(null, 400, '不存在的caseid');
      }

      if (caseData.uid !== this.getUid()) {
        let auth = await this.checkAuth(caseData.project_id, 'project', 'danger');
        if (!auth) {
          return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
        }
      }

      let result = await this.caseModel.del(caseid);

      let username = this.getUsername();
      this.colModel.get(caseData.col_id).then(col => {
        yapi.commons.saveLog({
          content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了接口集 <a href="/project/${
            caseData.project_id
          }/interface/col/${caseData.col_id}">${col.name}</a> 下的接口 ${caseData.casename}`,
          type: 'project',
          uid: this.getUid(),
          username: username,
          typeid: caseData.project_id
        });
      });

      this.projectModel.up(caseData.project_id, { up_time: new Date().getTime() }).then();
      return (ctx.body = yapi.commons.resReturn(result));
    } catch (e) {
      yapi.commons.resReturn(null, 400, e.message);
    }
  }

  async runCaseScript(ctx) {
    let params = ctx.request.body;
    ctx.body = await yapi.commons.runCaseScript(params, params.col_id, params.interface_id, this.getUid());
  }

  // 数组去重
  unique(array, compare) {
    let hash = {};
    let arr = array.reduce(function(item, next) {
      hash[next[compare]] ? '' : (hash[next[compare]] = true && item.push(next));
      // console.log('item',item.project_id)
      return item;
    }, []);
    // 输出去重以后的project_id
    return arr.map(item => {
      return item[compare];
    });
  }

  
  /**
   * 查询分类集合
   * @interface /col/queryColAndInterfaceCase
   * @method post
   * @category col
   * @foldnumber 10
   * @param {Number}   project_id 项目id，不能为空
   * @param {String}   query_text 查询字符串，不能为空
   * @returns {Object}
   * @example ./api/col/queryColAndInterfaceCase
   */

  async queryColAndInterfaceCase(ctx) {
    let project_id = ctx.params.project_id;
    let query_text = ctx.params.query_text;
    
    if (!project_id || isNaN(project_id)) {
      return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
    }

    // if (!query_text || query_text =='') {
    //   return (ctx.body = yapi.commons.resReturn(null, 400, '查询内容不能为空'));
    // }
    try {
      let project = await this.projectModel.getBaseInfo(project_id);
      if (project.project_type === 'private') {
        if ((await this.checkAuth(project._id, 'project', 'view')) !== true) {
          return (ctx.body = yapi.commons.resReturn(null, 406, '没有权限'));
        }
      }

      let colList = await this.colModel.list(project_id, undefined, query_text),
      caseList =await this.caseModel.list(),
      newColList = [],
      newInterfaceCaseList = [];
 
      // 标记分类文件夹 模糊匹配
      for (let i = 0; i < colList.length; i++ ) {
        let obj = colList[i].toObject();
        obj.child_type = 0;
        obj.children = [];
        newColList.push(obj); 
      }
      // 标记接口 模糊匹配
      for (let i = 0 ; i < caseList.length; i++ ) {
        let item = caseList[i].toObject();
        let interfaceData = await this.interfaceModel.getBaseinfo(item.interface_id);
        const { path } = interfaceData;
        const { casename } = item;
        if(casename.indexOf(query_text) > -1 || path.indexOf(query_text) > -1 ) {
          let obj = item;
          obj.child_type = 1;
          newInterfaceCaseList.push(obj); 
        }
      }
      let result;
      if(query_text !== '') {
        result= [ ...newColList, ...newInterfaceCaseList]
      } else {
        result= [ ...newColList]
      }
      ctx.body = yapi.commons.resReturn(result);
    } catch (e) {
      yapi.commons.resReturn(null, 400, e.message);
    }
  }

}

module.exports = interfaceColController;
