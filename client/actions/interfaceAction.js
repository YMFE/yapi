import {
  FETCH_INTERFACE_DATA,
  LIST_INTERFACE_CLICK,
  PROJECT_MEMBER_INTERFACE,
  DELETE_INTERFACE_DATA,
  SAVE_INTERFACE_PROJECT_ID,
  GET_INTERFACE_GROUP_LIST
} from '../constants/action-types.js'

export function fetchInterfaceData (value) {
  return {
    type: FETCH_INTERFACE_DATA,
    payload: value
  };
}

export function projectMember () {
  return {
    type: LIST_INTERFACE_CLICK
  }
}

export function closeProjectMember () {
  return {
    type: PROJECT_MEMBER_INTERFACE
  }
}

export function deleteInterfaceData (value) {
  return {
    type: DELETE_INTERFACE_DATA,
    payload: value
  }
}

export function saveInterfaceProjectId (value) {
  return {
    type: SAVE_INTERFACE_PROJECT_ID,
    payload: value
  }
}

export function getInterfaceGroupList (value) {
  return {
    type: GET_INTERFACE_GROUP_LIST,
    payload: value
  }
}
