import './ProjectCard.scss';
import React, { Component } from 'react';
import { Card, Icon, Tooltip, message } from 'antd';
import { connect } from 'react-redux'
import { delFollow } from  '../../reducer/modules/follow';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

@connect(
  () => {
    return {}
  },
  {
    delFollow
  }
)
@withRouter
class ProjectCard extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projectData: PropTypes.object,
    isFollowed: PropTypes.bool,
    callbackResult: PropTypes.func,
    history: PropTypes.object,
    delFollow: PropTypes.func
  }

  del = () => {
    console.log('del');
    const id = this.props.projectData.projectid;
    this.props.delFollow(id).then((res) => {
      if (res.payload.data.errcode === 0) {
        this.props.callbackResult();
        message.success('已取消关注！');
      }
    });
  }
  add() {
    console.log('add');
  }
  // <Link to={`/project/${projectData._id}`} className="card-link">
  //
  // </Link>

  // <Popconfirm placement="leftBottom" title={<Icon type="up" />} onConfirm={confirm} okText="确认" cancelText="取消">
  //   <Icon type="star-o" className="icon" onClick={this.clickHandle}/>
  // </Popconfirm>
  render() {
    const { projectData, isFollowed } = this.props;
    return (
      <div className="card-container">
        <Card bordered={false} className="m-card" onClick={() => this.props.history.push('/project/' + projectData._id)}>
          <Icon type="area-chart" className="ui-logo" />
          <h4 className="ui-title">{projectData.name || projectData.projectname}</h4>
        </Card>
        <div className="card-btns">
          <Tooltip placement="rightTop" title={isFollowed ? '取消关注' : '添加关注'}>
            <Icon type={isFollowed ? 'star' : 'star-o'} className="icon" onClick={isFollowed ? this.del : this.add}/>
          </Tooltip>
        </div>
      </div>
    )
  }

}

export default ProjectCard
