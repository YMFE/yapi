import axios from 'axios';
import { message } from 'antd'

// Actions
const FETCH_GROUP_LIST = 'yapi/group/FETCH_GROUP_LIST';
const SET_CURR_GROUP = 'yapi/group/SET_CURR_GROUP';

// Reducer
const initialState = {
  groupList: [],
  currGroup: { group_name: '' }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_LIST: {
      if (action.payload.data.errcode) {
        message.error(action.payload.data.errmsg);
      } else {
        return {
          ...state,
          groupList: action.payload.data.data
        };
      }
      return state;
    }
    case SET_CURR_GROUP: {
      return {
        ...state,
        currGroup: action.payload
      };
    }

    default:
      return state;
  }
};

// Action Creators
export function fetchGroupList() {
  return {
    type: FETCH_GROUP_LIST,
    payload: axios.get('/group/list')
  }
}

export function setCurrGroup(group) {
  return {
    type: SET_CURR_GROUP,
    payload: group
  }
}
