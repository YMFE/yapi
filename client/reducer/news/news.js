import {
  FETCH_NEWS_DATA,
  FETCH_MORE_NEWS
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
    case FETCH_MORE_NEWS: {
      state.newsData.push(...action.payload);
      return {
        ...state
      }
    }
    default:
      return state;
  }
}

