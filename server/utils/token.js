const yapi = require('../yapi')

const crypto = require('crypto');

/*
 下面是使用加密算法
*/

// 创建加密算法
const TOKEN_VERSION = 'v2';
const TOKEN_PREFIX = `${TOKEN_VERSION}:`;
const TOKEN_ALGO = 'aes-256-gcm';
const TOKEN_IV_LENGTH = 12;
const TOKEN_SALT = 'yapi-token';

const deriveKey = function(password) {
  return crypto.scryptSync(password, TOKEN_SALT, 32);
};

const aseEncode = function(data, password) {
  const key = deriveKey(password);
  const iv = crypto.randomBytes(TOKEN_IV_LENGTH);
  const cipher = crypto.createCipheriv(TOKEN_ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${TOKEN_PREFIX}${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
};

// 创建解密算法
const aseDecodeV2 = function(data, password) {
  if (!data || data.indexOf(TOKEN_PREFIX) !== 0) return null;
  const parts = data.split(':');
  if (parts.length !== 4) return null;
  const iv = Buffer.from(parts[1], 'hex');
  const tag = Buffer.from(parts[2], 'hex');
  const encrypted = Buffer.from(parts[3], 'hex');
  const key = deriveKey(password);
  const decipher = crypto.createDecipheriv(TOKEN_ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf-8');
};

const aseDecodeLegacy = function(data, password) {
  if (typeof crypto.createDecipher !== 'function') return null;
  try {
    const decipher = crypto.createDecipher('aes192', password);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (e) {
    return null;
  }
};

const aseDecode = function(data, password) {
  const v2 = aseDecodeV2(data, password);
  if (v2) return v2;
  return aseDecodeLegacy(data, password);
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
