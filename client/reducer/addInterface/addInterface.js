import {
  FETCH_ADD_INTERFACE_INPUT,
  FETCH_ADD_INTERFACE_TAG_VALUE,
  FETCH_ADD_INTERFACE_HEADER_VALUE,
  ADD_INTERFACE_SEQ_HEADER,
  DELETE_INTERFACE_SEQ_HEADER,
  ADD_INTERFACE_REQ_PARAMS
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
  seqParams: [
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
        seqParams: action.payload
      }
    default:
      return state
  }
}
