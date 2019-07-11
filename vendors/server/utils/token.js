const yapi = require('../yapi')

const crypto = require('crypto');

/*
 下面是使用加密算法
*/

// 创建加密算法
const aseEncode = function(data, password) {

  // 如下方法使用指定的算法与密码来创建cipher对象
  const cipher = crypto.createCipher('aes192', password);

  // 使用该对象的update方法来指定需要被加密的数据
  let crypted = cipher.update(data, 'utf-8', 'hex');

  crypted += cipher.final('hex');

  return crypted;
};

// 创建解密算法
const aseDecode = function(data, password) {
  /* 
   该方法使用指定的算法与密码来创建 decipher对象, 第一个算法必须与加密数据时所使用的算法保持一致;
   第二个参数用于指定解密时所使用的密码，其参数值为一个二进制格式的字符串或一个Buffer对象，该密码同样必须与加密该数据时所使用的密码保持一致
  */
  const decipher = crypto.createDecipher('aes192', password);

  /*
   第一个参数为一个Buffer对象或一个字符串，用于指定需要被解密的数据
   第二个参数用于指定被解密数据所使用的编码格式，可指定的参数值为 'hex', 'binary', 'base64'等，
   第三个参数用于指定输出解密数据时使用的编码格式，可选参数值为 'utf-8', 'ascii' 或 'binary';
  */
  let decrypted = decipher.update(data, 'hex', 'utf-8');

  decrypted += decipher.final('utf-8');
  return decrypted;
}; 

const defaultSalt = 'abcde';

exports.getToken = function getToken(token, uid){
  if(!token)throw new Error('token 不能为空')
  yapi.WEBCONFIG.passsalt = yapi.WEBCONFIG.passsalt || defaultSalt;
  return aseEncode(uid + '|' + token, yapi.WEBCONFIG.passsalt)
}

exports.parseToken = function parseToken(token){
  if(!token)throw new Error('token 不能为空')
  yapi.WEBCONFIG.passsalt = yapi.WEBCONFIG.passsalt || defaultSalt;
  let tokens;
  try{
    tokens = aseDecode(token, yapi.WEBCONFIG.passsalt)
  }catch(e){}  
  if(tokens && typeof tokens === 'string' && tokens.indexOf('|') > 0){
    tokens = tokens.split('|')
    return {
      uid: tokens[0],
      projectToken: tokens[1]
    }
  }
  return false;
  
}

