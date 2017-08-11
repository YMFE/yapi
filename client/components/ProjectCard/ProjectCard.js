import './ProjectCard.scss';
import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    projectData: PropTypes.object
  }

  render() {
    const { projectData } = this.props;
    console.log(projectData);
    return (
      <Link to={`/project/${projectData._id}`}>
        <Card bordered={false} bodyStyle={{padding: 16}} className="m-card">
          <div className="m-card-logo">
            <Icon type="area-chart" className="icon" />
            <p className="name">{projectData.name}</p>
          </div>
          <div className="m-card-btns" style={{display: 'none'}}>btns</div>
        </Card>
      </Link>
    )
  }

}

export default ProjectCard
