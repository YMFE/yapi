import React, { Component } from 'react';
import './Follows.scss';
import Subnav from '../../components/Subnav/Subnav.js';
console.log('js in');

class Follows extends Component {
  render () {
    console.log('render');
    return (
      <div>
        <Subnav
          default={'我的关注'}
          data={[{
            name: '项目广场',
            path: '/group'
          }, {
            name: '我的关注',
            path: '/follow'
          }]}/>
        <div className="g-row">
          我的关注页
        </div>
      </div>
    )
  }
}

export default Follows;
