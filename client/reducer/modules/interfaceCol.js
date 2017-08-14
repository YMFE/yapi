import axios from 'axios'
// Actions
const FETCH_INTERFACE_COL_LIST = 'yapi/interfaceCol/FETCH_INTERFACE_COL_LIST';
const FETCH_INTERFACE_CASE_LIST = 'yapi/interfaceCol/FETCH_INTERFACE_CASE_LIST';

// Reducer
const initialState = {
  interfaceColList: [{
    _id: 0,
    name: '',
    uid: 0,
    project_id: 0,
    desc: '',
    add_time: 0,
    up_time: 0,
    interfaceCaseList: [
      {}
    ]
  }],
  isShowCol: true,
  currInterfaceColId: 0,
  currInterfaceCaseId: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INTERFACE_COL_LIST:
      return {
        ...state,
        interfaceColList: action.payload.data.data
      }
    case FETCH_INTERFACE_CASE_LIST: {
      const interfaceCaseList = state.interfaceColList.map(col => {
        if (col._id === state.currInterfaceColId) {
          return col.interfaceCaseList = action.payload.data.data;
        }
        return col;
      })
      return {
        ...state,
        interfaceCaseList
      }
    }
    default:
      return state
  }
}


// Action Creators
export function fetchInterfaceColList (projectId) {
  return {
    type: FETCH_INTERFACE_COL_LIST,
    payload: axios.get('/api/col/list?project_id=' + projectId)
  }
}

export function fetchInterfaceCaseList(colId){
  return {
    type: FETCH_INTERFACE_CASE_LIST,
    payload: axios.get('/api/col/case_list?col_id=' + colId)
  }
}
