// Actions
const FETCH_INTERFACE_DATA = 'yapi/interface/FETCH_INTERFACE_DATA';
const LIST_INTERFACE_CLICK = 'yapi/interface/LIST_INTERFACE_CLICK';
const PROJECT_MEMBER_INTERFACE = 'yapi/interface/PROJECT_MEMBER_INTERFACE';
const DELETE_INTERFACE_DATA = 'yapi/interface/DELETE_INTERFACE_DATA';
const SAVE_INTERFACE_PROJECT_ID = 'yapi/interface/SAVE_INTERFACE_PROJECT_ID';
const GET_INTERFACE_GROUP_LIST = 'yapi/interface/GET_INTERFACE_GROUP_LIST';

// Reducer
const initialState = {
  interfaceData: [],
  modalVisible: false,
  interfaceName: '',
  projectId: '',
  memberList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INTERFACE_DATA:
      return {
        ...state,
        interfaceData: action.payload
      }
    case LIST_INTERFACE_CLICK:
      return {
        ...state,
        modalVisible: true
      }
    case PROJECT_MEMBER_INTERFACE:
      return {
        ...state,
        modalVisible: false
      }
    case DELETE_INTERFACE_DATA:
      return {
        ...state,
        interfaceData: action.payload
      }
    case SAVE_INTERFACE_PROJECT_ID:
      return {
        ...state,
        projectId: action.payload
      }
    case GET_INTERFACE_GROUP_LIST:
      return {
        ...state,
        projectId: action.payload
      }
    default:
      return state
  }
}


// Action Creators
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
