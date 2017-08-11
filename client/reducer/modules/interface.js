import axios from 'axios'
// Actions
const FETCH_INTERFACE_DATA = 'yapi/interface/FETCH_INTERFACE_DATA';
const FETCH_INTERFACE_LIST = 'yapi/interface/FETCH_INTERFACE_LIST';

// const DELETE_INTERFACE_DATA = 'yapi/interface/DELETE_INTERFACE_DATA';
// const SAVE_INTERFACE_PROJECT_ID = 'yapi/interface/SAVE_INTERFACE_PROJECT_ID';
// const GET_INTERFACE_GROUP_LIST = 'yapi/interface/GET_INTERFACE_GROUP_LIST';

// Reducer
const initialState = {
  curdata: {},
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INTERFACE_DATA:
      return {
        ...state,
        curdata: action.payload.data
      }
    case FETCH_INTERFACE_LIST:
      return {
        ...state,
        list: action.payload.data
      } 
    default:
      return state
  }
}


// Action Creators
export function fetchInterfaceData (interfaceId) {
  return async (dispatch) => {    
    let result = await axios.get('/api/interface/get?id=' + interfaceId);
    dispatch({
      type: FETCH_INTERFACE_DATA,
      payload: result.data 
    })
  }
}

export function fetchInterfaceList(projectId){
  return async (dispatch) => {    
    let result = await axios.get('/api/interface/list?project_id=' + projectId);
    dispatch({
      type: FETCH_INTERFACE_LIST,
      payload: result.data 
    })
  }
}

