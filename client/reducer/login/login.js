import {
  LOGIN,
  LOGIN_OUT,
  LOGIN_TYPE,
  GET_LOGIN_STATE,
  REGISTER
} from '../../constants/action-types';

const LOADING_STATUS = 0;
const GUEST_STATUS = 1;
const MEMBER_STATUS = 2;

const initialState = {
  isLogin: false,
  userName: null,
  uid: null,
  loginState: LOADING_STATUS,
  loginWrapActiveKey: "1"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGIN_STATE: {
      console.log(action.payload.data);
      return {
        ...state,
        isLogin: (action.payload.data.errcode == 0),
        role: action.payload.data.data ? action.payload.data.data.role:null,
        loginState: (action.payload.data.errcode == 0)?MEMBER_STATUS:GUEST_STATUS,
        userName: action.payload.data.data ? action.payload.data.data.username : null,
        uid: action.payload.data.data ? action.payload.data.data._id : null,
        server_ip: action.payload.data.data ? action.payload.data.data.server_ip:null
      };
    }
    case LOGIN: {
      if (action.payload.data.errcode === 0) {
        return {
          ...state,
          isLogin: true,
          loginState: MEMBER_STATUS,
          uid: action.payload.data.data.uid,
          role: action.payload.data.data.role,
          userName: action.payload.data.data.username,
          server_ip: action.payload.data.data.server_ip
        };
      } else {
        return state;
      }
    }
    case LOGIN_OUT: {
      return{
        ...state,
        isLogin: false,
        loginState: GUEST_STATUS,
        userName: null,
        role: null,
        uid: null
      }
    }
    case LOGIN_TYPE: {
      return {
        ...state,
        loginWrapActiveKey: action.index
      };
    }
    case REGISTER: {
      return {
        ...state,
        isLogin: true,
        loginState: MEMBER_STATUS,
        uid: action.payload.data.data.uid,
        userName: action.payload.data.data.username
      };
    }
    default:
      return state;
  }
};
