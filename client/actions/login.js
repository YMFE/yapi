import {
  LOGIN,
  REGISTER,
  LOGIN_TYPE
} from '../constants/action-types.js';
// import Server from '../server/listRequest';

const loginActions = (data) => {
  console.log(data);
  return {
    type: LOGIN,
    data
  };
}

const regActions = (data) => {
  console.log(data);
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
