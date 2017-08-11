import React, { Component } from 'react';
import './Follows.scss';
import Subnav from '../../components/Subnav/Subnav.js';
import ProjectCard from '../../components/ProjectCard/ProjectCard.js';

class Follows extends Component {
  render () {
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
          <div className="follow-box">
            <div className="follow-container">
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Follows;
