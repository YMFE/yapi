import {
  LOGIN,
  REGISTER,
  LOGIN_TYPE
} from '../constants/action-types.js';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const loginActions = (data) => {
  return (dispatch) => {
    axios.get('/user/login', data).then((res) => {
      cookies.set(data.email, data.password);
      dispatch({
        type: LOGIN,
        payload: {
          data: res
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }
}

const regActions = (data) => {
  return {
    type: REGISTER,
    data
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
