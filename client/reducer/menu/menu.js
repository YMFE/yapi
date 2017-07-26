import {
  CHANGE_MENU_ITEM
} from '../../constants/action-types.js'

const initialState = {
  curKey: '/'+window.location.hash.split("/")[1]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MENU_ITEM: {
      return {
        ...state,
        curKey: action.data
      };
    }
    default:
      return state;
  }
}

