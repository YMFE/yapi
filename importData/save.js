/*
 * @Author: edenhliu
 * @Date: 2018-08-31 19:34:58
 * @Last Modified by: edenhliu
 * @Last Modified time: 2018-09-02 15:58:42
 */
const chalk = require('chalk');
const axios = require('axios');
const { imdocHeader: headers } = require('./authorization');

const baseURL = 'http://127.0.0.1:9001';
/**
 * @typedef Cat Object
 * @property name string
 * @property children number
 * @property creator string
 *
 */
/**
 * @typedef Group Object
 * @property _id string
 * @property group_name string
 * @property group_desc string
 * @property uid number
 * @property members Array<number>
 * @property type string public private
 *
 */
function findGroup(name) {
  return axios({
    headers,
    method: 'get',
    baseURL,
    url: '/api/group/list',
  })
    .then(r => r.data.data)
    .then(data => {
      // // console.log('TCL: findGroup -> data', data);
      return data.find(i => i.group_name === name);
    });
}
function findProject(group_id, name) {
  // console.log('TCL: findProject -> group_id', group_id);
  // console.log('TCL: findProject -> name', name);
  return axios({
    headers,
    method: 'get',
    baseURL,
    url: '/api/project/list',
    params: {
      group_id,
    },
  })
    .then(({ data }) => {
      // console.log('TCL: findProject -> data', data);
      if (data.errcode) {
        return Promise.reject(Error(data.errmsg));
      }
      return data.data.list;
    })
    .then(data => {
      // // console.log('TCL: findGroup -> data', data);
      return data.find(i => i.name === name);
    });
}

/**
 * @param {Cat} cat
 */
function saveGroup(cat) {
  return axios({
    headers,
    method: 'post',
    baseURL,
    url: '/api/group/add',
    data: {
      group_name: cat.name,
      group_desc: '',
    },
  })
    .then(r => {
      if (r.data.errcode) {
        return findGroup(cat.name);
      }
      return r.data.data;
    })
    .then(data => {
      console.log(chalk.green('saveGroup:'), data._id, data.group_name);
      return data;
    });
}

function saveProject(group_id, project) {
  return axios({
    headers,
    method: 'post',
    baseURL,
    url: '/api/project/add',
    data: {
      group_id,
      name: project.name,
      desc: '',
      icon: 'code-o',
      color: 'yellow',
      project_type: 'public',
    },
  })
    .then(({ data }) => {
      if (data.errcode) {
        return findProject(group_id, project.name);
      }
      return data.data;
    })
    .then(data => {
      console.log(chalk.green('saveProject'), data._id, data.name);
      updateEnv(data._id, `${project.protocol || 'http'}://${project.cgi}`);
      return getProject(data._id);
    });
}
function getProject(id) {
  return axios({
    headers,
    method: 'get',
    baseURL,
    url: '/api/project/get',
    params: {
      id,
    },
  }).then(({ data }) => {
    if (data.errcode) {
      return Promise.reject(data.errmsg);
    }
    return data.data;
  });
}
function saveInterface({ _id: project_id, cat }, detail) {
  const params = {
    project_id,
    catid: cat[0]._id,
    ...detail,
  };
  params.path = params.path.replace(/[^\d\w-/_:.!]/g, '');
  return axios({
    headers,
    method: 'post',
    baseURL,
    url: '/api/interface/add',
    data: params,
  })
    .then(({ data }) => {
      if (data.errcode) {
        console.log(chalk.yellow(`${detail.path}:${data.errmsg}`));
      }
      return data.data;
    })
    .then(data => {
      return data;
    });
}
function updateEnv(project_id, domain) {
  return axios({
    headers,
    method: 'post',
    baseURL,
    url: '/api/project/up_env',
    data: {
      id: project_id,
      env: [{ name: 'public', domain, header: [], global: [] }],
    },
  })
    .then(({ data }) => {
      if (data.errcode) {
        return Promise.reject(Error(data.errmsg));
      }
      return data.data;
    })
    .then(data => {
      console.log(chalk.green('updateEnv'), data);
      return data;
    });
}
module.exports = {
  saveGroup,
  saveProject,
  saveInterface,
};
