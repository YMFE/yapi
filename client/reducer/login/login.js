import {
  LOGIN,
  LOGIN_OUT,
  LOGIN_TYPE,
  GET_LOGIN_STATE
} from '../../constants/action-types';

const initialState = {
  isLogin: false,
  userName: null,
  uid: null,
  loginWrapActiveKey:"1"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGIN_STATE: {
      return {
        ...state,
        isLogin: (action.payload.data.errcode == 0),
        userName: action.payload.data.data ? action.payload.data.data.username : null
      };
    }
    case LOGIN: {
      return {
        ...state,
        isLogin: true,
        uid: action.payload.data.uid,
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
