const crypto = require('crypto')
;

module.exports = (str) => {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
};

