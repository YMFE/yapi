import axios from 'axios';

// Actions
const GET_FOLLOW_LIST = 'yapi/follow/GET_FOLLOW_LIST';
const DEL_FOLLOW = 'yapi/follow/DEL_FOLLOW';
const ADD_FOLLOW = 'yapi/follow/ADD_FOLLOW';

// Reducer
const initialState = {
  data: []
};

export default (state = initialState, action) => {
  if (action.type === GET_FOLLOW_LIST) {
    return {
      ...state,
      data: action.payload.data.data
    };
  } else {
    return state;
  }
};

// 获取关注列表
export function getFollowList(uid) {
  return {
    type: GET_FOLLOW_LIST,
    payload: axios.get('/api/follow/list', {
      params: { uid }
    })
  };
}

// 添加关注
export function addFollow(param) {
  return {
    type: ADD_FOLLOW,
    payload: axios.post('/api/follow/add', param)
  };
}

// 删除关注
export function delFollow(id) {
  return {
    type: DEL_FOLLOW,
    payload: axios.post('/api/follow/del', { projectid: id })
  };
}
