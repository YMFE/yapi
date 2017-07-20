import {
  FETCH_GROUP_LIST,
  SET_CURR_GROUP
} from '../../constants/action-types';
import { message } from 'antd'

const initialState = {
  groupList: [],
  currGroup: { group_name: '' }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_LIST: {
      if (action.payload.data.errcode) {
        message.error(action.payload.data.errmsg);
      } else {
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
