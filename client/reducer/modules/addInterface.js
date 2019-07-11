// Actions
const FETCH_ADD_INTERFACE_INPUT = 'yapi/addInterface/FETCH_ADD_INTERFACE_INPUT';
const FETCH_ADD_INTERFACE_TAG_VALUE = 'yapi/addInterface/FETCH_ADD_INTERFACE_TAG_VALUE';
const FETCH_ADD_INTERFACE_HEADER_VALUE = 'yapi/addInterface/FETCH_ADD_INTERFACE_HEADER_VALUE';
const ADD_INTERFACE_SEQ_HEADER = 'yapi/addInterface/ADD_INTERFACE_SEQ_HEADER';
const DELETE_INTERFACE_SEQ_HEADER = 'yapi/addInterface/DELETE_INTERFACE_SEQ_HEADER';
const GET_INTERFACE_REQ_PARAMS = 'yapi/addInterface/GET_INTERFACE_REQ_PARAMS';
const GET_INTERFACE_RES_PARAMS = 'yapi/addInterface/GET_INTERFACE_RES_PARAMS';
const PUSH_INTERFACE_NAME = 'yapi/addInterface/PUSH_INTERFACE_NAME';
const PUSH_INTERFACE_METHOD = 'yapi/addInterface/PUSH_INTERFACE_METHOD';
const FETCH_INTERFACE_PROJECT = 'yapi/addInterface/FETCH_INTERFACE_PROJECT';
const ADD_INTERFACE_CLIPBOARD = 'yapi/addInterface/ADD_INTERFACE_CLIPBOARD';

// Reducer
const initialState = {
  interfaceName: '',
  url: '',
  method: 'GET',
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
  project: {},
  clipboard: () => {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADD_INTERFACE_INPUT:
      return {
        ...state,
        url: action.payload
      };
    case FETCH_ADD_INTERFACE_TAG_VALUE:
      return {
        ...state,
        tagValue: action.payload
      };
    case FETCH_ADD_INTERFACE_HEADER_VALUE:
      return {
        ...state,
        headerValue: action.payload
      };
    case ADD_INTERFACE_SEQ_HEADER:
      return {
        ...state,
        seqGroup: action.payload
      };
    case DELETE_INTERFACE_SEQ_HEADER:
      return {
        ...state,
        seqGroup: action.payload
      };
    case GET_INTERFACE_REQ_PARAMS:
      return {
        ...state,
        reqParams: action.payload
      };
    case GET_INTERFACE_RES_PARAMS:
      return {
        ...state,
        resParams: action.payload
      };
    case PUSH_INTERFACE_NAME:
      return {
        ...state,
        interfaceName: action.payload
      };
    case PUSH_INTERFACE_METHOD:
      return {
        ...state,
        method: action.payload
      };
    case FETCH_INTERFACE_PROJECT:
      return {
        ...state,
        project: action.payload.data.data
      };
    case ADD_INTERFACE_CLIPBOARD:
      return {
        ...state,
        clipboard: action.payload
      };
    default:
      return state;
  }
};

// Action Creators
import axios from 'axios';

export function pushInputValue(value) {
  return {
    type: FETCH_ADD_INTERFACE_INPUT,
    payload: value
  };
}

export function reqTagValue(value) {
  return {
    type: FETCH_ADD_INTERFACE_TAG_VALUE,
    payload: value
  };
}

export function reqHeaderValue(value) {
  return {
    type: FETCH_ADD_INTERFACE_HEADER_VALUE,
    payload: value
  };
}

export function addReqHeader(value) {
  return {
    type: ADD_INTERFACE_SEQ_HEADER,
    payload: value
  };
}

export function deleteReqHeader(value) {
  return {
    type: DELETE_INTERFACE_SEQ_HEADER,
    payload: value
  };
}

export function getReqParams(value) {
  return {
    type: GET_INTERFACE_REQ_PARAMS,
    payload: value
  };
}

export function getResParams(value) {
  return {
    type: GET_INTERFACE_RES_PARAMS,
    payload: value
  };
}

export function pushInterfaceName(value) {
  return {
    type: PUSH_INTERFACE_NAME,
    payload: value
  };
}

export function pushInterfaceMethod(value) {
  return {
    type: PUSH_INTERFACE_METHOD,
    payload: value
  };
}

export function fetchInterfaceProject(id) {
  return {
    type: FETCH_INTERFACE_PROJECT,
    payload: axios.get('/api/project/get', { params: { id } })
  };
}

export function addInterfaceClipboard(func) {
  return {
    type: ADD_INTERFACE_CLIPBOARD,
    payload: func
  };
}
