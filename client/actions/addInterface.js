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
  FETCH_INTERFACE_PROJECT,
  ADD_INTERFACE_CLIPBOARD
} from '../constants/action-types.js'
import axios from 'axios'

export function pushInputValue (value) {
  return {
    type: FETCH_ADD_INTERFACE_INPUT,
    payload: value
  };
}

export function reqTagValue (value) {
  return {
    type: FETCH_ADD_INTERFACE_TAG_VALUE,
    payload: value
  };
}

export function reqHeaderValue (value) {
  return {
    type: FETCH_ADD_INTERFACE_HEADER_VALUE,
    payload: value
  };
}

export function addReqHeader (value) {
  return {
    type: ADD_INTERFACE_SEQ_HEADER,
    payload: value
  };
}

export function deleteReqHeader (value) {
  return {
    type: DELETE_INTERFACE_SEQ_HEADER,
    payload: value
  };
}

export function getReqParams (value) {
  return {
    type: GET_INTERFACE_REQ_PARAMS,
    payload: value
  };
}

export function getResParams (value) {
  return {
    type: GET_INTERFACE_RES_PARAMS,
    payload: value
  };
}

export function pushInterfaceName (value) {
  return {
    type: PUSH_INTERFACE_NAME,
    payload: value
  }
}

export function pushInterfaceMethod (value) {
  return {
    type: PUSH_INTERFACE_METHOD,
    payload: value
  }
}

export function fetchInterfaceProject(id) {
  return {
    type: FETCH_INTERFACE_PROJECT,
    payload: axios.get('/project/get', { params: {id}})
  }
}

export function addInterfaceClipboard (func) {
  return {
    type: ADD_INTERFACE_CLIPBOARD,
    payload: func
  }
}
