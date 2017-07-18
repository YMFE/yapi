import {
  FETCH_ADD_INTERFACE_INPUT
} from '../../constants/action-types.js'

const initialState = {
  inputValue: null,
  modalVisible: false
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
    default:
      return state
  }
}
