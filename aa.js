const {sandbox} = require('./server/utils/commons.js')

const data = {
  a:{
    t:1
  }
};
const obj = sandbox(data, 'a.t=2');

console.log(obj)