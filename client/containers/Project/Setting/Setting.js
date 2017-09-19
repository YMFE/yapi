import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ProjectMessage from './ProjectMessage/ProjectMessage.js';

import './Setting.scss';

class Setting extends Component {
  static propTypes = {
    match: PropTypes.object
  }
  render () {
    const id = this.props.match.params.id;
    return (
      <div className="g-row">
        <ProjectMessage projectId={+id}/>
      </div>
    )
  }
}

export default Setting;
