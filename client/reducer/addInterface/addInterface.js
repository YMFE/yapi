import {
  FETCH_ADD_INTERFACE_INPUT,
  FETCH_ADD_INTERFACE_TAG_VALUE,
  FETCH_ADD_INTERFACE_HEADER_VALUE,
  ADD_INTERFACE_SEQ_HEADER,
  DELETE_INTERFACE_SEQ_HEADER,
  ADD_INTERFACE_REQ_PARAMS,
  DELETE_INTERFACE_REQ_PARAMS,
  ADD_INTERFACE_RES_PARAMS,
  DELETE_INTERFACE_RES_PARAMS
} from '../../constants/action-types.js'

const initialState = {
  inputValue: '',
  tagValue: '',
  headerValue: '',
  // 默认请求头部有一条数据
  seqGroup: [
    {
      id: 0,
      tag: '',
      content: ''
    }
  ],
  reqParams: [
    {
      id: 0,
      paramsName: '',
      describe: ''
    }
  ],
  resParams: [
    {
      id: 0,
      paramsName: '',
      describe: ''
    }
  ]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADD_INTERFACE_INPUT:
      return {
        ...state,
        inputValue: action.payload
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
    case ADD_INTERFACE_REQ_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      }
    case DELETE_INTERFACE_REQ_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      }
    case ADD_INTERFACE_RES_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      }
    case DELETE_INTERFACE_RES_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      }
    default:
      return state
  }
}
