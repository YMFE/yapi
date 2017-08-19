import axios from 'axios';

// Actions
const GET_FOLLOW_LIST = 'yapi/follow/GET_FOLLOW_LIST';
const DEL_FOLLOW = 'yapi/follow/DEL_FOLLOW';

// Reducer
const initialState = {
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOW_LIST: {
      return {
        ...state,
        data: action.payload.data.data
      };
    }
    default:
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
  }
}

//
export function delFollow(id) {
  return {
    type: DEL_FOLLOW,
    payload: axios.post('/api/follow/del', { id })
  }
}
