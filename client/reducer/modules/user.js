import axios from 'axios';

// Actions
const LOGIN = 'yapi/user/LOGIN';
const LOGIN_OUT = 'yapi/user/LOGIN_OUT';
const LOGIN_TYPE = 'yapi/user/LOGIN_TYPE';
const GET_LOGIN_STATE = 'yapi/user/GET_LOGIN_STATE';
const REGISTER = 'yapi/user/REGISTER';

// Reducer
const LOADING_STATUS = 0;
const GUEST_STATUS = 1;
const MEMBER_STATUS = 2;
// Reducer user
const initialState = {
  isLogin: false,
  userName: null,
  uid: null,
  email: '',
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

// Action Creators
export function checkLoginState() {
  return(dispatch)=> {
    axios.get('/user/status').then((res) => {
      dispatch({
        type: GET_LOGIN_STATE,
        payload: res
      });
    }).catch((err) => {
      console.log(err);
    })
  }
}

export function loginActions(data) {
  return {
    type: LOGIN,
    payload: axios.post('/user/login', data)
  };
}

export function regActions(data) {
  const { email, password, userName } = data;
  const param = {
    email,
    password,
    username: userName
  };
  return {
    type: REGISTER,
    payload: axios.post('/user/reg', param)
  };
}

export function logoutActions() {
  return {
    type: LOGIN_OUT,
    payload: axios.get('./user/logout')
  }
}

export function loginTypeAction(index) {
  return{
    type: LOGIN_TYPE,
    index
  }
}
