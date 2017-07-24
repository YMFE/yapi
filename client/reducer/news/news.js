import {
  FETCH_NEWS_DATA,
  FETCH_MORE_NEWS
} from '../../constants/action-types.js'

const initialState = {
  newsData: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEWS_DATA: {
      // console.log(action.payload);
      return {
        ...state,
        newsData: action.payload
      };
    }
    case FETCH_MORE_NEWS: {
      return {
        newsData: {
          ...state.newsData,
          newsList: action.payload
        }
      }
    }
    default:
      return state;
  }
}

