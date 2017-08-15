import axios from 'axios';

// Actions
const FETCH_GROUP_LIST = 'yapi/group/FETCH_GROUP_LIST';
const SET_CURR_GROUP = 'yapi/group/SET_CURR_GROUP';
const FETCH_GROUP_MEMBER = 'yapi/group/FETCH_GROUP_MEMBER';

// Reducer
const initialState = {
  groupList: [],
  currGroup: { group_name: '' },
  member: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_LIST: {
      return {
        ...state,
        groupList: action.payload.data.data
      };
    }
    case SET_CURR_GROUP: {
      return {
        ...state,
        currGroup: action.payload
      };
    }
    case FETCH_GROUP_MEMBER: {
      return {
        ...state,
        member: action.payload.data.data
      };
    }

    default:
      return state;
  }
};

// 获取分组成员列表
export function fetchGroupMemberList(id) {
  return {
    type: FETCH_GROUP_MEMBER,
    payload: axios.get('/api/group/get_member_list', {
      params: { id }
    })
  }
}

// Action Creators
export function fetchGroupList() {
  return {
    type: FETCH_GROUP_LIST,
    payload: axios.get('/api/group/list')
  }
}

export function setCurrGroup(group) {
  return {
    type: SET_CURR_GROUP,
    payload: group
  }
}
