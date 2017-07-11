import {
  FETCH_INTERFACE_DATA,
} from '../../actionTypes.js'

export default (state = 3333, action) => {
  switch (action.type) {
    case FETCH_INTERFACE_DATA: {
      return {
        ...state,
        icons: action.payload.data,
      };
    }
    default:
      return state;
  }
}
