import axios from 'axios';

// Actions
const GET_FOLLOW_LIST = 'yapi/follow/GET_FOLLOW_LIST';

// Reducer
const initialState = {
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOW_LIST: {
      console.log(action);
      return {
        ...state,
        data: action.payload.data.data
      };
    }

    default:
      return state;
  }
};

// Action Creators
export function getFollowList(uid) {
  return {
    type: GET_FOLLOW_LIST,
    payload: axios.get('/api/follow/list', {
      params: { uid }
    })
  }
}
