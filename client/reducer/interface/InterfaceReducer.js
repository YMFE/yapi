import {
  FETCH_INTERFACE_DATA,
  LIST_INTERFACE_CLICK,
  PROJECT_MEMBER_INTERFACE,
  DELETE_INTERFACE_DATA
} from '../../constants/action-types.js'

const initialState = {
  interfaceData: [],
  modalVisible: false,
  interfaceName: ''
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
    default:
      return state
  }
}
