import {
  FETCH_INTERFACE_DATA,
  LIST_INTERFACE_CLICK,
  PROJECT_MEMBER_INTERFACE,
  DELETE_INTERFACE_DATA,
  SAVE_INTERFACE_PROJECT_ID,
  GET_INTERFACE_GROUP_LIST
} from '../../constants/action-types.js'

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
