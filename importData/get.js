const axios = require('axios');
const { linkStartHeader: headers } = require('./authorization');
const baseURL = 'http://linkstar2.oa.com';

function getCats() {
  return axios({
    baseURL,
    method: 'get',
    url: '/cgi/menu/fetch',
    headers,
    data: {},
  }).then(r => r.data.list);
}

function getProject(name) {
  return axios({
    baseURL,
    method: 'get',
    url: '/cgi/project/fetch',
    headers,
    params: {
      menuName: name,
      fetchType: 2,
    },
  }).then(r => r.data.list);
}
function getInterface(pid) {
  return axios({
    baseURL,
    method: 'get',
    url: '/cgi/interface/fetch',
    headers,
    params: {
      start: 0,
      end: 10000,
      pid,
    },
  }).then(r=>r.data.list)
}
module.exports = {
  getCats,
  getProject,
  getInterface,
};
