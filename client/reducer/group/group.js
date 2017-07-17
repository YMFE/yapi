import {
  FETCH_GROUP_LIST,
  SET_CURR_GROUP
} from '../../constants/action-types';

const initialState = {
  groupList: [],
  currGroup: 'MFE'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_LIST: {
      if (!action.payload.data.errcode) {
        return {
          ...state,
          groupList: action.payload.data.data
        };
      }
      return state;
    }
    case SET_CURR_GROUP: {
      return {
        ...state,
        currGroup: action.payload
      };
    }

    default:
      return state;
  }
};
