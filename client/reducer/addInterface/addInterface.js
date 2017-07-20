import {
  FETCH_ADD_INTERFACE_INPUT,
  FETCH_ADD_INTERFACE_TAG_VALUE,
  FETCH_ADD_INTERFACE_HEADER_VALUE,
  ADD_INTERFACE_SEQ_HEADER,
  DELETE_INTERFACE_SEQ_HEADER,
  GET_INTERFACE_REQ_PARAMS,
  GET_INTERFACE_RES_PARAMS,
  SAVE_INTERFACE_FORMS,
  PUSH_INTERFACE_NAME,
  PUSH_INTERFACE_METHOD
} from '../../constants/action-types.js'

const initialState = {
  inputValue: '',
  tagValue: '',
  headerValue: '',
  methode: '',
  // 默认请求头部有一条数据
  seqGroup: [
    {
      id: 0,
      tag: '',
      content: ''
    }
  ],
  reqParams: '',
  resParams: ''
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
    case SAVE_INTERFACE_FORMS:
      return {
        ...state,
        resParams: action.payload
      }
    case PUSH_INTERFACE_NAME:
      return {
        ...state,
        resParams: action.payload
      }
    case PUSH_INTERFACE_METHOD:
      return {
        ...state,
        methode: action.payload
      }
    default:
      return state
  }
}
