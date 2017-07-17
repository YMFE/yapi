import {
  FETCH_NEWS_DATA
} from '../../constants/action-types.js'

const initialState = {
  newsData: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEWS_DATA: {
      return {
        ...state,
        newsData: action.payload
      };
    }
    default:
      return state;
  }
}
