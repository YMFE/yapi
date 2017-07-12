import {
  LOGIN
} from '../../constants/action-types';

const initialState = {
  isLogin: false,
  userName: null,
  uid: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isLogin: true,
        userName: action.userName
      };
    }
    default:
      return state;
  }
};
