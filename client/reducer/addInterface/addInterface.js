import {
  FETCH_ADD_INTERFACE_INPUT,
  FETCH_ADD_INTERFACE_TAG_VALUE,
  FETCH_ADD_INTERFACE_HEADER_VALUE,
  ADD_INTERFACE_SEQ_HEADER,
  DELETE_INTERFACE_SEQ_HEADER,
  GET_INTERFACE_REQ_PARAMS,
  GET_INTERFACE_RES_PARAMS,
  PUSH_INTERFACE_NAME,
  PUSH_INTERFACE_METHOD,
  FETCH_INTERFACE_PROJECT
} from '../../constants/action-types.js'

const initialState = {
  interfaceName: '',
  url: '',
  method: '',
  // 默认请求头部有一条数据
  seqGroup: [
    {
      id: 0,
      name: '',
      value: ''
    }
  ],
  reqParams: '',
  resParams: '',
  project: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADD_INTERFACE_INPUT:
      return {
        ...state,
        url: action.payload
      }
    case FETCH_ADD_INTERFACE_TAG_VALUE:
      return {
        ...state,
        tagValue: action.payload
      }
    case FETCH_ADD_INTERFACE_HEADER_VALUE:
      return {
        ...state,
        headerValue: action.payload
      }
    case ADD_INTERFACE_SEQ_HEADER:
      return {
        ...state,
        seqGroup: action.payload
      }
    case DELETE_INTERFACE_SEQ_HEADER:
      return {
        ...state,
        seqGroup: action.payload
      }
    case GET_INTERFACE_REQ_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      }
    case GET_INTERFACE_RES_PARAMS:
      return {
        ...state,
        resParams: action.payload
      }
    case PUSH_INTERFACE_NAME:
      return {
        ...state,
        interfaceName: action.payload
      }
    case PUSH_INTERFACE_METHOD:
      return {
        ...state,
        method: action.payload
      }
    case FETCH_INTERFACE_PROJECT:
      return {
        ...state,
        project: action.payload.data.data
      }
    default:
      return state
  }
}
