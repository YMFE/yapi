import {
  LOGIN,
  REGISTER
} from '../actionTypes.js';
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

export default {
  loginActions,
  regActions
}
