import axios from 'axios';
import variable from '../../constants/variable';

// Actions
const FETCH_PROJECT_LIST = 'yapi/project/FETCH_PROJECT_LIST';
const GET_PROJECT_MSG = 'yapi/project/GET_PROJECT_MSG';
const PROJECT_ADD = 'yapi/project/PROJECT_ADD';
const PROJECT_DEL = 'yapi/project/PROJECT_DEL';
// const CHANGE_TABLE_LOADING = 'yapi/project/CHANGE_TABLE_LOADING';
const PROJECT_UPDATE = 'yapi/project/PROJECT_UPDATE';
const GET_CURR_PROJECT = 'yapi/project/GET_CURR_PROJECT'

// Reducer
const initialState = {
  isUpdateModalShow: false,
  handleUpdateIndex: -1,
  projectList: [],
  projectMsg: {},
  userInfo: {},
  tableLoading: true,
  total: 0,
  currPage: 1,
  currProject: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CURR_PROJECT: {
      return {
        ...state,
        currProject: action.payload.data
      }
    }
    // case CHANGE_UPDATE_MODAL: {
    //   return {
    //     ...state,
    //     isUpdateModalShow: action.payload.data,
    //     handleUpdateIndex: action.payload.index
    //   };
    // }
    // case CHANGE_TABLE_LOADING: {
    //   return {
    //     ...state,
    //     tableLoading: action.payload
    //   }
    // }
    case FETCH_PROJECT_LIST: {
      return {
        ...state,
        projectList: action.payload.data.data.list,
        total: action.payload.data.data.total,
        userInfo: action.payload.data.data.userinfo
      };
    }
    case GET_PROJECT_MSG: {
      return {
        ...state,
        projectMsg: action.payload.data.data
      };
    }
    case PROJECT_ADD: {
      return state;
    }
    case PROJECT_DEL: {
      return state;
    }
    default:
      return state;
  }
};

// 获取某分组下的项目列表
export function fetchProjectList(id, pageNum) {
  return {
    type: FETCH_PROJECT_LIST,
    payload: axios.get('/api/project/list', {
      params: {
        group_id: id,
        page: pageNum || 1,
        limit: variable.PAGE_LIMIT
      }
    })
  };
}

// 获取项目信息
export function getProjectMsg(id) {
  return {
    type: GET_PROJECT_MSG,
    payload: axios.get('/api/project/get', {
      params: { id }
    })
  };
}

// export function changeTableLoading(data) {
//   return {
//     type: CHANGE_TABLE_LOADING,
//     payload: data
//   };
// }

export function addProject(data) {
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
    payload: axios.post('/api/project/add', param)
  };
}

export function updateProject(data) {
  const { name, prd_host, basepath, desc, _id, protocol, env } = data;
  const param = {
    name,
    prd_host,
    protocol,
    basepath,
    desc,
    id: _id,
    env
  };
  return {
    type: PROJECT_UPDATE,
    payload: axios.post('/api/project/up', param)
  };
}

export function delProject(id) {
  const param = { id };
  return {
    type: PROJECT_DEL,
    payload: axios.post('/api/project/del', param)
  };
}

export function getProject(id){

  return async (dispatch) => {
    let result = await axios.get('/api/project/get?id=' + id);
    dispatch({
      type: GET_CURR_PROJECT,
      payload: result.data
    })
  }
}
