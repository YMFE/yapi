import {
  FETCH_PROJECT_LIST,
  PROJECT_ADD,
  PROJECT_DEL,
  CHANGE_UPDATE_MODAL,
  PROJECT_UPDATE,
  CHANGE_TABLE_LOADING
} from '../constants/action-types.js';
import axios from 'axios';
import variable from '../constants/variable';

const fetchProjectList = (id, pageNum) => {
  return {
    type: FETCH_PROJECT_LIST,
    payload: axios.get('/project/list', {
      params: {
        group_id: id,
        page: pageNum,
        limit: variable.PAGE_LIMIT
      }
    })
  };
};

const changeUpdateModal = (data, index) => {
  return {
    type: CHANGE_UPDATE_MODAL,
    payload: { data, index }
  };
};

const changeTableLoading = (data) => {
  return {
    type: CHANGE_TABLE_LOADING,
    payload: data
  };
};

const addProject = (data) => {
  const { name, prd_host, basepath, desc, group_id, protocol } = data;
  const param = {
    name,
    prd_host,
    protocol,
    basepath,
    desc,
    group_id
  };
  return {
    type: PROJECT_ADD,
    // payload 可以返回 Promise，异步请求使用 axios 即可
    payload: axios.post('/project/add', param)
  };
};

const updateProject = (data) => {
  const { name, prd_host, basepath, desc, _id, protocol } = data;
  const param = {
    name,
    prd_host,
    protocol,
    basepath,
    desc,
    id: _id
  };
  return {
    type: PROJECT_UPDATE,
    // payload 可以返回 Promise，异步请求使用 axios 即可
    payload: axios.post('/project/up', param)
  };
};

const delProject = (id) => {
  const param = { id };
  return {
    type: PROJECT_DEL,
    // payload 可以返回 Promise，异步请求使用 axios 即可
    payload: axios.post('/project/del', param)
  };
};

export default {
  fetchProjectList,
  addProject,
  delProject,
  changeUpdateModal,
  updateProject,
  changeTableLoading
};
