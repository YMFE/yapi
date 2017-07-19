import {
  LOGIN,
  LOGIN_OUT,
  LOGIN_TYPE
} from '../../constants/action-types';

const initialState = {
  isLogin: false,
  userName: null,
  uid: null,
  loginWrapActiveKey:"1"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      console.log(action);
      return {
        ...state,
        isLogin: true,
        userName: action.payload.data.userName
      };
    }
    case LOGIN_OUT: {
      return{
        ...state,
        isLogin: false,
        userName: null,
        uid: null
      }
    }
    case LOGIN_TYPE: {
      return {
        ...state,
        loginWrapActiveKey: action.index
      };
    }
    default:
      return state;
  }
};
