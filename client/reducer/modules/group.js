import axios from 'axios';

// Actions
const FETCH_GROUP_LIST = 'yapi/group/FETCH_GROUP_LIST';
const SET_CURR_GROUP = 'yapi/group/SET_CURR_GROUP';
const FETCH_GROUP_MEMBER = 'yapi/group/FETCH_GROUP_MEMBER';
const FETCH_GROUP_MSG = 'yapi/group/FETCH_GROUP_MSG';
const ADD_GROUP_MEMBER = 'yapi/group/ADD_GROUP_MEMBER';
const DEL_GROUP_MEMBER = 'yapi/group/DEL_GROUP_MEMBER';
const CHANGE_GROUP_MEMBER = 'yapi/group/CHANGE_GROUP_MEMBER';
const CHANGE_GROUP_MESSAGE = 'yapi/group/CHANGE_GROUP_MESSAGE';
const UPDATE_GROUP_LIST = 'yapi/group/UPDATE_GROUP_LIST';
const DEL_GROUP = 'yapi/group/DEL_GROUP';

// Reducer
const initialState = {
  groupList: [],
  currGroup: {
    group_name: '',
    group_desc: '',
    custom_field1: {
      name: '',
      enable: false
    }
  },
  field: {
    name: '',
    enable: false
  },
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
    case UPDATE_GROUP_LIST: {
      return {
        ...state,
        groupList: action.payload
      };
    }
    case SET_CURR_GROUP: {
      return {
        ...state,
        currGroup: action.payload.data.data
      };
    }
    case FETCH_GROUP_MEMBER: {
      return {
        ...state,
        member: action.payload.data.data
      };
    }
    case FETCH_GROUP_MSG: {
      console.log(action.payload)
      // const {role,group_name,group_desc,} = action.payload.data.data
      return {
        ...state,
        role: action.payload.data.data.role,
        currGroup: action.payload.data.data,
        field: {
          name: action.payload.data.data.custom_field1.name,
          enable: action.payload.data.data.custom_field1.enable
        }
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
  };
}

// 添加分组成员
export function addMember(param) {
  return {
    type: ADD_GROUP_MEMBER,
    payload: axios.post('/api/group/add_member', param)
  };
}

// 删除分组成员
export function delMember(param) {
  return {
    type: DEL_GROUP_MEMBER,
    payload: axios.post('/api/group/del_member', param)
  };
}

// 修改分组成员权限
export function changeMemberRole(param) {
  return {
    type: CHANGE_GROUP_MEMBER,
    payload: axios.post('/api/group/change_member_role', param)
  };
}

// 修改分组信息
export function changeGroupMsg(param) {
  return {
    type: CHANGE_GROUP_MESSAGE,
    payload: axios.post('/api/group/up', param)
  };
}

// 更新左侧的分组列表
export function updateGroupList(param) {
  return {
    type: UPDATE_GROUP_LIST,
    payload: param
  };
}

// 删除分组
export function deleteGroup(param) {
  return {
    type: DEL_GROUP,
    payload: axios.post('/api/group/del', param)
  };
}

// 获取分组成员列表
export function fetchGroupMemberList(id) {
  return {
    type: FETCH_GROUP_MEMBER,
    payload: axios.get('/api/group/get_member_list', {
      params: { id }
    })
  };
}

// Action Creators
export function fetchGroupList() {
  return {
    type: FETCH_GROUP_LIST,
    payload: axios.get('/api/group/list')
  };
}

export function setCurrGroup(group) {
  return {
    type: SET_CURR_GROUP,
    payload: axios.get('/api/group/get', {
      params: { id: group._id }
    })
  };
}
