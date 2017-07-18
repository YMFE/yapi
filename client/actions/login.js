import {
  LOGIN,
  LOGIN_TYPE
} from '../constants/action-types.js';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const loginActions = (data) => {
  return (dispatch) => {
    axios.post('/user/login', data).then((res) => {
      if (res.data.data.errcode === 0) {
        cookies.set(data.email, data.password);
        dispatch({
          type: LOGIN,
          payload: {
            data: res
          }
        });
      } else {
        console.log('登录失败');
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}

const regActions = (data) => {
  console.log(data);
  const param = {
    email: data.email,
    password: data.password,
    username: data.userName
  }
  return () => {
    axios.post('/user/login', param).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
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
  loginTypeAction
}
