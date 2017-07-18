import {
  PROJECT_ADD
} from '../constants/action-types.js';
import axios from 'axios';

const addProject = (data) => {
  const { name, prd_host, basepath, desc } = data;
  const param = {
    name,
    prd_host,
    basepath,
    desc
  }
  console.log(param);
  return {
    type: PROJECT_ADD,
    // payload 可以返回 Promise，异步请求使用 axios 即可
    payload: axios.post('/project/add', param)
  }
}

export default {
  addProject
}
