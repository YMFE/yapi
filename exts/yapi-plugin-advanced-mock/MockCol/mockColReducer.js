import axios from 'axios'

import {  message } from 'antd'

// Actions
const FETCH_MOCK_COL = 'yapi/mockCol/FETCH_MOCK_COL';

// Reducer
const initialState = {
  list: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MOCK_COL:
      return {
        ...state,
        list: action.payload.data
      }
    default:
      return state
  }
}

// Action Creators
export async function fetchMockCol(interfaceId) {
  let result = await axios.get('/api/plugin/advmock/case/list?interface_id=' + interfaceId);
  if(result.errcode !==0 ){
     message.error(result.errmsg);
     
  }
  return {
    type: FETCH_MOCK_COL,
    payload: result.data
  }
}
