import axios from 'axios';

// Actions
const FETCH_GROUP_LIST = 'yapi/group/FETCH_GROUP_LIST';
const SET_CURR_GROUP = 'yapi/group/SET_CURR_GROUP';
const FETCH_GROUP_MEMBER = 'yapi/group/FETCH_GROUP_MEMBER';
const FETCH_GROUP_MSG = 'yapi/group/FETCH_GROUP_MSG';
const ADD_GROUP_MEMBER = 'yapi/group/ADD_GROUP_MEMBER';
const DEL_GROUP_MEMBER = 'yapi/group/DEL_GROUP_MEMBER';

// Reducer
const initialState = {
  groupList: [],
  currGroup: { group_name: '' },
  member: [],
  role: ''
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
    case FETCH_GROUP_MSG: {
      return {
        ...state,
        role: action.payload.data.data.role
      };
    }

    default:
      return state;
  }
};

// 获取 group 信息 (权限信息)
export function fetchGroupMsg(id) {
  return {
    type: FETCH_GROUP_MSG,
    payload: axios.get('/api/group/get', {
      params: { id }
    })
  }
}

// 添加项目分组成员
export function addMember(param) {
  return {
    type: ADD_GROUP_MEMBER,
    payload: axios.post('/api/group/add_member', param)
  }
}

// 删除项目分组成员
export function delMember(param) {
  return {
    type: DEL_GROUP_MEMBER,
    payload: axios.post('/api/group/del_member', param)
  }
}

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
