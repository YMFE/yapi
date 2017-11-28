import axios from 'axios';
import variable from '../../constants/variable';

// Actions
const FETCH_PROJECT_LIST = 'yapi/project/FETCH_PROJECT_LIST';
const GET_PROJECT_MSG = 'yapi/project/GET_PROJECT_MSG';
const PROJECT_ADD = 'yapi/project/PROJECT_ADD';
const PROJECT_DEL = 'yapi/project/PROJECT_DEL';
// const CHANGE_TABLE_LOADING = 'yapi/project/CHANGE_TABLE_LOADING';
const PROJECT_UPDATE = 'yapi/project/PROJECT_UPDATE';
const PROJECT_UPDATE_ENV = 'yapi/project/PROJECT_UPDATE_ENV';
const PROJECT_UPSET = 'yapi/project/PROJECT_UPSET';
const GET_CURR_PROJECT = 'yapi/project/GET_CURR_PROJECT'
const GET_PEOJECT_MEMBER = 'yapi/project/GET_PEOJECT_MEMBER';
const ADD_PROJECT_MEMBER = 'yapi/project/ADD_PROJECT_MEMBER';
const DEL_PROJECT_MEMBER = 'yapi/project/DEL_PROJECT_MEMBER';
const CHANGE_PROJECT_MEMBER = 'yapi/project/CHANGE_PROJECT_MEMBER';

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
  console.log(id);
  return {
    type: GET_PROJECT_MSG,
    payload: axios.get('/api/project/get', {
      params: { id }
    })
  };
}

// 添加项目成员
export function addMember(param) {
  return {
    type: ADD_PROJECT_MEMBER,
    payload: axios.post('/api/project/add_member', param)
  }
}

// 删除项目成员
export function delMember(param) {
  return {
    type: DEL_PROJECT_MEMBER,
    payload: axios.post('/api/project/del_member', param)
  }
}

// 修改项目成员权限
export function changeMemberRole(param) {
  return {
    type: CHANGE_PROJECT_MEMBER,
    payload: axios.post('/api/project/change_member_role', param)
  }
}

// 获取项目成员列表
export function getProjectMemberList(id) {
  return {
    type: GET_PEOJECT_MEMBER,
    payload: axios.get('/api/project/get_member_list', {
      params: { id }
    })
  }
}

// export function changeTableLoading(data) {
//   return {
//     type: CHANGE_TABLE_LOADING,
//     payload: data
//   };
// }

export function addProject(data) {
  const { name, prd_host, basepath, desc, group_id, group_name, protocol, icon, color, project_type } = data;
  const param = {
    name,
    prd_host,
    protocol,
    basepath,
    desc,
    group_id,
    group_name,
    icon,
    color,
    project_type
  };
  return {
    type: PROJECT_ADD,
    payload: axios.post('/api/project/add', param)
  };
}

// 修改项目
export function updateProject(data) {
  const { name, project_type, basepath, desc, _id, env, group_id } = data;
  const param = {
    name,
    project_type,
    basepath,
    desc,
    id: _id,
    env,
    group_id
  };
  return {
    type: PROJECT_UPDATE,
    payload: axios.post('/api/project/up', param)
  };
}

// 修改项目环境配置
export function updateEnv(data) {
  const { env, _id } = data;
  const param = {
    id: _id,
    env
  };
  return {
    type: PROJECT_UPDATE_ENV,
    payload: axios.post('/api/project/up_env', param)
  };
}

// 修改项目头像
export function upsetProject(param) {
  return {
    type: PROJECT_UPSET,
    payload: axios.post('/api/project/upset', param)
  };
}

// 删除项目
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
