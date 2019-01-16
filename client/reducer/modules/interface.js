import axios from 'axios';
// Actions
const INIT_INTERFACE_DATA = 'yapi/interface/INIT_INTERFACE_DATA';
const FETCH_INTERFACE_DATA = 'yapi/interface/FETCH_INTERFACE_DATA';
const FETCH_INTERFACE_LIST_MENU = 'yapi/interface/FETCH_INTERFACE_LIST_MENU';
const DELETE_INTERFACE_DATA = 'yapi/interface/DELETE_INTERFACE_DATA';
const DELETE_INTERFACE_CAT_DATA = 'yapi/interface/DELETE_INTERFACE_CAT_DATA';
const UPDATE_INTERFACE_DATA = 'yapi/interface/UPDATE_INTERFACE_DATA';
const CHANGE_EDIT_STATUS = 'yapi/interface/CHANGE_EDIT_STATUS';
const FETCH_INTERFACE_LIST = 'yapi/interface/FETCH_INTERFACE_LIST';
const SAVE_IMPORT_DATA = 'yapi/interface/SAVE_IMPORT_DATA';
const FETCH_INTERFACE_CAT_LIST = 'yapi/interface/FETCH_INTERFACE_CAT_LIST';
// const SAVE_INTERFACE_PROJECT_ID = 'yapi/interface/SAVE_INTERFACE_PROJECT_ID';
// const GET_INTERFACE_GROUP_LIST = 'yapi/interface/GET_INTERFACE_GROUP_LIST';

// Reducer
const initialState = {
  curdata: {},
  list: [],
  editStatus: false, // 记录编辑页面是否有编辑,
  totalTableList: [],
  catTableList: [],
  count: 0,
  totalCount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_INTERFACE_DATA:
      return initialState;
    case UPDATE_INTERFACE_DATA:
      return {
        ...state,
        curdata: Object.assign({}, state.curdata, action.updata)
      };
    case FETCH_INTERFACE_DATA:
      return {
        ...state,
        curdata: action.payload.data.data
      };
    case FETCH_INTERFACE_LIST_MENU:
      return {
        ...state,
        list: action.payload.data.data
      };
    case CHANGE_EDIT_STATUS: {
      return {
        ...state,
        editStatus: action.status
      };
    }

    case FETCH_INTERFACE_LIST: {
      return {
        ...state,
        totalTableList: action.payload.data.data.list,
        totalCount: action.payload.data.data.count
      };
    }

    case FETCH_INTERFACE_CAT_LIST: {
      return {
        ...state,
        catTableList: action.payload.data.data.list,
        count: action.payload.data.data.count
      };
    }
    default:
      return state;
  }
};

// 记录编辑页面是否有编辑
export function changeEditStatus(status) {
  return {
    type: CHANGE_EDIT_STATUS,
    status
  };
}

export function initInterface() {
  return {
    type: INIT_INTERFACE_DATA
  };
}

export function updateInterfaceData(updata) {
  return {
    type: UPDATE_INTERFACE_DATA,
    updata: updata,
    payload: true
  };
}

export async function deleteInterfaceData(id) {
  let result = await axios.post('/api/interface/del', { id: id });
  return {
    type: DELETE_INTERFACE_DATA,
    payload: result
  };
}

export async function saveImportData(data) {
  let result = await axios.post('/api/interface/save', data);
  return {
    type: SAVE_IMPORT_DATA,
    payload: result
  };
}

export async function deleteInterfaceCatData(id) {
  let result = await axios.post('/api/interface/del_cat', { catid: id });
  return {
    type: DELETE_INTERFACE_CAT_DATA,
    payload: result
  };
}

// Action Creators
export async function fetchInterfaceData(interfaceId) {
  let result = await axios.get('/api/interface/get?id=' + interfaceId);
  return {
    type: FETCH_INTERFACE_DATA,
    payload: result
  };
}

export async function fetchInterfaceListMenu(projectId) {
  let result = await axios.get('/api/interface/list_menu?project_id=' + projectId);
  return {
    type: FETCH_INTERFACE_LIST_MENU,
    payload: result
  };
}

export async function fetchInterfaceList(params) {
  let result = await axios.get('/api/interface/list', { params });
  return {
    type: FETCH_INTERFACE_LIST,
    payload: result
  };
}

export async function fetchInterfaceCatList(params) {
  let result = await axios.get('/api/interface/list_cat', { params });
  return {
    type: FETCH_INTERFACE_CAT_LIST,
    payload: result
  };
}
