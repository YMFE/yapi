import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../Setting.scss';


@connect(
  state => {
    return {
      projectMsg: state.project.projectMsg
    }
  }
)
export default class ProjectRequest extends Component{
  static propTypes = {
    projectMsg: PropTypes.object
  }

  render(){
    return <div>Hi</div>
  }
}