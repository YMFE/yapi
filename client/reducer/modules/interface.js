import axios from 'axios'
// Actions
const FETCH_INTERFACE_DATA = 'yapi/interface/FETCH_INTERFACE_DATA';
const FETCH_INTERFACE_LIST = 'yapi/interface/FETCH_INTERFACE_LIST';
const CHANGE_INTERFACE_ID = 'yapi/interface/CHANGE_INTERFACE_ID';
const ADD_INTERFACE_DATA = 'yapi/interface/ADD_INTERFACE_DATA';
const DELETE_INTERFACE_DATA = 'yapi/interface/DELETE_INTERFACE_DATA';
const UPDATE_INTERFACE_DATA = 'yapi/interface/UPDATE_INTERFACE_DATA';
// const SAVE_INTERFACE_PROJECT_ID = 'yapi/interface/SAVE_INTERFACE_PROJECT_ID';
// const GET_INTERFACE_GROUP_LIST = 'yapi/interface/GET_INTERFACE_GROUP_LIST';

// Reducer
const initialState = {
  interfaceId: 0,
  curdata: {},
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_INTERFACE_DATA:
      return {
        ...state,
        curdata: action.updata
      }
    case DELETE_INTERFACE_DATA:
      return (() => {

        let newlist = state.list.filter(data => data._id !== action.payload), newid, curdata;

        if (state.interfaceId === action.payload && state.list.length > 0) {
          newid = state.list[0]._id
          curdata = state.list[0]
        } else if (state.list.length == 0) {
          newid = 0;
          curdata = {}
        }

        return {
          ...state,
          curdata: curdata,
          interfaceId: newid,
          list: newlist
        }
      })()

    case ADD_INTERFACE_DATA:
      return {
        ...state,
        curdata: action.payload,
        list: [].concat(state.list, action.payload),
        interfaceId: action.payload._id
      }
    case CHANGE_INTERFACE_ID:
      return {
        ...state,
        interfaceId: action.payload
      }
    case FETCH_INTERFACE_DATA:
      return {
        ...state,
        curdata: action.payload.data
      }
    case FETCH_INTERFACE_LIST:
      return {
        ...state,
        list: action.payload.data,
        curdata: action.payload.data.length > 0 ? action.payload.data[0] :  {}
      }
    default:
      return state
  }
}

export function changeInterfaceId(id) {
  return {
    type: CHANGE_INTERFACE_ID,
    payload: id
  }
}

export function updateInterfaceData(updata) {

  return {
    type: UPDATE_INTERFACE_DATA,
    updata: updata,
    payload: true
  }


}

export async function deleteInterfaceData(id) {
  await axios.post('/api/interface/del', { id: id })
  return {
    type: DELETE_INTERFACE_DATA,
    payload: id
  }
}

// Action Creators
export async function fetchInterfaceData(interfaceId) {
  let result = await axios.get('/api/interface/get?id=' + interfaceId);
  return {
    type: FETCH_INTERFACE_DATA,
    payload: result.data
  }
}

export async function fetchInterfaceList(projectId) {
  let result = await axios.get('/api/interface/list?project_id=' + projectId);
  return {
    type: FETCH_INTERFACE_LIST,
    payload: result.data
  }
}

export async function addInterfaceData(data) {
  return {
    type: ADD_INTERFACE_DATA,
    payload: data
  }
}