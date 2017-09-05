const request = require('request');

module.exports = function () {
  this.bindHook('third_login', () => {
    return {
      request: (token) => {
        return new Promise((resolve, reject) => {
          request('http://qsso.corp.qunar.com/api/verifytoken.php?token=' + token, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              let result = JSON.parse(body);
              if (result && result.ret === true) {
                let ret = {
                  email: result.userId + '@qunar.com',
                  username: result.data.userInfo.name
                };
                resolve(ret);
              } else {
                reject(result);
              }
            }
            reject(error);
          });
        });
      },
      tokenField: 'token'
    };
  })
}