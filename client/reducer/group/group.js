import {
  FETCH_GROUP_LIST,
  FETCH_CURR_GROUP
} from '../../constants/action-types';

const initialState = {
  groupList: [],
  currGroup: 'MFE'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_LIST: {
      if (action.payload.res) {
        return {
          ...state,
          groupList: action.payload.data
        };
      }
      return state;
    }
    case FETCH_CURR_GROUP: {
      if (action.payload.res) {
        return {
          ...state,
          currGroup: action.payload.data
        };
      }
      return state;
    }

    default:
      return state;
  }
};
