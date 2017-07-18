import {
  FETCH_PROJECT_LIST,
  PROJECT_ADD
} from '../constants/action-types.js';
import axios from 'axios';

const fetchProjectList = (data) => {
  return {
    type: FETCH_PROJECT_LIST,
    payload: axios.get('/project/list', {params: data})
  }
}

const addProject = (data) => {
  const { name, prd_host, basepath, desc, group_id } = data;
  const param = {
    name,
    prd_host,
    basepath,
    desc,
    group_id
  }
  return {
    type: PROJECT_ADD,
    // payload 可以返回 Promise，异步请求使用 axios 即可
    payload: axios.post('/project/add', param)
  }
}

export default {
  fetchProjectList,
  addProject
}
