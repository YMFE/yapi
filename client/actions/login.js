import {
  LOGIN,
  LOGIN_OUT,
  LOGIN_TYPE,
  GET_LOGIN_STATE,
  REGISTER
} from '../constants/action-types.js';
import axios from 'axios';


const checkLoginState = () => {
  return(dispatch)=> {
    axios.get('/user/status').then((res) => {
      console.log(res);
      dispatch({
        type: GET_LOGIN_STATE,
        payload: res
      });
    }).catch((err) => {
      console.log(err);
    })
  }
}

const loginActions = (data) => {
  return {
    type: LOGIN,
    payload: axios.post('/user/login', data)
  };
};

const regActions = (data) => {
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
};

const logoutActions = () => {
  return {
    type: LOGIN_OUT,
    payload: axios.get('./user/logout')
  }
}

const loginTypeAction = (index) => {
  return{
    type: LOGIN_TYPE,
    index
  }
}

export default {
  loginActions,
  regActions,
  logoutActions,
  loginTypeAction,
  checkLoginState
}
