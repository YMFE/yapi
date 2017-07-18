import {
  CHANGE_CUR_UID
} from '../../constants/action-types';

const initialState = {
  curUid: "0"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CUR_UID: {
      return {
        ...state,
        curUid: action.data
      };
    }

    default:
      return state;
  }
};
