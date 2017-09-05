import React from 'react';
const Qsso = require('./Qsso.js');

class QssoComponent extends React.Component{
  componentDidMount(){
    Qsso.attach('qsso-login', '/api/user/login_by_token')
  }

  render(){
    return <button id="qsso-login"   className="btn-home btn-home-normal" >QSSO 登录</button>
  }
}



module.exports = function(bindHook){
  bindHook('third_login', QssoComponent);
};

